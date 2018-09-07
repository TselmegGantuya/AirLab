<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Meter extends Model
{
	public $device_name;

	/**
	 * Meter relationship with a device
	 * @return [type] [description]
	 */
    public function device()
    {
    	return $this->belongsTo('App\Device');
    }
}
