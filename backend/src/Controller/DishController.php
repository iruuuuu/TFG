<?php

namespace App\Controller;

use App\Entity\Dish;
use App\Repository\DishRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/dishes')]
class DishController extends AbstractController
{
    #[Route('', name: 'api_dishes_list', methods: ['GET'])]
    public function list(DishRepository $dishRepository): JsonResponse
    {
        $dishes = $dishRepository->findBy(['isActive' => true]);

        return $this->json(array_map(function(Dish $dish) {
            return [
                'id' => $dish->getId(),
                'name' => $dish->getName(),
                'description' => $dish->getDescription(),
                'category' => $dish->getCategory(),
                'allergens' => $dish->getAllergens(),
                'nutritionalInfo' => $dish->getNutritionalInfo(),
                'price' => $dish->getPrice(),
                'imageUrl' => $dish->getImageUrl()
            ];
        }, $dishes));
    }

    #[Route('/{id}', name: 'api_dishes_show', methods: ['GET'])]
    public function show(Dish $dish): JsonResponse
    {
        return $this->json([
            'id' => $dish->getId(),
            'name' => $dish->getName(),
            'description' => $dish->getDescription(),
            'category' => $dish->getCategory(),
            'allergens' => $dish->getAllergens(),
            'nutritionalInfo' => $dish->getNutritionalInfo(),
            'price' => $dish->getPrice(),
            'imageUrl' => $dish->getImageUrl()
        ]);
    }

    #[Route('', name: 'api_dishes_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $data = json_decode($request->getContent(), true);

        $dish = new Dish();
        $dish->setName($data['name']);
        $dish->setDescription($data['description'] ?? null);
        $dish->setCategory($data['category']);
        $dish->setAllergens($data['allergens'] ?? []);
        $dish->setNutritionalInfo($data['nutritionalInfo'] ?? []);
        $dish->setPrice($data['price']);
        $dish->setImageUrl($data['imageUrl'] ?? null);

        $em->persist($dish);
        $em->flush();

        return $this->json([
            'message' => 'Plato creado correctamente',
            'id' => $dish->getId()
        ], 201);
    }

    #[Route('/{id}', name: 'api_dishes_update', methods: ['PUT'])]
    public function update(Dish $dish, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $data = json_decode($request->getContent(), true);

        $dish->setName($data['name'] ?? $dish->getName());
        $dish->setDescription($data['description'] ?? $dish->getDescription());
        $dish->setCategory($data['category'] ?? $dish->getCategory());
        $dish->setAllergens($data['allergens'] ?? $dish->getAllergens());
        $dish->setNutritionalInfo($data['nutritionalInfo'] ?? $dish->getNutritionalInfo());
        $dish->setPrice($data['price'] ?? $dish->getPrice());
        $dish->setImageUrl($data['imageUrl'] ?? $dish->getImageUrl());

        $em->flush();

        return $this->json(['message' => 'Plato actualizado correctamente']);
    }

    #[Route('/{id}', name: 'api_dishes_delete', methods: ['DELETE'])]
    public function delete(Dish $dish, EntityManagerInterface $em): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $dish->setIsActive(false);
        $em->flush();

        return $this->json(['message' => 'Plato eliminado correctamente']);
    }
}
