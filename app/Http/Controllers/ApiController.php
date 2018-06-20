<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Meter;
use App\Device;
use App\Organization;

class ApiController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(){

        $meters = Meter::all();

        return view('uhoo_json', compact('meters'));
    }

    /**
     * Method for getting a data per minute.
     * [getUhooData description]
     * @return [type] [description]
     * @return \Illuminate\Http\Response
     */
    public function getUhooData()
    {
        // Receive API by doing an 'POST' request
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, "https://api.uhooinc.com/v1/getlatestdata");
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_MAXREDIRS, 10);
        curl_setopt($curl, CURLOPT_ENCODING, "");
        curl_setopt($curl, CURLOPT_TIMEOUT, 30);
        curl_setopt($curl, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($curl, CURLOPT_POSTFIELDS, "username=uhoo@theinnoventors.eu&password=3e24510760d65ee46ba631e4d2d2d04bb1f86fecf56ee2e1248dc59b6749be6e&serialNumber=52ff71067565555648220567");
        curl_exec($curl);
        
        $result = curl_exec($curl);
        $response = json_decode($result);

        // Save new meters data to DB
        $meter = new Meter;
        $meter->temperature = $response->Temperature;
        $meter->relative_humidity = $response->{'Relative Humidity'};
        $meter->pm2_5 = $response->{'PM2.5'};
        $meter->tvoc = $response->TVOC;
        $meter->co2 = $response->CO2;
        $meter->co = $response->CO;
        $meter->air_pressure = $response->{'Air Pressure'};
        $meter->ozone = $response->Ozone;
        $meter->no2 = $response->NO2; 
        $meter->save();

        // Redirect to Homepage
        return redirect('uhoo');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function storeUhooData(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
