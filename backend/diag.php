<?php
require 'vendor/autoload.php';
use App\Kernel;
$kernel = new Kernel('dev', true);
try {
    $kernel->boot();
    echo "Booted!";
} catch (\Throwable $e) {
    echo "Exception: " . $e->getMessage() . PHP_EOL;
    echo "File: " . $e->getFile() . ":" . $e->getLine() . PHP_EOL;
    echo "Trace: " . PHP_EOL;
    echo $e->getTraceAsString() . PHP_EOL;
    if (method_exists($e, 'getPath')) {
        echo "Failed path: " . $e->getPath() . PHP_EOL;
    }
}
