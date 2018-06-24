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
                                <th scope="col">Name</th>
                                <th scope="col">Mac Address</th>
                                <th scope="col">Serial NUmber</th>
                                <th scope="col">Organization</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($devices as $device)
                                <tr>
                                    <td><a href="{{ action('ApiController@meterDetail', $device->id) }}">{{ $device->name }}</a></td>
                                    <td>{{ $device->mac_address }}</td>
                                    <td>{{ $device->serial_number }}</td>
                                    <td>{{ $device->organization->name }}</td>
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