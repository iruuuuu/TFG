<?php
use App\Kernel;
require_once __DIR__.'/vendor/autoload.php';
$kernel = new Kernel('dev', true);
$kernel->boot();
echo "Booted successfully!" . PHP_EOL;
$container = $kernel->getContainer();
echo "Container loaded." . PHP_EOL;
