$.ajaxSetup({
  headers: {
    'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
  }
})
var localStorage = window.localStorage
var base_url = window.location.origin
/**
*
*   Knockoutjs
*/
var ViewModel = function (){

  var self = this
  self.files = ko.observableArray()
  self.none = ko.observable('none')

  self.dev = ko.observableArray([
    {name:"Device Name"},
    {name:"Mac Address"},
    {name:"Serial Number"}
  ])
  self.record = ko.observableArray([
    {name:"Device Name"},
    {name:"Temperature"},
    {name:"Relative Humidity"},
    {name:"PM 2.5"},
    {name:"TVOC"},
    {name:"CO2"},
    {name:"CO"},
    {name:"Air Pressure"},
    {name:"Ozone"},
    {name:"NO2"},
  ])
  self.recordHead = ko.observableArray([
    {name:"Temperature"},
    {name:"Relative Humidity"},
    {name:"PM 2.5"},
    {name:"TVOC"},
    {name:"CO2"},
    {name:"CO"},
    {name:"Air Pressure"},
    {name:"Ozone"},
    {name:"NO2"},
  ])

  self.currentPage = ko.observable()

  self.lastCurrentTab = ko.observable()
  self.showRow = ko.observable(false);
  self.showDev = ko.observable(false);
  self.showRec = ko.observable(false);



  self.currentPageData = ko.observableArray()
  self.currentTabDataProfile = ko.observableArray()
  self.currentTabDataDevices = ko.observableArray()
  self.currentTabDataRecords = ko.observableArray()
  self.prof =  ko.observableArray()
  self.pages = ko.observableArray()

  self.userRole = ko.observable();
  self.userDevice = ko.observableArray()
  self.deviceMeter = ko.observableArray()
  self.lastRecord = ko.observableArray()
  self.lastRecordHead = ko.observableArray()
  self.currentLastRecord = ko.observableArray()
  self.lastCurrentTab = ko.observable()

  self.showRow = ko.observable(false);
  self.showDev = ko.observable(false);
  self.showRec = ko.observable(false);



    /**
     * [getOrganizations description]
     * @return {[type]} [description]
     */


    /**
     * [profile description]
     * @return {[type]} [description]
     */
    self.toggleVisibilityDevices = function() {
      if(self.userRole() == 'user')
      {
        return '401';
      }
        self.showDev(!self.showDev());
        self.showRow(false);
        self.showRec(false);
    };

    /**
     * [getLastRecord description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    self.getLastRecord = function(data){
        self.currentLastRecord(self.lastRecord()[data])

    }

    /**
     * [toggleVisibilityRecords description]
     * @return {[type]} [description]
     */
    self.toggleVisibilityRecords = function() {
      if(self.userRole() == 'user')
      {
        return '401';
      }
        $.post(base_url + '/api/uhoo/records', {token: self.token()}).done(function(data){
            self.currentTab("Records")
            self.currentTabHead(self.record())

            data.forEach(function(element) {
               self.currentTabDataRecords(data)
               // console.log(element);
            });
        })
        self.showRec(!self.showRec());
        self.showRow(false);
        self.showDev(false);
    };

    /**
     * [description]
     * @param  {[type]} ){                     $('#myModal').modal({show:true})    } [description]
     * @return {[type]}     [description]
     */


    /**
     * [saveToPhp description]
     * @return {[type]} [description]
     */

}
