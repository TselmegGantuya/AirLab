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
Route::post('validate', 'RegisterController@validate');
Route::post('create', 'RegisterController@create');

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
  // Getting all organizations

  //START STEFAN
  Route::post('uhoo/organizations', 'ApiController@getOrganizations');
  //Getting all devices no class_parent
  Route::post('uhoo/getDevicesOrganization/', 'ApiController@getDevicesOrganization');
  Route::post('uhoo/getNewDevices/', 'ApiController@getNewDevices');
  //Add device to organization
  Route::post('uhoo/addDeviceOrg/', 'ApiController@addDeviceOrg');
  //Delete device from organization
  Route::post('uhoo/deleteDevicesOrganization/', 'ApiController@deleteDevicesOrganization');
  //END STEFAN
});
