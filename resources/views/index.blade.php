@extends('layouts.app')
    <link rel="stylesheet" href="https://cdn.datatables.net/1.10.10/css/jquery.dataTables.min.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/fixedcolumns/3.2.0/css/fixedColumns.dataTables.min.css">
    <link href="{{ asset('css/style.css') }}" rel="stylesheet">
@section('content')
<div class="container-fluid d-none" id="container">
    <div class="row">
        <nav class="col-md-2 d-none d-md-block bg-light sidebar">
            <div class="sidebar-sticky">
                <ul class="nav flex-column">
                    <li class="nav-item">
                        <a class="nav-link" href="#" data-bind="click: profile">
                            <button class="btn btn-info col" type="button"> Profile</button>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" data-bind="click: getDevices">
                            <button class="btn btn-info col" type="button"> Devices</button>
                        </a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" href="#" data-bind="click: getRecords">
                            <button class="btn btn-info col" type="button"> Meters</button>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" data-bind="click: logout">
                            <button class="btn btn-danger col" type="button"> Logout</button>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>

        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
            <div id="currentTab">
                <h2 data-bind="text: user"></h2>
                <p data-bind="text: currentTab"></p>

                <table class="table table-striped table-bordered">
                    <thead>
                        <tr data-bind="foreach: currentTabHead">
                            <th data-bind="text: name"></th>
                        </tr>
                    </thead>
                    <tbody data-bind="foreach: $root.currentTabData" >
<!--                         <tr>
                            <td data-bind="text:email"></td>
                            <td data-bind="text:name"></td>
                        </tr>  --> 

<!--                         <tr>
                            <td data-bind="text: temperature, click: function() { alert(device.name); }"></td>
                            <td data-bind="text: relative_humidity"></td>
                            <td data-bind="text: pm2_5"></td>
                            <td data-bind="text: tvoc"></td>
                            <td data-bind="text: co2"></td>
                            <td data-bind="text: co"></td>
                            <td data-bind="text: air_pressure"></td>
                            <td data-bind="text: ozone"></td> $root.records().temperature) $root.lastRecord()
                            <td data-bind="text: no2"></td>
                        </tr> -->
                        
                        <tr>
                            <td class="btn btn-success" data-target=".bd-example-modal-lg" data-toggle="modal" data-bind="text: name, click: $parent.getLastRecord($index())"></td>
                            <td data-bind="text:mac_address"></td>
                            <td data-bind="text:serial_number"></td>
                        </tr>
                    </tbody>
                </table>

                <div class="modal fade bd-example-modal-lg" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">

                <div class="modal-content">
                    <div class="modal-header">
<!--                         <button type="button" class="close" data-dismiss="modal">&times;</button>
 -->                        <h4 class="modal-title">Device Details</h4>
                    </div>
                    <div class="modal-body">
                        <div class="table-responsive">
                            <table class="table table-striped table-bordered">
                                <thead>
                                    <tr data-bind="foreach: lastRecordHead">
                                        <th data-bind="text: name"></th>
                                    </tr>
                                </thead>
                                <tbody data-bind="foreach: $root.currentLastRecord" >                                
                                    <tr>
                                        <td data-bind="text:temperature"></td>
                                        <td data-bind="text:relative_humidity"></td>
                                        <td data-bind="text:pm2_5"></td>
                                        <td data-bind="text:tvoc"></td>
                                        <td data-bind="text:co2"></td>
                                        <td data-bind="text:co"></td>
                                        <td data-bind="text:air_pressure"></td>
                                        <td data-bind="text:ozone"></td>
                                        <td data-bind="text:no2"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>                    
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>

<div class="text-center" id ="loginCont">
    <h1 class="h3 mb-3 font-weight-normal" data-bind="text: currentPage"></h1>
    <div class="col-md-4 offset-md-4">

        <form class="form-signin">
            <div data-bind="foreach: currentPageData">
                <input class="form-control" required="" data-bind="attr: {type: name, id: name, placeholder: name, oninput: $root.check(this)}">
            </div><br>
            
            <button class="btn btn-lg btn-primary btn-block" data-bind="click: loginToken">Sign in</button>
        </form><br>

        <div class="form-row" data-bind="foreach: pages">
            <div class="col-md-6 mt-2">
                <a href="#" class="form-control btn btn-info" data-bind="click: $root.choosePage.bind($data, name), text: name"></a>
            </div>
        </div>
        <p class="mt-5 mb-3 text-muted">&copy; 2018 Air Lab</p>

    </div>
</div>
@endsection
<script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
<script src="https://cdn.datatables.net/1.10.10/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/fixedcolumns/3.2.0/js/dataTables.fixedColumns.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.0/knockout-min.js"></script>