<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Laravel</title>

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Raleway:100,600" rel="stylesheet" type="text/css">

        <!-- Styles -->
        <style>
            html, body {
                background-color: #fff;
                color: #636b6f;
                font-family: 'Raleway', sans-serif;
                font-weight: 100;
                height: 100vh;
                margin: 0;
            }

            .full-height {
                height: 100vh;
            }

            .flex-center {
                align-items: center;
                display: flex;
                justify-content: center;
            }

            .position-ref {
                position: relative;
            }

            .top-right {
                position: absolute;
                right: 10px;
                top: 18px;
            }

            .content {
                text-align: center;
            }

            .title {
                font-size: 84px;
            }

            .links > a {
                color: #636b6f;
                padding: 0 25px;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: .1rem;
                text-decoration: none;
                text-transform: uppercase;
            }

            .m-b-md {
                margin-bottom: 30px;
            }
        </style>
    </head>
    <body>
        <div class="flex-center position-ref full-height">
            <div class="content">
                <div class="title m-b-md">
                    Air Lab
                </div>

                <div>
                    @foreach($meters as $meter)
                        <h4>Temperature</h4>
                            <p>{{$meter->temperature}}</p>
                        <h4>Relative Humidity</h4>
                            <p>{{$meter->relative_humidity}}</p>
                        <h4>PM2.5</h4>
                            <p>{{$meter->pm2_5}}</p>
                        <h4>TVOC</h4>
                            <p>{{$meter->tvoc}}</p>
                        <h4>CO2</h4>
                            <p>{{$meter->co2}}</p>
                        <h4>CO</h4>
                            <p>{{$meter->co}}</p>
                        <h4>Air Pressure</h4>
                            <p>{{$meter->air_pressure}}</p>
                        <h4>Ozone</h4>
                            <p>{{$meter->ozone}}</p>
                        <h4>NO2</h4>
                            <p>{{$meter->no2}}</p>
                    @endforeach
                </div>
            </div>
        </div>
    </body>
</html>
