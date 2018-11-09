<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Record;
use App\Device;
use App\Organization;
use App\User;
use Carbon\Carbon;
use App\Http\Controllers\AuthController;

class ApiController extends Controller
{
    // START STEFAN CODE

    public function adminAddBlueprint()
    {
        $records = Record::all();
        $devices = Device::all();
        $organizations = Organization::all();
        $user = AuthController::me();
        $content = $user->getContent();
        $userInfo = json_decode($content, true);
        $recordray = array();
        $users = User::all();

        if ($userInfo->role_id == $role->admin) {
            $blueprint = new Blueprint;
            $blueprint->name;
            $blueprint->organization_id = $userInfo->organization_id;
            $blueprint->path;
            $blueprint->save();
        }
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
        //softdelete concept
        //Device::where('id', $id)->delete();
        $status = 1;
      }
      return $status;
    }
    // END STEFAN CODE

    /**
     * [Method for changing/updating password]
     * @param  Request $request [description]
     * @return [type]           [description]
     */
    public function changePassword(Request $request){
        $user = Auth::user();

        if (Hash::check($request->get('current_password'), Auth::user()->password)) {
            //Change the password
            $user->fill([
                'password' => Hash::make($request->get('new_password'))
            ])->save();

            // $request->session()->flash('success', 'Your password has been changed.');
        }

        // if (!(Hash::check($request->get('current_password'), Auth::user()->password))) {
        //     // The passwords matches
        //     return redirect()->back()->with("error","Your current password does not matche with the password you provided. Please try again.");
        // }

        // if(strcmp($request->get('current_password'), $request->get('new_password')) == 0){
        //     //Current password and new password are same
        //     return redirect()->back()->with("error","New Password cannot be same as your current password. Please choose a different password.");
        // }

        // $validatedData = $request->validate([
        //     'current_password' => 'required',
        //     'new_password' => 'required|string|min:6|confirmed',
        //     'confirm_password' => 'required|string|min:6|confirmed'
        // ]);

        // //Change Password
        // $user = Auth::user();
        // $user->password = bcrypt($request->get('new_password'));
        // $user->save();
        return redirect('/');
    }

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
     * Display all devices
     *
     * [deviceView description]
     * @return [type] [description]
     */
    // public function deviceView()
    // {
    //     $devices = Device::all();
    //     dd($devices);
    //     foreach ($devices as $device) {
    //       if ($device->organization_id == true) {
    //         $device->organization;
    //       }else {
    //         $device->organization_name = 'none';
    //       }
    //     }
    //     return $devices;
    // }

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

        foreach ($organizations as $organization) {
            foreach ($users as $user) {
                if ($userInfo['name'] == $organization->name) {
                    foreach ($devices as $device) {
                        if ($device->organization_id == $organization->id) {
                            foreach ($records as $record) {
                                $record->device_name = $record->device->name;
                                // $record->device->serial_number;
                                if ($record->device_name == $device->name) {
                                    $recordray[] = $record;
                                }
                            }
                        }
                    }
                }
            }
        }
        return $recordray;
    }
    //code Lars
    /**
     * function to get all devices with values
     * Colors:
        green = bg-success
        orange = bg-warning
        red = bg-danger
        undefiend = secondary
     * @return [type] [description]
     */
    public function getDevicesWithData(Request $request)
    {
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
     * Method to get all devices tha belongs to logged in user
     * [userDevice description]
     * @return [type] [description]
     */
    public function userDevice()
    {
        $devices = Device::all();
        $records = Record::all();
        $organizations = Organization::all();
        $user = auth()->user();
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
                    // $device->records;
                    if ($device->organization->name == $organization->name) {
                        $userDevice[] = $device;
                    }
                }
            }
        }
        return $userDevice;
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
}
