<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Meter extends Model
{
	// Meter relationship with a device
    public function device()
    {
    	return $this->belongsTo('App\Device');
    }
}
