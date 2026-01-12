<?php

namespace App\Repository;

use App\Entity\Dish;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class DishRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Dish::class);
    }

    public function findByCategory(string $category): array
    {
        return $this->createQueryBuilder('d')
            ->andWhere('d.category = :category')
            ->andWhere('d.isActive = :active')
            ->setParameter('category', $category)
            ->setParameter('active', true)
            ->orderBy('d.name', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findPopularDishes(int $limit = 10): array
    {
        return $this->createQueryBuilder('d')
            ->select('d, COUNT(r.id) as HIDDEN reservation_count')
            ->leftJoin('App\Entity\Reservation', 'r', 'WITH', 'd.id = r.dish')
            ->andWhere('d.isActive = :active')
            ->setParameter('active', true)
            ->groupBy('d.id')
            ->orderBy('reservation_count', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
}
