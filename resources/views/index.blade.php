@extends('layouts.app')

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
<!--                     <li class="nav-item">
                        <a class="nav-link" href="#">
                            <button class="btn btn-info col" type="button"> Kamers</button>
                        </a>
                    </li> -->

                    <li class="nav-item">
                        <a class="nav-link" href="#" data-bind="click: getDevices">
                            <button class="btn btn-info col" type="button"> Devices</button>
                        </a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" href="#" data-bind="click: getMeters">
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
          
        </main>
    </div>
</div>

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
@endsection