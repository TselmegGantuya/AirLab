<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Meter;
use App\Device;
use App\Organization;
use Carbon\Carbon;

class ApiController extends Controller
{
    /**
     * Display all devices
     * 
     * [deviceView description]
     * @return [type] [description]
     */
    public function deviceView()
    {
        $devices = Device::all();

        

        foreach ($devices as $d) {
            $d->organization_name = $d->organization->name;
        }
// dd($devices);
        return $devices;
    }

    /**
     * Display all meters.
     *
     * @return \Illuminate\Http\Response
     */
    public function meterView(){
        $meters = Meter::all();

        return view('uhoo_meters', compact('meters'));
    }

    /**
     * Display inserted last meter in DB
     * 
     * [lastMeter description]
     * @return [type] [description]
     */
    public function lastMeter(){
        $meter = Meter::orderBy('id', 'desc')->first();

        return $meter;
    }

    /**
     * Display meter details
     * 
     * @param  [type] $id [description]
     * @return [type]     [description]
     */
    public function meterDetail($id)
    {
        $device = Device::findOrFail($id);

        return view('uhoo_meter_detail', compact('device'));
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
        curl_setopt($curl, CURLOPT_POSTFIELDS, "username=uhoo@theinnoventors.eu&password=3e24510760d65ee46ba631e4d2d2d04bb1f86fecf56ee2e1248dc59b6749be6e");
        curl_exec($curl);
        
        $result = curl_exec($curl);
        $response = json_decode($result);

        foreach ($response as $res) {
            if ($res->deviceName != Device::where('name', '=', $name)) {
                //Save new devices to DB
                $device = new Device;
                $device->name = $res->deviceName;
                $device->mac_address = $res->macAddress;
                $device->serial_number = $res->serialNumber;
                $device->organization_id;
                $device->save();   
            }
        }

        // Redirect to devices page
        return redirect('uhoo/devices');
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
        curl_setopt($curl, CURLOPT_POSTFIELDS, "username=uhoo@theinnoventors.eu&password=3e24510760d65ee46ba631e4d2d2d04bb1f86fecf56ee2e1248dc59b6749be6e&serialNumber=52ff6f067565555644450367");
        curl_exec($curl);
        
        $result = curl_exec($curl);
        $response = json_decode($result);

        // Save new meters data to DB
        $meter = new Meter;
        $meter->temperature = $response->Temperature;
        $meter->relative_humidity = $response->{'Relative Humidity'};
        $meter->pm2_5 = $response->{'PM2.5'};
        $meter->tvoc = $response->TVOC;
        $meter->co2 = $response->CO2;
        $meter->co = $response->CO;
        $meter->air_pressure = $response->{'Air Pressure'};
        $meter->ozone = $response->Ozone;
        $meter->no2 = $response->NO2; 
        $meter->save();

        // Redirect to meters page
        return redirect('uhoo/meters');
    }
}
