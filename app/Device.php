<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Device extends Model
{
  use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    //START STEFAN
    protected $dates = ['deleted_at'];

    public $organization;
    //END STEFAN
    /**
     * Device relationship with an organization
     * @return [type] [description]
     */
    public function organization()
    {
    	return $this->belongsTo('App\Organization');
    }

    /**
     * Device relationship with meters
     * @return [type] [description]
     */
    public function records()
    {
    	return $this->hasMany('App\Record');
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
