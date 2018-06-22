@extends('layouts.app')

@section('content')

<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card card-default">
                <div class="card-header">Dashboard</div>
                <form method="POST" action="{{url('api/login')}}">
                    @csrf
                    <input type="text" name="email">
                    <input type="text" name="password">
                    <input type="submit" >
                </form>
                <form method="POST" action="{{url('api/refresh')}}">
                    @csrf
                    <input type="text" name="token">

                    <input type="submit" >
                </form>
                <div class="card-body" id="list-list">
                </div>
            </div>
        </div>
    </div>
</div>

<body class="text-center">
    <h1 class="h3 mb-3 font-weight-normal" data-bind="text: currentPage"></h1>
        <div class="col-md-4 offset-md-4">
            <form class="form-signin" >
                <div data-bind="foreach: currentPageData">
                    <input class="form-control" required="" data-bind="attr: {type: name, name: name, placeholder: name}">
                </div>
                <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
            </form>
            <div class="form-row" data-bind="foreach: pages">
                <div class="col-md-6 mt-2">
                    <a href="#" class="form-control" data-bind="click: $root.choosePage.bind($data, name), text: name"></a>
                </div>
            </div>
        </div>
</body>
@endsection
