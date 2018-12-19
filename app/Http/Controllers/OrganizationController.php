<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Organization;

class OrganizationController extends Controller
{
    /**
     * Method to get organizations
     * @return [type] [description]
     */
    public function getOrganizations(){
        return Organization::all();
    }
}
