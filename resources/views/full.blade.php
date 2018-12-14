@extends('layouts.fullApp')
@section('content')

<div class="row">
    <div class="col-md-5 offset-md-4" >
        <div class="form-group">
            <select class="form-control" data-bind= "options: $data.blueprintData,
                optionsText: 'name',
                value: currentBlueprint,
                event:{ change:$root.selectFunc}">
            </select>
        </div>
    </div>
    <div class="col-md-9 offset-md-2">
        
            <h1 class="col-10" data-bind="text: blueprintName"></h1>
    
        <div id="bp" style="border:2px solid black; background-color: white;">
            <canvas  class="droppable" id="currentBP" width="1000" height="500"></canvas>  
        </div>

        <div class="modal fade" tabindex="-1" role="dialog" id="removeDevice">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <div data-bind="foreach: $root.devices">
                            <h4 class="modal-title" data-bind="text: name"></h4>
                        
                        </div>
                    </div>
                    <div class="modal-body"> 
                        <table class="table table-hover">
                            <thead>
                                <td>Name</td>
                                <td>Value</td>
                                <td></td>
                            </thead>
                            <tbody data-bind="foreach: $root.records">
                                <tr>
                                    <th data-bind="text: name">Temperature: </th>
                                    <td data-bind="text: value"></td>
                                    <td><i data-bind="css: bgColor" class="fas "></i></td>
                                </tr>                
                            </tbody>
                        </table> 
                    </div>
                </div>
            </div>
        </div>
    </div>
    @endsection