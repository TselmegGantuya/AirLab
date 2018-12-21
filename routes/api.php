<?php

use Illuminate\Http\Request;
use App\Record;
use App\Device;
use App\Organization;
use App\User;
use App\Blueprint;
use App\Http\Controllers\AuthController;
use App\Http\Resources\Users as UserResource;
use App\Http\Resources\Devices as DeviceResource;
use App\Http\Resources\Blueprints as BlueprintResource;
use App\Http\Resources\Organizations as OrganizationResource;

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
    // Routes for Airlab New Users
    Route::post('user/register', 'RegisterController@createNewUser');

    // Routes for Airlab Users
    Route::get('airlab/user/organization/get', 'UserController@getUserOrganization');
    Route::post('airlab/profile/edit', 'UserController@editProfile');
    Route::post('user/info/get', 'UserController@getUserInfo');

    // Routes for Airlab Auths
    Route::post('refresh', 'AuthController@refresh');
    Route::post('me', 'AuthController@me');
    Route::get('getUsersOrg', 'UserController@getUserOrganization');
    Route::post('logout', 'AuthController@logout');

    // Routes for Airlab Blueprints
    Route::get('blueprint/get', 'BlueprintController@getBlueprint');
    Route::get('blueprint/fullscreen/get', 'BlueprintController@getBlueprintFullscreen');
    Route::get('blueprint/devices/get', 'BlueprintController@getUserDevices');
    Route::get('blueprint/db/devices/get', 'BlueprintController@getUserDBDevices');
    Route::post('blueprint/upload', 'BlueprintController@uploadBlueprint');
    Route::post('blueprint/admin/upload', 'BlueprintController@uploadBlueprintAdmin');
    Route::post('blueprint/update', 'BlueprintController@updateBlueprint');
    Route::post('blueprint/name/change', 'BlueprintController@changeBlueprintName');
    Route::post('blueprint/coordinations/get', 'BlueprintController@getCoordination');
    Route::post('blueprint/delete', 'BlueprintController@deleteBlueprint');
    Route::post('blueprint/device/remove', 'BlueprintController@removeDeviceFromBlueprint');
    Route::post('blueprint/records/device/get', 'BlueprintController@getRecordsForDevice');

    // Routes for Airlab API
    Route::get('airlab/devices/data/get', 'ApiController@getDevicesWithData');
    Route::get('airlab/records/id/get', 'ApiController@getRecordsById');
    Route::get('airlab/device/records/chart/get', 'ApiController@getRecordsByProperty');

    // Routes for Airlab Organizations
    Route::get('airlab/organizations/get', 'OrganizationController@getOrganizations');

    // Routes for Airlab Devices
    Route::get('airlab/devices/organization/get', 'DeviceController@getDevicesOrganization');
    Route::get('airlab/new/devices/get', 'DeviceController@getNewDevices');
    Route::post('airlab/device/organization/add', 'DeviceController@addDeviceOrg');
    Route::post('airlab/device/organization/delete', 'DeviceController@deleteDevicesOrganization');
    Route::post('airlab/device/edit', 'DeviceController@editDevice');

    // Routes for Uhoo API
    Route::post('uhoo/data/devices/get', 'ApiController@getUhooDevices');
    Route::post('uhoo/data/records/get', 'ApiController@getUhooData');
});
