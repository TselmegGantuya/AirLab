<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Air Lab</title>
    <link rel="icon" href="/img/icon.png">
    <!-- Styles -->
    <link href="https://use.fontawesome.com/releases/v5.0.6/css/all.css" rel="stylesheet">
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <link href="{{ asset('css/main.css') }}" rel="stylesheet">
    <link href="{{ asset('css/style.css') }}" rel="stylesheet">
</head>
<body id="main">
    <div id="app">
<!--         <nav class="navbar navbar-expand-md navbar-light navbar-laravel">
            <div class="container">
                <a class="navbar-brand" href="{{ url('/') }}">
                    Air LAb
                </a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">

                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                     Left Side Of Navbar

                </div>
            </div>
        </nav> -->

        <nav class="navbar navbar-expand-md navbar-light navbar-laravel">
            <a class="navbar-brand text-uppercase" href="#">Air Lab </a>

            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
        </nav>

        <main class="py-4">
            @yield('content')
        </main>
    </div>

    <!-- Scripts -->
    <script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.0/knockout-min.js"></script>
    <script defer src="https://use.fontawesome.com/releases/v5.0.6/js/all.js"></script>
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="{{ asset('js/app.js') }}"></script>
    <script src="{{ url('js/knockout.js') }}" ></script>
    <script src="{{ url('js/require.js') }}" ></script>
    <script src="{{ url('js/login.js') }}" ></script>
    <script src="{{ url('js/dashboard.js') }}" ></script>
    <script src="{{ url('js/profile.js') }}" ></script>
    <script src="{{ url('js/logout.js') }}" ></script>
    <script src="{{ url('js/devices_admin.js') }}" ></script>
    <script src="{{ url('js/staticData.js') }}" ></script>
    <script src="{{ url('js/oldData.js') }}" ></script>


</body>
</html>
