<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Record;
use App\Device;
use App\Organization;
use App\Http\Controllers\AuthController;

class ApiController extends Controller
{
    /**
     * Method to get records by device ID
     * @param  Request $request [description]
     * @return [type]           [description]
     */
    public function getRecordsById(Request $request)
    {
      if ($request->id) {
        $records = Record::where('device_id', $request->id)->orderBy('updated_at', 'desc')->get();
      }
        return $records;
    }


    /**
     * Display all devices
     *
     * [deviceView description]
     * @return [type] [description]
     */
    public function getOrganizations()
    {
      $organizations = Organization::all();
      dd($organizations);
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
     * Display for adding organization devices
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
        $status = 1;
      }
      return $status;
    }

    /**
     * function to get all devices with values
     * Colors:
        green = bg-success
        orange = bg-warning
        red = bg-danger
        undefiend = secondary
     * @return [type] [description]
     */
    public function getDevicesWithData(Request $request){
        if ($request->id) {
            $device = array();
            $orgDevices = Device::where('organization_id', $request->id)->get();
            $orgDeviceData = array();

            foreach ($orgDevices as $device) {
                $deviceData = Record::where('device_id', $device['id'])->orderByRaw('created_at DESC')->first();
                if(isset($deviceData)){
                    $color = "bg-success";
                    $message = "All values are great!";
                    //Check warning for temperature
                    if($deviceData['temperature'] <= 20 || $deviceData['temperature'] >= 27){
                        $color = "bg-warning";
                        $message = "The temperature is under the 20 degrees or above the 27 degrees";
                    }
                    //Check danger for temprature
                    if($deviceData['temperature'] <= 10 || $deviceData['temperature'] >= 40){
                        $color = "bg-danger";
                        $message = "The temperature is under de 10 degrees or above the 40 degrees";
                    }
                    //Check warning for relative humidity
                    if($deviceData['relative_humidity'] <= 30 || $deviceData['relative_humidity'] >= 50){
                        $color = "bg-warning";
                        $message = "The  humidity is under the 30% or above 50%";
                    }
                }else{
                    $color = "bg-secondary";
                    $message = "There is no data for this device";
                }

                //set color by device
                $orgDeviceData[] = array(
                    'name' => $device['name'],
                    'color' => $color,
                    'message' => $message,
                );
            }
        }
        return $orgDeviceData;
    }
    
    /**
     * Method to edit device name
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
        $user = auth::user();
        $organization = Organization::where('name', '=', $user['name'])->get();
        $device = Device::where('name', '=', $response->deviceName)->get();

        foreach ($responses as $response) {
            if ($response->deviceName !== $device->name) {
                //Save new devices to DB
                $device = new Device;
                $device->name = $response->deviceName;
                $device->mac_address = $response->macAddress;
                $device->serial_number = $response->serialNumber;
                if ($user['name'] == $organization->name) {
                    $device->organization_id = $organization->id;
                }
                // $device->save();
            }
        }
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

        // Save new records data to DB
        $record = new Record;
        foreach ($devices as $device) {
            if ($device->serial_number == $data['serialNumber']) {
                $record->device_id = $device->id;
            }
        }
        $record->temperature = $response->Temperature;
        $record->relative_humidity = $response->{'Relative Humidity'};
        $record->pm2_5 = $response->{'PM2.5'};
        $record->tvoc = $response->TVOC;
        $record->co2 = $response->CO2;
        $record->co = $response->CO;
        $record->air_pressure = $response->{'Air Pressure'};
        $record->ozone = $response->Ozone;
        $record->no2 = $response->NO2;
        // $record->save();
    }
}
