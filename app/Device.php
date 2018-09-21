<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    public $organization_name;

    /**
     * Device relationship with an organization
     * @return [type] [description]
     */
    public function organization()
    {
    	return $this->belongsTo(Organization::class);
    }

    /**
     * Device relationship with meters
     * @return [type] [description]
     */
    public function records()
    {
    	return $this->hasMany(Record::class);
    }

    /**
     * Find or create device by using name
     * @param  [type] $name [description]
     * @return [type]       [description]
     */
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
