<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;

class AdminController extends Controller
{
    public function __construct(){
    	$user = auth()->user()
    	if($user->role != 2){
    		return;
    	}

    }
}
