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
    protected $dates = ['deleted_at'];
    public $organization;

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
}
