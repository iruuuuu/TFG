<?php

namespace App\Controller;

use App\Entity\Reservation;
use App\Repository\ReservationRepository;
use App\Repository\DishRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/reservations')]
class ReservationController extends AbstractController
{
    #[Route('', name: 'api_reservations_list', methods: ['GET'])]
    public function list(ReservationRepository $reservationRepository): JsonResponse
    {
        $user = $this->getUser();
        
        if (in_array('ROLE_ADMIN', $user->getRoles()) || in_array('ROLE_KITCHEN', $user->getRoles())) {
            $reservations = $reservationRepository->findAll();
        } else {
            $reservations = $reservationRepository->findBy(['user' => $user]);
        }

        return $this->json(array_map(function(Reservation $reservation) {
            $dish = $reservation->getDish();
            return [
                'id' => $reservation->getId(),
                'user' => [
                    'id' => $reservation->getUser()->getId(),
                    'name' => $reservation->getUser()->getName()
                ],
                'dish' => [
                    'id' => $dish->getId(),
                    'name' => $dish->getName(),
                    'availableDate' => $dish->getAvailableDate()->format('Y-m-d'),
                    'stockAvailable' => $dish->getStockAvailable()
                ],
                'quantity' => $reservation->getQuantity(),
                'reservationDate' => $reservation->getReservationDate()->format('Y-m-d'),
                'status' => $reservation->getStatus(),
                'notes' => $reservation->getNotes()
            ];
        }, $reservations));
    }

    #[Route('', name: 'api_reservations_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        DishRepository $dishRepository
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $user = $this->getUser();

        $dish = $dishRepository->find($data['dishId']);
        if (!$dish) {
            return $this->json(['error' => 'Plato no encontrado'], 404);
        }
        
        $quantity = $data['quantity'] ?? 1;
        
        // Validar fecha de disponibilidad
        $today = new \DateTime();
        if ($dish->getAvailableDate() < $today->setTime(0, 0, 0)) {
            return $this->json([
                'error' => 'El plato ya no está disponible para esta fecha'
            ], 400);
        }
        
        // Validar stock disponible
        if (!$dish->hasStock($quantity)) {
            return $this->json([
                'error' => 'Stock insuficiente',
                'available' => $dish->getStockAvailable(),
                'requested' => $quantity
            ], 400);
        }

        try {
            // Usar transacción para garantizar consistencia
            $em->beginTransaction();
            
            // Incrementar stock reservado
            $dish->incrementReserved($quantity);
            
            // Crear reserva
            $reservation = new Reservation();
            $reservation->setUser($user);
            $reservation->setDish($dish);
            $reservation->setQuantity($quantity);
            $reservation->setReservationDate(new \DateTime($data['reservationDate']));
            $reservation->setStatus('pending');
            $reservation->setNotes($data['notes'] ?? null);

            $em->persist($reservation);
            $em->flush();
            $em->commit();

            return $this->json([
                'message' => 'Reserva creada correctamente',
                'id' => $reservation->getId(),
                'stockRemaining' => $dish->getStockAvailable()
            ], 201);
        } catch (\Exception $e) {
            $em->rollback();
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('/{id}', name: 'api_reservations_update', methods: ['PUT'])]
    public function update(Reservation $reservation, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (isset($data['status'])) {
            $reservation->setStatus($data['status']);
        }

        if (isset($data['notes'])) {
            $reservation->setNotes($data['notes']);
        }

        $em->flush();

        return $this->json(['message' => 'Reserva actualizada correctamente']);
    }

    #[Route('/{id}', name: 'api_reservations_cancel', methods: ['DELETE'])]
    public function cancel(Reservation $reservation, EntityManagerInterface $em): JsonResponse
    {
        // Solo permitir cancelar si está en estado pending o confirmed
        if (!in_array($reservation->getStatus(), ['pending', 'confirmed'])) {
            return $this->json([
                'error' => 'No se puede cancelar una reserva en estado ' . $reservation->getStatus()
            ], 400);
        }
        
        try {
            $em->beginTransaction();
            
            // Liberar stock
            $dish = $reservation->getDish();
            $dish->decrementReserved($reservation->getQuantity());
            
            // Cancelar reserva
            $reservation->setStatus('cancelled');
            $em->flush();
            $em->commit();

            return $this->json([
                'message' => 'Reserva cancelada correctamente',
                'stockRestored' => $reservation->getQuantity()
            ]);
        } catch (\Exception $e) {
            $em->rollback();
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }
}
