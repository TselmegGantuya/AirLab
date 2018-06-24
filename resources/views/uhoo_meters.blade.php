@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Air Lab</div>

                <div class="card-body">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Device Name</th>
                                <th scope="col">Temperature</th>
                                <th scope="col">Relative Humidity</th>
                                <th scope="col">PM2.5</th>
                                <th scope="col">TVOC</th>
                                <th scope="col">CO2</th>
                                <th scope="col">CO</th>
                                <th scope="col">Air Pressure</th>
                                <th scope="col">Ozone</th>
                                <th scope="col">NO2</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($meters as $meter)
                                <tr>
                                    <td>{{ $meter->device->name }}</td>
                                    <td>{{ $meter->temperature }}</td>
                                    <td>{{ $meter->relative_humidity }}</td>
                                    <td>{{ $meter->pm2_5 }}</td>
                                    <td>{{ $meter->tvoc }}</td>
                                    <td>{{ $meter->co2 }}</td>
                                    <td>{{ $meter->co }}</td>
                                    <td>{{ $meter->air_pressure }}</td>
                                    <td>{{ $meter->ozone }}</td>
                                    <td>{{ $meter->no2 }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    </div>
</div>
@endsection