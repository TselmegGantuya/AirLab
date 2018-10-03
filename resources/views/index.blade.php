@extends('layouts.app')

@section('content')
<div class="container-fluid d-none" id="container">
    <div class="row">
        <nav class="col-md-2 d-none d-md-block bg-light sidebar">
            <div class="sidebar-sticky">
                <ul class="nav flex-column">
                    <li class="nav-item">
                        <a class="nav-link" href="#" data-bind="click: toggleVisibilityProfile">
                            <button class="btn btn-info col" type="button"> Profile</button>
                        </a>
                    </li>
                    <div class = 'admin'>
                    <li class="nav-item">
                        <a class="nav-link" href="#" data-bind="click: toggleVisibilityDevices">
                            <button class="btn btn-info col" type="button"> Devices</button>
                        </a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" href="#" data-bind="click: toggleVisibilityRecords">
                            <button class="btn btn-info col" type="button"> Records</button>
                        </a>
                    </li>
                    </div>
                    <li class="nav-item">
                        <a class="nav-link" href="#" data-bind="click: logout">
                            <button class="btn btn-danger col" type="button"> Logout</button>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4" class = 'admin'>
            <div id="currentTab">
                <h2 data-bind="text: user"></h2>
                
                <div data-bind="visible: showRow">
                    <p data-bind="text: currentTab"></p>
                    <table class="table table-striped table-bordered">
                        <thead>
                            <tr data-bind="foreach: currentTabHead">
                                <th data-bind="text: name"></th>
                            </tr>
                        </thead>
                            <tbody data-bind="foreach: $root.currentTabDataProfile" >
                                <tr>
                                    <td data-bind="text:name"></td>
                                    <td data-bind="text:email"></td>
                                </tr> 
                            </tbody>
                    </table>
                    <div>
                        <a href="#"  id="openBtn">
                            <button type="button" class="btn btn-outline-dark">Change Password</button>
                        </a>
