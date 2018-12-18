<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
	// Organization relationship with devices
    public function devices()
    {
    	return $this->hasMany('App\Device');
    }

    // Organization relationship with users
    public function user()
    {
    	return $this->hasMany('App\User');
    }
}
