<?php
	
	error_reporting(null);

	require 'vendor/autoload.php';

	$router = new Klein\Klein();

	$router->respond('GET', '/loading', function($request, $response, $service){
		$service->render('views/loading.html');
	});

	$router->respond('GET', '/404', function($request, $response, $service){
		$service->render('views/404.html');
	});

	$router->respond('GET', '/embed/[:make_id]', function($request, $response){
		try {
			$make_details = @file_get_contents("http://makeapi.webmaker.org/api/20130724/make/search?id=" . $request->make_id);
			$make_details = @json_decode($make_details);

			if(!$make_details->makes){
				return file_get_contents('http://pkittle.makes.org/popcorn/1970_');
			}

			$make_details = $make_details->makes[0];
			return file_get_contents($make_details->url . '_');
		}
		catch(Exception $e) {
			if(!$make_details->makes){
				return file_get_contents('http://pkittle.makes.org/popcorn/1970_');
			}
		}
	});

	$router->respond('GET', '/player', function($request, $response, $service){
		$service->render('views/player.html');
	});

	$router->respond('GET', '/', function($request, $response, $service){
		$response->redirect('/player');
	});

	$router->dispatch();