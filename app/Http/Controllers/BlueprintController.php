<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Blueprint;
use App\Record;
use App\Device;
use App\Http\Controllers\AuthController;

class BlueprintController extends Controller
{
    /**
     * Upload and display blueprint
     *
     * @return \Illuminate\Http\Response
     */
    public function uploadBlueprint(Request $request)
    {
        $user = auth()->user();
        $path = $request->file('blueprint')->store('public');
        $blueprint = new Blueprint;
        $blueprint->name = 'New map';
        $blueprint->organization_id = $user->organization_id;
        $blueprint->path = $path;
        $blueprint->save();
        return 'success';
    }

    /**
     * Method to get blueprint in fullscreen
     * @return [type] [description]
     */
    public function getBlueprintFullscreen(){
        return view('full');
    }

        /**
     * Upload and display blueprint
     *
     * @return \Illuminate\Http\Response
     */
    public function uploadBlueprintAdmin(Request $request)
    {
        $user = auth()->user();
        $path = $request->file('blueprint')->store('public');
        $blueprint = new Blueprint;
        $blueprint->name = $request->input('name');
        $blueprint->organization_id = $request->input('organizations');
        $blueprint->path = $path;
        $blueprint->save();
        return 'success';
    }
    
    /**
     * Upload and display blueprint
     *
     * @return \Illuminate\Http\Response
     */
    public function updateBlueprint(Request $request)
    {
        $user = auth()->user();
        $path = $request->file('blueprint')->store('public');
        $blueprint = Blueprint::FindOrFail($request->input('id'));
        $blueprint->path = $path;
        $blueprint->update();
        return 'success';
    }
    
    /**
     * [changeName description]
     * @param  Request $request [description]
     * @return [type]           [description]
     */
    public function changeBlueprintName(Request $request)
    {
        $user = auth()->user();
        $bp = Blueprint::FindOrFail($request->input('id'));
        if($user->organization_id == $bp->organization_id)
        {
            $bp->name = $request->input('name');
            $bp->save();
        }
    }

    /**
     * Get organization blueprint
     * @return [type] [description]
     */
    public function getBlueprint()
    {
        $user = auth()->user();
        $bps = Blueprint::where('organization_id', $user->organization_id)->get();
        return response()->json($bps);
    }

    /**
     * get coordinates from devices on blueprint and save to DB
     * @param  Request $request [description]
     * @return [type]           [description]
     */
    public function getCoordination(Request $request)
    {
        $devices = Device::all();
        $data =  $request->blueprintData;

        foreach ($data as $bpData) {
            $left = (int)$bpData['left'];
            $top = (int)$bpData['top'];

            foreach ($devices as $device) {
                if ($device->id == $bpData['device_id']) {
                    $device->blueprint_id = $bpData['id'];
                    $device->left_pixel = $left;
                    $device->top_pixel = $top;
                    $device->save();
                }
            }
        }
    }

    /**
     * Method to delete blueprint
     * @param  Request $request [description]
     * @return [type]           [description]
     */
    public function deleteBlueprint(Request $request){
        $id =  $request->input('id');
        $bp = Blueprint::find($id);
        $bp->delete(); 
    }

    /**
     * Method to get devices where left_pixel is equal to NULL
     * @return [type] [description]
     */
    public function getUserDevices(){
        $user = auth::user();
        $devices = Device::where([
            ['organization_id', '=', $user['organization_id']],
        ])->whereNull(
            'left_pixel'
        )->get();

        return $devices;
    }

    /**
     * Method to get devices where left_pixel is not equal to NULL
     * @return [type] [description]
     */
    public function getUserDBDevices()
    {
        $user = auth::user();
        $devices = Device::where([
            ['organization_id', '=', $user['organization_id']],
        ])->whereNotNull(
            'left_pixel'
        )->get();
        $warningValues = array();

        foreach ($devices as $key => $device) {
            $deviceData = Record::where('device_id', $device['id'])->orderByRaw('created_at DESC')->first();

            if(isset($deviceData)){
                $color = "shadow-success";
                $textColor = "black";
                $value = "All values are great!";
                //Check warning for temperature
                if($deviceData['temperature'] <= 20 || $deviceData['temperature'] >= 27){
                    $color = "shadow-warning";
                    $value = "Temprature is " . round($deviceData['temperature']) . "℃";
                }
                //Check danger for temprature
                if($deviceData['temperature'] <= 10 || $deviceData['temperature'] >= 40){
                    $color = "shadow-danger";
                    $value = "Temprature is " . round($deviceData['temperature']) . "℃";
                    $textColor = "bg-danger";
                }
                //Check warning for relative humidity
                if($deviceData['relative_humidity'] <= 30 || $deviceData['relative_humidity'] >= 50){
                    $color = "shadow-warning";
                    $value = "Relative humidity is " . round($deviceData['relative_humidity']) . "%";
                    $textColor = "bg-warning";
                }
            }else{
                $color = "shadow-secondary";
                $value = "Device is offline.";
            }
           
            $devices[$key]['danger'] = $value;
            $devices[$key]['colorClass'] = $color;
            $devices[$key]['records'] = $deviceData;
        }
        return $devices;
    }

