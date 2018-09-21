<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Record;
use App\Device;
use App\Organization;
use App\User;
use Carbon\Carbon;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\DB;

class ApiController extends Controller
{
    /**
     * Display record details
     * 
     * @param  [type] $id [description]
     * @return [type]     [description]
     */
    public function recordDetail()
    {

        $id = request('id');

        $device = Device::findOrFail($id);
        //->orderBy('id', 'desc')->first()
        $record = Record::where('device_id', '=', $device->id)->first();

        // return response()->json($record);
        return $record;
    }

    /**
     * Display recent record in DB
     * 
     * [lastrecord description]
     * @return [type] [description]
     */
    public function lastRecord(){
        // $record = Record::orderBy('id', 'desc')->first();
        // $record->device_name = $record->device->name;
        // return $record;

        $devices = Device::all();
        $records = Record::all();
        $organizations = Organization::all();
        $user = AuthController::me();
        $content = $user->getContent();
        $userInfo = json_decode($content, true);
        $recordray = array();
        
        foreach ($organizations as $organization) {
            if ($userInfo['name'] == $organization->name) {
                foreach ($devices as $device) {
                    if ($device->organization_id == $organization->id) {
                        foreach ($records as $record) {
                            $record->device_name = $record->device->name;
                            if ($record->device_name == $device->name) {
                                $recordray[] = $record;
                            }
                        }
                    }
                }
            }   
        }
        return $recordray;
    }

    /**
     * Display all devices
     * 
     * [deviceView description]
     * @return [type] [description]
     */
    public function deviceView()
    {
        $devices = Device::all();

        foreach ($devices as $device) {
            $device->organization_name = $device->organization->name;
        }

        return $devices;
    }

    /**
     * Display all records that belongs to logged in user.
     *
     * @return \Illuminate\Http\Response
     */
    public function recordView(){
        $records = Record::all();
        $devices = Device::all();
        $organizations = Organization::all();
        $user = AuthController::me();
        $content = $user->getContent();
        $userInfo = json_decode($content, true);
        $recordray = array();
        $users = User::all();
        // $user = User::with('organization_id')->get();

        // $categories = Category::with(['posts' => function ($query) {
        //     $query->orderBy('created_at', 'desc')->take(5);
        // }])->get();

        // $devices = Device::where($user == 'organization_id')->get();

        // $records = Meter::where($devices == 'device_id')->get();

        // $recordray[] = $records;

        // return $recordray;

        foreach ($organizations as $organization) {
            //$userInfo['name']
            foreach ($users as $user) {
                if ($user->name == $organization->name) {
                    foreach ($devices as $device) {
                        if ($device->organization_id == $organization->id) {
                            foreach ($records as $record) {
                                $record->device_name = $record->device->name;
                                // $record->device->serial_number;
                                if ($record->device_name == $device->name) {
                                    $recordray[] = $record;
                                    // $record;
                                    // $data = json_encode($recordray);
                                }
                            }
                        }
                    }
                } 
            }  
        }
        return $recordray;
    }

    /**
     * Method to get all devices that belongs to logged in user
     * [userDevice description]
     * @return [type] [description]
     */
    public function userDevice()
    {
        $devices = Device::all();
        $records = Record::all();
        $organizations = Organization::all();
        $user = AuthController::me();
        $content = $user->getContent();
        $userInfo = json_decode($content, true);
        $userDevice = array();

        // $user = User::with('organization_id')->get();
        // $devices = Device::where($user->organization_id == 'organization_id')->get();
        // $userDevice[] = $devices;
        // return $userDevice;
        
        foreach ($organizations as $organization) {
            if ($userInfo['name'] == $organization->name) {
                foreach ($devices as $device) {
                    $device->records;
                    if ($organization->name == $device->organization->name) {
                        $userDevice[] = $device;
                    }
                }
            }   
        }

        return $userDevice;
    }

    // /**
    //  * Display record details
    //  * 
    //  * @param  [type] $id [description]
    //  * @return [type]     [description]
    //  */
    // public function recordDetail($id)
    // {
    //     $device = Device::findOrFail($id);

    //     return view('uhoo_record_detail', compact('device'));
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

        // Redirect to records page
        return redirect('api/uhoo/records');
    }

    public function FunctionName()
    {
        $records = Record::all();
        $record_levels = array();

        foreach ($records as $record) {
            // if ($record->temperature < 20.00) {
            //     echo "Bad Temperature";
            // }

            // if ($record->relative_humidity > 50.00 ) {
            //     echo "Bad Humidity";
            // }

            // if ($record->pm2_5 > 5.00) {
            //     echo "Bad PM2.5";
            // }

            // if ($record->tvoc < 1000.00) {
            //     echo "Bad TVOC";
            // }

            // if ($record->co2 > 600.00) {
            //     echo "Bad CO2";
            // }

            // if ($record->co < 0.00) {
            //     echo "Bad CO";
            // }

            // if ($record->air_pressure < 1500.00) {
            //     echo "Bad Air Pressure";
            // }

            // if ($record->ozone > 5.00) {
            //     echo "Bad Ozone";
            // }

            // if ($record->no2 > 0.50) {
            //     echo "Bad NO2";
            // }

            $record_levels[] = $record;
        }

        return dd($record_levels);
        
            // "temperature" => "21.00"
            // "relative_humidity" => "47.00"
            // "pm2_5" => "8.30"
            // "tvoc" => "196.00"
            // "co2" => "400.00"
            // "co" => "0.00"
            // "air_pressure" => "1024.30"
            // "ozone" => "5.90"
            // "no2" => "0.70"
    }
}
