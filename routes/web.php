<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/', function () {
  	return view('index');
});

// Routes for Uhoo API
Route::get('uhoo/');
Route::get('uhoo/data/devices', 'ApiController@getUhooDevices');
Route::get('uhoo/data/meters', 'ApiController@getUhooData');

// Routes for Uhoo meters and devices view
Route::get('uhoo/devices', 'ApiController@deviceView');
Route::get('uhoo/meters', 'ApiController@meterView');
Route::get('uhoo/meter/detail/{id}', 'ApiController@meterDetail');


