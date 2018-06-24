<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
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
}
