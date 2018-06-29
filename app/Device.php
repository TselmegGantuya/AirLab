<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    public $organization_name;
	// Device relationship with an organization
    public function organization()
    {
    	return $this->belongsTo('App\Organization');
    }

    // Device relationship with meters
    public function meters()
    {
    	return $this->hasMany('App\Meter');
    }

    public static function findOrCreateDeviceByName($name)
    {
        $device = Device::where('name', '=', $name)->first();

        if ($device === NULL) {
            $device = new Device;
            $device->name = $name;
            $device->save();
        }

        return $device;
    }
}
