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
    // Route for reset password and email
    Route::post('uhoo/password/reset', 'ApiController@changePassword');

    // Routes for basic Log in
    Route::post('refresh', 'AuthController@refresh');
      Route::post('me', 'AuthController@me');
    Route::post('logout', 'AuthController@logout');

    // Routes for Blueprint
    Route::post('blueprint/upload', 'BlueprintController@uploadBP');
    Route::get('blueprint/get', 'BlueprintController@getBP');
    Route::post('blueprint/changeName', 'BlueprintController@changeName');
    Route::post('blueprint/coordinations/get', 'BlueprintController@getCoordination');
    Route::post('blueprint/delete', 'BlueprintController@blueprintDelete');
    Route::get('blueprint/devices/get', 'BlueprintController@getUserDevices');
    Route::get('blueprint/db/devices/get', 'BlueprintController@getUserDBDevices');

    // Routes for Uhoo API
    Route::post('uhoo/');
    Route::post('uhoo/data/devices', 'ApiController@getUhooDevices');
    Route::post('uhoo/data/records', 'ApiController@getUhooData');

    // Routes for Uhoo records and devices view
    Route::post('uhoo/devices', 'ApiController@deviceView');
    Route::post('uhoo/records', 'ApiController@recordView');
    Route::post('uhoo/record', 'ApiController@recordDetail');
    // Route::post('uhoo/user/device', 'ApiController@userDevice');
    Route::post('uhoo/meter/detail/{id}', 'ApiController@meterDetail');

    // Routes for organizations and organization's device
    Route::post('uhoo/organizations', 'ApiController@getOrganizations');
    //Getting all devices no class_parent
    Route::post('uhoo/getDevicesOrganization', 'ApiController@getDevicesOrganization');
    Route::post('uhoo/getNewDevices', 'ApiController@getNewDevices');
    //Add device to organization
    Route::post('uhoo/addDeviceOrg', 'ApiController@addDeviceOrg');
    //Delete device from organization
    Route::post('uhoo/deleteDevicesOrganization', 'ApiController@deleteDevicesOrganization');

    // Routes for Dashboard
    Route::post('uhoo/getDevicesWithData', 'ApiController@getDevicesWithData');
});