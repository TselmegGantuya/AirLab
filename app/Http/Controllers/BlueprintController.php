<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Blueprint;
use App\Record;
use App\Device;
use App\Organization;
use App\User;
use Carbon\Carbon;
use App\Http\Controllers\AuthController;

class BlueprintController extends Controller
{
    /**
     * Upload and display blueprint
     *
     * @return \Illuminate\Http\Response
     */
    public function uploadBP(Request $request)
    {
        $user = auth()->user();
        $path = $request->file('blueprint')->store('public');
        $blueprint = new Blueprint;
        $blueprint->name = 'file';
        $blueprint->organization_id = $user->organization_id;
        $blueprint->path = $path;
        $blueprint->save();
        return 'success';
    }

    /**
     * [changeName description]
     * @param  Request $request [description]
     * @return [type]           [description]
     */
    public function changeName(Request $request)
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
    public function getBP()
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
     * [blueprintDelete description]
     * @param  Request $request [description]
     * @return [type]           [description]
     */
    public function blueprintDelete(Request $request){
        $id =  $request->input('id');
        $bp = Blueprint::find($id);
        $bp->delete(); 
    }

    /**
     * Method to get devices where left_pixel is equal to NULL
     * @return [type] [description]
     */
    public function getUserDevices()
    {
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
        
        return $devices;
    }
}