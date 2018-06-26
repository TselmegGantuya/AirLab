<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::post('login', 'AuthController@login');

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::group([

    'middleware' => 'api'

], function ($router) {

    Route::post('refresh', 'AuthController@refresh');
	Route::post('me', 'AuthController@me');
    Route::post('logout', 'AuthController@logout');
    
    // Routes for Uhoo API
	Route::get('uhoo/');
	Route::get('uhoo/data/devices', 'ApiController@getUhooDevices');
	Route::get('uhoo/data/meters', 'ApiController@getUhooData');

	// Routes for Uhoo meters and devices view
	Route::get('uhoo/devices', 'ApiController@deviceView');
	Route::get('uhoo/meters', 'ApiController@meterView');
	Route::post('uhoo/last', 'ApiController@meterLast');
	Route::get('uhoo/meter/detail/{id}', 'ApiController@meterDetail');

});