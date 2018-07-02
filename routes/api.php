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
	Route::post('uhoo/');
	Route::post('uhoo/data/devices', 'ApiController@getUhooDevices');
	Route::post('uhoo/data/meters', 'ApiController@getUhooData');

	// Routes for Uhoo meters and devices view
	Route::post('uhoo/devices', 'ApiController@deviceView');
	Route::post('uhoo/meters', 'ApiController@meterView');
	Route::post('uhoo/last-meter', 'ApiController@lastMeter');
	Route::post('uhoo/user/device', 'ApiController@userDevice');
	Route::post('uhoo/meter/detail/{id}', 'ApiController@meterDetail');

});