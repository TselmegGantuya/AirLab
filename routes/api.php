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


Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::group([

    'middleware' => 'api'

], function ($router) {
    Route::post('user/register', 'RegisterController@create');
    // Route for reset password and email
    Route::post('uhoo/password/reset', 'ApiController@changePassword');

    // Routes for basic Log in
    Route::post('refresh', 'AuthController@refresh');
    Route::post('me', 'AuthController@me');
    Route::post('logout', 'AuthController@logout');

    // Routes for Blueprint
    Route::post('blueprint/upload', 'BlueprintController@uploadBP');
    Route::post('blueprint/upload/admin', 'BlueprintController@uploadBPAdmin');
    Route::post('blueprint/update', 'BlueprintController@updateBP');
    Route::get('blueprint/get', 'BlueprintController@getBP');
    Route::post('blueprint/change/name', 'BlueprintController@changeName');
    Route::post('blueprint/coordinations/get', 'BlueprintController@getCoordination');
    Route::post('blueprint/delete', 'BlueprintController@blueprintDelete');
    Route::get('blueprint/devices/get', 'BlueprintController@getUserDevices');
    Route::get('blueprint/db/devices/get', 'BlueprintController@getUserDBDevices');
    Route::post('blueprint/device/remove', 'BlueprintController@removeDeviceFromBlueprint');
    Route::post('blueprint/records/device', 'BlueprintController@getRecordsForDevice');

    // Routes for Uhoo API
    Route::post('uhoo/');
    Route::post('uhoo/data/devices', 'ApiController@getUhooDevices');
    Route::post('uhoo/data/records', 'ApiController@getUhooData');
    // Routes for organizations and organization's device
    Route::get('uhoo/organizations', 'ApiController@getOrganizations');
    //Getting all devices no class_parent
    Route::get('uhoo/devices/organization', 'ApiController@getDevicesOrganization');
    Route::get('uhoo/new/devices', 'ApiController@getNewDevices');
    //Add device to organization
    Route::post('uhoo/add/device/organization', 'ApiController@addDeviceOrg');
    //Delete device from organization
    Route::post('uhoo/delete/device/organization', 'ApiController@deleteDevicesOrganization');
    //edit device
    Route::post('uhoo/edit/device', 'ApiController@editDevice');
    // Routes for Dashboard
    Route::get('uhoo/data/devices', 'ApiController@getDevicesWithData');
    //routes for records by
    Route::get('uhoo/records/id', 'ApiController@recordsById');


});
