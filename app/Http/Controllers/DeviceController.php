<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Auth;
use App\Device;

class DeviceController extends Controller
{
    /**
     * Display all devices from organization
     *
     * [deviceView description]
     * @return [type] [description]
     */
    public function getDevicesOrganization(Request $request)
    {
        if ($request->id) {
            $orgDevices = Device::where('organization_id', $request->id)->get();
        }
        return $orgDevices;
    }

    /**
     * Display all devices with no organization
     *
     * [deviceView description]
     * @return [type] [description]
     */
    public function getNewDevices()
    {
        $cleanDevices = Device::where('organization_id', NULL)->get();
        return $cleanDevices;
    }

    /**
     * Display for adding organization devices
     *
     * [deviceView description]
     * @return [type] [description]
     */
    public function addDeviceOrg(Request $request)
    {
        foreach ($request->device_id as $id) {
            Device::where('id', $id)->update(['organization_id' => $request->organization_id]);
        }
        return $status;
    }

    /**
     * Display for deleting organization devices
     *
     * [deviceView description]
     * @return [type] [description]
     */
    public function deleteDevicesOrganization(Request $request)
    {
        $status = 0;
        foreach ($request->device_id as $id) {
            Device::where('id', $id)->update(['organization_id' => NULL]);
            //softdelete concept
            //Device::where('id', $id)->delete();
            $status = 1;
        }
        return $status;
    }
    /**
     * [editDevice description]
     * @param  Request $request [description]
     * @return [type]           [description]
     */
    public function editDevice(Request $request){
        $id = $request->id;
        $name = $request->name;
        if(isset($id) && isset($name)){
            DB::table('devices')
                ->where('id', $id)
                ->update(['name' => $name]);
        }
        return 'Succes update! ';
    }
}
