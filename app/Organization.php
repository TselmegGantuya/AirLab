<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
	// Organization relationship with devices
    public function devices()
    {
    	return $this->hasMany(Device::class);
    }

    public function user()
    {
    	return $this->belongsTo(User::class);
    }
}
