@extends('layouts.app')

@section('content')

<div class="container-fluid d-none" id="container">
    <div class="row">
        <nav class="col-md-2 d-none d-md-block bg-light sidebar">
            <div class="sidebar-sticky">
                <ul class="nav flex-column">
                    <li class="nav-item">
                        <a class="nav-link active" href="#">
                          <span data-feather="home"></span>
                          Kamers <span class="sr-only">(current)</span>
                        </a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" href="#">
                          <span data-feather="file"></span>
                          Devices
                        </a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" href="#">
                          <span data-feather="file"></span>
                          Meters
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" data-bind="click: logout">Logout</a>
                    </li>
                </ul>
            </div>
        </nav>

        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
<!--               <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Dashboard</h1>
            <div class="btn-toolbar mb-2 mb-md-0">
            </div>
          </div> -->

            <h2>Meter Overzicht</h2>
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Time</th>
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
                    <tbody data-bind="foreach: meters">
                        <tr>
                            <td data-bind="text: updated_at"></td>
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
                    <tfoot>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tfoot>
                </table>
            </div>

            <h2>Devices</h2>
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Mac Address</th>
                            <th scope="col">Serial Number</th>
                            <th scope="col">Organization</th>
                        </tr>
                    </thead>
                    <tbody data-bind="foreach: devices">
                        <tr>
                            <td data-bind="text: name"></td>
                            <td data-bind="text: mac_address"></td>
                            <td data-bind="text: serial_number"></td>
                            <td data-bind="text: organization.name"></td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tfoot>
                </table>
            </div>
        </main>
    </div>
</div>

<!-- <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4" class="container-fluid">
    <div class="container d-none" id="container">
        <div class="row justify-content-center">
            <div class="card card-default">
                <div class="card-header">Meter Overzicht</div>
                <div data-bind="foreach: meters">
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
                        <tfoot>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    </div>
</main> -->

<div class="text-center" id ="loginCont">
    <h1 class="h3 mb-3 font-weight-normal" data-bind="text: currentPage"></h1>
        <div class="col-md-4 offset-md-4">

            <form class="form-signin" >
                <div data-bind="foreach: currentPageData">
                    <input class="form-control" required="" data-bind="attr: {type: name, id: name, placeholder: name}">
                </div>
                <button class="btn btn-lg btn-primary btn-block"data-bind="click:loginToken text:loginButton"></button>
            </form>
            <div class="form-row" data-bind="foreach: pages">
                <div class="col-md-6 mt-2">
                    <a href="#" class="form-control" data-bind="click: $root.choosePage.bind($data, name), text: name"></a>
                </div>
            </div>

        </div>
</div>
@endsection
