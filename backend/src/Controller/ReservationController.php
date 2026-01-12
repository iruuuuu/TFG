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
            return [
                'id' => $reservation->getId(),
                'user' => [
                    'id' => $reservation->getUser()->getId(),
                    'name' => $reservation->getUser()->getName()
                ],
                'dish' => [
                    'id' => $reservation->getDish()->getId(),
                    'name' => $reservation->getDish()->getName()
                ],
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

        $reservation = new Reservation();
        $reservation->setUser($user);
        $reservation->setDish($dish);
        $reservation->setReservationDate(new \DateTime($data['reservationDate']));
        $reservation->setStatus('pending');
        $reservation->setNotes($data['notes'] ?? null);

        $em->persist($reservation);
        $em->flush();

        return $this->json([
            'message' => 'Reserva creada correctamente',
            'id' => $reservation->getId()
        ], 201);
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
        $reservation->setStatus('cancelled');
        $em->flush();

        return $this->json(['message' => 'Reserva cancelada correctamente']);
    }
}
