<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ApiController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(){

    }

    /**
     * Method for getting a data per minute.
     * [getUhooData description]
     * @return [type] [description]
     * @return \Illuminate\Http\Response
     */
    public function getUhooData()
    {

        // $headers    = [];
        // $headers[]  = 'Content-Type: application/json';
        // $headers[]  = 'Accept: application/json';

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, "https://api.uhooinc.com/v1/getlatestdata");
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_MAXREDIRS, 10);
        curl_setopt($curl, CURLOPT_ENCODING, "");
        curl_setopt($curl, CURLOPT_TIMEOUT, 30);
        curl_setopt($curl, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
        // curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($curl, CURLOPT_POSTFIELDS, "username=uhoo@theinnoventors.eu&password=3e24510760d65ee46ba631e4d2d2d04bb1f86fecf56ee2e1248dc59b6749be6e&serialNumber=52ff71067565555648220567");

        curl_exec($curl);

        $result = curl_exec($curl);
        $response = json_decode($result);
        // $err = curl_error($curl);
        // curl_close($curl);
        // 
        // if ($err) {
        //   echo "cURL Error #:" . $err;
        // } else {
        //   return redirect()->action('ApiController@transferUhooData', $response);
        // }

        // dd($response);
        // return view('uhoo_json', compact('response'));
        // return redirect()->action('ApiController@transferUhooData');
        // return redirect()->action('ApiController@transferUhooData', ['data' => $response]);
    }

    public function transferUhooData($data)
    {
        dd($data);
        return view('uhoo_json');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function storeUhooData(Request $request)
    {
        dd($request);
        // $data = json_decode(file_get_contents('php://input'), true);
        // $data = json_decode(file_get_contents('php://input'))->data;
        // dd($data);

        $data->temperature = $meter->temperature;
        $data->relative_humidity = $meter->relative_humidity;
        $data->pm2_5 = $meter->pm2_5;
        $data->tvoc = $meter->tvoc;
        $data->co2 = $meter->co2;
        $data->co = $meter->co;
        $data->air_pressure = $meter->air_pressure;
        $data->ozone = $meter->ozone;
        $data->no2 = $meter->no2; 
        $meter->save();

        return response()->json(array('response'=>'success'));
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