    /**
     * Method to get records of a specific device
     * @param  Request $request [description]
     * @return [type]           [description]
     */
    public function getRecordsForDevice(Request $request)
    {
        $deviceRecords = array();
        $i = 0;
        $records = Record::where('device_id', $request->id)->first();

        if($records){
            $records = $records->toArray();
        
            $skip = array('id', 'device_id', 'created_at', 'updated_at');
            foreach ($records as $name => $value) {
                if(in_array($name, $skip)){
                    continue;
                }
                $deviceRecords[$i] = array(
                    'name' => $name,
                    'value' => $value,
                    'bgColor' => ''
                );
                if($name == "temperature" && $value <= 20 || $name == "temperature" && $value >= 27){
                    $deviceRecords[$i]['bgColor'] = 'bg-warning text-white';
                }
                if($name == "temperature" && $value <= 10 || $name == "temperature" && $value >= 40){
                    $deviceRecords[$i]['bgColor'] = 'bg-danger text-white';
                }
                
                if($name == "relative_humidity" && $value <= 30 || $name == "relative_humidity" && $value >= 50){
                    $deviceRecords[$i]['bgColor'] = 'bg-warning text-white';
                }
                if($name == "pm2_5" && $value >= 35 ){
                    $deviceRecords[$i]['bgColor'] = 'bg-warning text-white';
                }
                if($name == "pm2_5" && $value >= 70 ){
                    $deviceRecords[$i]['bgColor'] = 'bg-danger text-white';
                }
                if($name == "tvoc" && $value >= 400 ){
                    $deviceRecords[$i]['bgColor'] = 'bg-warning text-white';
                }
                if($name == "co2" && $value >= 800 ){
                    $deviceRecords[$i]['bgColor'] = 'bg-warning text-white';
                }
                if($name == "co2" && $value >= 1500 ){
                    $deviceRecords[$i]['bgColor'] = 'bg-danger text-white';
                }
                if($name == "co" && $value >= 100 ){
                    $deviceRecords[$i]['bgColor'] = 'bg-warning text-white';
                }
                if($name == "co" && $value >= 250 ){
                    $deviceRecords[$i]['bgColor'] = 'bg-danger text-white';
                }
                if($name == "air_pressure" && $value <= 970 || $name = "air_pressure" && $value >= 1030){
                    $deviceRecords[$i]['bgColor'] = 'bg-warning text-white';
                }
                if($name == "ozone" && $value >= 30 ){
                    $deviceRecords[$i]['bgColor'] = 'bg-warning text-white';
                }
                if($name == "ozone" && $value >= 70 ){
                    $deviceRecords[$i]['bgColor'] = 'bg-danger text-white';
                }
                if($name == "no2" && $value >= 35 ){
                    $deviceRecords[$i]['bgColor'] = 'bg-warning text-white';
                }
                if($name == "no2" && $value >= 70 ){
                    $deviceRecords[$i]['bgColor'] = 'bg-danger text-white';
                }
                //set index('i') plus one
                $i++;
            }
            return $deviceRecords;
        }else{
            $noData = array(
                'name' => 'no data',
                'value' => 'no data',
                'bgColor' => '',
            );
            return $noData;
        }
        
    }

    /**
     * Method to remove device from blueprint by setting top and left pixels to NULL
     * @param  Request $request [description]
     * @return [type]           [description]
     */
    public function removeDeviceFromBlueprint(Request $request)
    {
        $id =  $request->input('id');
        $device = Device::find($id);
        $device->left_pixel = NULL;
        $device->top_pixel = NULL;
        $device->save(); 
    }
}