<!--                         <a href="">
                            <button type="button" class="btn btn-outline-dark">Change Email</button>                            
                        </a> -->
                    </div>
                </div>

                <div data-bind="visible: showDev">
                    <p data-bind="text: currentTab"></p>
                    <!--Admin device to organization-->
                    <div class="container">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="card" style="margin:50px 0">
                                    <!-- Default panel contents -->
                                    <div class="card-header">Organizations</div>
                                    <ul class="list-group list-group-flush" style="overflow: auto; height: 15em;">
                                      <div data-bind="foreach: organization">
                                        <li class="list-group-item">
                                            <span data-bind="text: $data.name">Some org</span>
                                            <label class="checkbox">
                                                <input type="radio" name="organization" data-bind="value: id, click: $root.organizationRadiobox" />
                                                <span class="success"></span>
                                            </label>
                                        </li>
                                      </div>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div data-bind='visible: showOrgDevices' class="col-md-4">
                        <div class="card" style="margin:50px 0">
                            <!-- Default panel contents -->
                            <div class="card-header">Devices from organization</div>
                            <ul class="list-group list-group-flush" style="overflow: auto; height: 15em;">
                              <div data-bind="foreach: devicesOrganization">
                                <li class="list-group-item">
                                    <span data-bind="text: $data.name">Some org</span>
                                    <label class="checkbox">
                                        <input type="checkbox" data-bind="value: id" name="devicesOrganization" />
                                        <span class="success"></span>
                                    </label>
                                </li>
                              </div>
                            </ul>
                            <div class="card-footer">
                              <button class="btn btn-danger" data-bind="click: devicesOwner" type="button" name="button">Delete</button>
                            </div>
                        </div>
                    </div>

                    <div data-bind='visible: showNewDevices' class="col-md-4">
                      <div class="card" style="margin:50px 0">
                            <!-- Default panel contents -->
                            <div class="card-header">New devices</div>
                            <ul class="list-group list-group-flush" style="overflow: auto; height: 15em;">
                              <div data-bind="foreach: newDevices">
                                <li class="list-group-item">
                                    <span data-bind="text: $data.name">Some org</span>
                                    <label class="checkbox">
                                        <input type="checkbox" data-bind="value: id" name="newDevices" />
                                        <span class="success"></span>
                                    </label>
                                </li>
                              </div>
                            </ul>
                            <div class="card-footer">
                              <button class="btn btn-primary" data-bind="click: newDevice" type="button" name="button">Save</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div data-bind="visible: showRec">
                    <p data-bind="text: currentTab"></p>
                    <table class="table table-striped table-bordered">
                        <thead>
                            <tr data-bind="foreach: currentTabHead">
                                <th data-bind="text: name"></th>
                            </tr>
                        </thead>
                            <tbody data-bind="foreach: $root.currentTabDataRecords" >
                                <tr>
                                    <td class="btn btn-success" data-bind="text: device.name"></td>
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
                </div>

                <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Device Records</h4>
                        </div>
                        <div class="modal-body">
                            <div class="table-responsive">
                                <p data-bind="text: lastCurrentTab"></p>
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

        <div id="myModal" class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">

                    <div class="modal-header">
                        <h3>Change Password <span class="extra-title muted"></span></h3>
                    </div>

                    <div class="modal-body">
                        <div class="modal-body form-horizontal">
                            <form data-bind="submit: saveToPhp" id="pass_form">
                                <div class="form-group">
                                  <div class="control-group">
                                        <label for="current_password" class="control-label">Current Password</label>
                                        <div class="controls">
                                            <input type="password" data-bind="value: current_password" class="form-control"  name="current_password">
                                        </div>
                                    </div>

                                    @if ($errors->has('current_password'))
                                        <span class="help-block"><strong>{{ $errors->first('current_password') }}</strong></span>
                                    @endif

                                    <div class="control-group">
                                        <label for="new_password" class="control-label">New Password</label>
                                        <div class="controls">
                                            <input type="password" data-bind="value: new_password" class="form-control"  name="new_password">
                                        </div>
                                    </div>

                                    @if ($errors->has('new_password'))
                                        <span class="help-block"><strong>{{ $errors->first('new_password') }}</strong></span>
                                    @endif

                                    <div class="control-group">
                                        <label for="confirm_password" class="control-label">Confirm Password</label>
                                        <div class="controls">
                                            <input type="password" data-bind="value: confirm_password" class="form-control"  name="confirm_password">
                                        </div>
                                    </div>  

                                    <div class="modal-footer">
                                        <button href="#" class="btn" data-dismiss="modal" aria-hidden="true" id="password_modal_save">Close</button>
                                        <button type="submit" class="btn btn-primary">Save changes</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <script type="text/html" id="blueprintPage">
        <form enctype="multipart/form-data" id = "uploadForm">
            <input type="file" id="files" name="" data-bind="event:{change: $root.fileSelect}">
        </form>
        <canvas id="background" width="1000" height="1000" ></canvas>
</script>
    </div>
</div>
<div data-bind="template: { name: currentTemplate, data: buyer }"></div>
<script type="text/html" id="loginPage">
    <div class="text-center" id ="loginCont">
        <h1 class="h3 mb-3 font-weight-normal" data-bind="text: currentPage"></h1>
        <div class="col-md-4 offset-md-4">

                <form class="form-signin" >
                    <div data-bind="foreach: currentPageData">
                        <input class="form-control" required="" data-bind="attr: {type: name, id: name, placeholder: name}">
                    </div>
                    <button class="btn btn-lg btn-primary btn-block"data-bind="click:loginToken, text:loginButton"></button>
                </form>
                      <div class="form-row" data-bind="foreach: pages">
                <div class="col-md-6 mt-2">
                    <a href="#" class="form-control btn btn-info" data-bind="click: $root.choosePage.bind($data, name), text: name"></a>
                </div>
            </div>
            <p class="mt-5 mb-3 text-muted">&copy; 2018 Air Lab</p>

        </div>
    </div>
</script>

@endsection