<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getUserInfo (Request $request){
        $user = User::FindOrFail($request->input('id'));
        $user->name = empty($request->input('name')) ? $user->name : $request->input('name') ;
        $user->email = empty($request->input('email')) ? $user->email : $request->input('email') ;
        $user->organization_id = empty($request->input('org')) ? $user->organization_id : $request->input('org');
        $user->password =  empty($request->input('password')) ? $user->password : Hash::make($request->input('password'));
        $user->update();
    }

    /**
     * Method to get user organization
     * @param  Request $request [description]
     * @return [type]           [description]
     */
    public function getUserOrganization(Request $request){
        return User::where('organization_id', $request->input('id'))->get();
    }
}
