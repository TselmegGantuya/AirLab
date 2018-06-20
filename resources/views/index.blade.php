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
@endsection
 