<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Meter;
use App\Device;
use App\Organization;
use Carbon\Carbon;
use App\Http\Controllers\AuthController;

class ApiController extends Controller
{
    /**
     * Display all devices
     *
     * [deviceView description]
     * @return [type] [description]
     */
    // START STEFAN CODE
    public function getOrganizations()
    {

      $organizations = Organization::all();

      return $organizations;
    }
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
     * Display
     *
     * [deviceView description]
     * @return [type] [description]
     */
    public function addDeviceOrg(Request $request)
    {
      $status = 0;
      foreach ($request->device_id as $id) {
        Device::where('id', $id)->update(['organization_id' => $request->organization_id]);
        $status = 1;
      }
      return $status;
    }
    /**
     * Display
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
    // END STEFAN CODE
    /**
     * Display all devices
     *
     * [deviceView description]
     * @return [type] [description]
     */
    /*
    public function deviceView()
    {
        $devices = Device::all();

        foreach ($devices as $device) {
          if ($device->organization_id == true) {
            $device->organization;
          }else {
            $device->organization_name = 'none';
          }
        }
        return $devices;
    }
    */
    /**
     * Display all meters that belongs to logged in user.
     *
     * @return \Illuminate\Http\Response
     */
    public function meterView(){
        $meters = Meter::all();
        $devices = Device::all();
        $organizations = Organization::all();
        $user = AuthController::me();
        $content = $user->getContent();
        $userInfo = json_decode($content, true);
        $meterray = array();

        foreach ($organizations as $organization) {
            if ($userInfo['name'] == $organization->name) {
                foreach ($devices as $device) {
                    if ($device->organization_id == $organization->id) {
                        foreach ($meters as $meter) {
                            $meter->device_name = $meter->device->name;

                            if ($meter->device_name == $device->name) {
                                $meterray[] = $meter;
                            }
                        }
                    }
                }
            }
        }

        return $meterray;
    }

    /**
     * Display inserted last meter in DB
     *
     * [lastMeter description]
     * @return [type] [description]
     */
    public function lastMeter(){
        $meter = Meter::orderBy('id', 'desc')->first();
        $meter->device_name = $meter->device->name;

        return $meter;
    }

    /**
     * Method to get all devices that belongs to logged in user
     * [userDevice description]
     * @return [type] [description]
     */
    public function userDevice()
    {
        $devices = Device::all();
        $organizations = Organization::all();
        $user = AuthController::me();
        $content = $user->getContent();
        $userInfo = json_decode($content, true);
        $userDevice = array();

        foreach ($organizations as $organization) {
            if ($userInfo['name'] == $organization->name) {
                foreach ($devices as $device) {
                    if ($organization->name == $device->organization->name) {
                        $userDevice[] = $device;
                    }
                }
            }
        }

        return $userDevice;
    }

    // /**
    //  * Display meter details
    //  *
    //  * @param  [type] $id [description]
    //  * @return [type]     [description]
    //  */
    // public function meterDetail($id)
    // {
    //     $device = Device::findOrFail($id);

    //     return view('uhoo_meter_detail', compact('device'));
    // }

    /**
     * Method for getting a list of all available devices.
     *
     * [getUhooData description]
     * @return [type] [description]
     * @return \Illuminate\Http\Response
     */
    public function getUhooDevices()
    {
        $data = array('username' => 'uhoo@theinnoventors.eu', 'password' => '3e24510760d65ee46ba631e4d2d2d04bb1f86fecf56ee2e1248dc59b6749be6e');

        // Receive API by doing an 'POST' request
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, "https://api.uhooinc.com/v1/getdevicelist");
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_MAXREDIRS, 10);
        curl_setopt($curl, CURLOPT_ENCODING, "");
        curl_setopt($curl, CURLOPT_TIMEOUT, 30);
        curl_setopt($curl, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        curl_exec($curl);

        $result = curl_exec($curl);
        $response = json_decode($result);

        $devices = Device::all();
        $organizations = Organization::all();
        $user = AuthController::me();
        $content = $user->getContent();
        $userInfo = json_decode($content, true);

        foreach ($response as $res) {
            foreach ($devices as $device) {
                if ($res->deviceName !== $device->name) {
                    dd('not iden');
                    //Save new devices to DB
                    $device = new Device;
                    $device->name = $res->deviceName;
                    $device->mac_address = $res->macAddress;
                    $device->serial_number = $res->serialNumber;
                    foreach ($organizations as $organization) {
                        if ($userInfo['name'] == $organization->name) {
                            $device->organization_id = $organization->id;
                        }
                    }
                    // $device->save();
                }
            }
        }

        // Redirect to devices page
        return redirect('api/uhoo/devices');
    }

    /**
     * Method for getting a data per minute.
     *
     * [getUhooData description]
     * @return [type] [description]
     * @return \Illuminate\Http\Response
     */
    public function getUhooData()
    {
        $data = array('username' => 'uhoo@theinnoventors.eu', 'password' => '3e24510760d65ee46ba631e4d2d2d04bb1f86fecf56ee2e1248dc59b6749be6e', 'serialNumber' => '52ff6e067565555639500367');

        // Receive API by doing an 'POST' request
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, "https://api.uhooinc.com/v1/getlatestdata");
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_MAXREDIRS, 10);
        curl_setopt($curl, CURLOPT_ENCODING, "");
        curl_setopt($curl, CURLOPT_TIMEOUT, 30);
        curl_setopt($curl, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        curl_exec($curl);

        $result = curl_exec($curl);
        $response = json_decode($result);

        $devices = Device::all();

        // Save new meters data to DB
        $meter = new Meter;
        foreach ($devices as $device) {
            if ($device->serial_number == $data['serialNumber']) {
                $meter->device_id = $device->id;
            }
        }
        $meter->temperature = $response->Temperature;
        $meter->relative_humidity = $response->{'Relative Humidity'};
        $meter->pm2_5 = $response->{'PM2.5'};
        $meter->tvoc = $response->TVOC;
        $meter->co2 = $response->CO2;
        $meter->co = $response->CO;
        $meter->air_pressure = $response->{'Air Pressure'};
        $meter->ozone = $response->Ozone;
        $meter->no2 = $response->NO2;
        // $meter->save();

        // Redirect to meters page
        return redirect('api/uhoo/meters');
    }
}
