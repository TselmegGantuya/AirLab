@extends('layouts.app')

@section('content')

<div class="container d-none" id="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card card-default">
                <div class="card-header">Dashboard</div>
                <div data-bind="foreach: meters">
                    <table>
                    <table class="table table-hover">
                        <thead>
                            <tr>
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
                            <tr>
                                <td data-bind="text: temperature"></td>
                                <td data-bind="text: relative_humidity"></td>
                                <td data-bind="text: pm2_5"></td>
                                <td data-bind="text: tvoc"></td>
                                <td data-bind="text: co2"></td>
                                <td data-bind="text: co"></td>
                                <td data-bind="text: air_pressure"></td>
                                <td data-bind="text: ozone"></td>
                                <td data-bind="text: no2"></td>
                            </tr>
                        </tbody>
                    </table>
                    </table>
                </div>
                <div class="card-body" id="list-list">
                </div>
            </div>
        </div>
    </div>
</div>

<div class="text-center" id ="loginCont">
    <h1 class="h3 mb-3 font-weight-normal" data-bind="text: currentPage"></h1>
        <div class="col-md-4 offset-md-4">
            <form class="form-signin" >
                <div data-bind="foreach: currentPageData">
                    <input class="form-control" required="" data-bind="attr: {type: name, id: name, placeholder: name, oninput: $root.check(this)}">
                </div>
                <button class="btn btn-lg btn-primary btn-block"data-bind="click:loginToken">Sign in</button>
            </form>
            <div class="form-row" data-bind="foreach: pages">
                <div class="col-md-6 mt-2">
                    <a href="#" class="form-control" data-bind="click: $root.choosePage.bind($data, name), text: name"></a>
                </div>
            </div>
        </div>
</div>
@endsection
