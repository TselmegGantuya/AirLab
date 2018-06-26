@extends('layouts.app')

@section('content')

<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card card-default">
                <div class="card-header">Dashboard</div>
                <div data-bind="foreach: meters">
                    <p data-bind="text: id">ID</p>
                    <p data-bind="text: temperature">Temperature</p>
                    <p data-bind="text: relative_humidity">Relative Humidity</p>
                    <p data-bind="text: tvoc">TVOC</p>
                </div>
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
</body>
@endsection
