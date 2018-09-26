<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Blueprint;
use Illuminate\Support\Facades\Auth;

class BlueprintController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function uploadBP(Request $request)
    {
        $user = auth()->user();
        $path = $request->file('blueprint')->store('local');
        $blueprint = new Blueprint;
        $blueprint->name = 'file';
        $blueprint->organization_id = $user->organization_id;
        $blueprint->path = $path;
        $blueprint->save();
        return 'success';
    }
    public function getbp()
    {
        $user = auth()->user();
        $bps = Blueprint::where('organization_id', $user->organization_id)->get();
        return response()->json($bps);
    }
}
