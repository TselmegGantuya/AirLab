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

  self.organization = ko.observableArray()
  self.devicesOrganization = ko.observableArray()
  self.newDevices = ko.observableArray()
  self.showOrgDevices = ko.observable(false)
  self.showNewDevices = ko.observable(false)
  self.orgId = ko.observable()

    /**
     * [logout description]
     * @return {[type]} [description]
     */
    self.logout = function(){
        $.post(base_url + '/api/logout', {token:self.token()}).done(function(data){
            $("#container").addClass("d-none")
            $("#loginCont").removeClass("d-none")
            $('#email').val("")
            $('#password').val("")
            localStorage.removeItem('myCat')
            $('#uploadForm').removeClass("d-none")
            $('.admin').removeClass("d-none")
        })
    }



    /**
     * [getOrganizations description]
     * @return {[type]} [description]
     */
    
     /*START STEFAN CODE*/

    self.getOrganizations = function(){
      if(self.userRole() == 'user')
      {
        return '401';
      }
        $.post(base_url + '/api/uhoo/organizations', {token: self.token()}).done(function(data){
            self.organization(data)
            console.log(self.organization())
        })
    }
    /**
     * [organizationCheckbox description]
     * @return {[type]} [description]
     */
    self.organizationRadiobox = function(data,event) {
      if(self.userRole() == 'user')
      {
        return '401';
      }
      self.showOrgDevices(false)
      self.showNewDevices(false)
      if (event.target.checked) {
        //id organization
        self.orgId = event.target.value;
        //get all devices with no organization
        $.post(base_url + '/api/uhoo/getDevicesOrganization' ,{token: self.token(),id:self.orgId}).done(function(data){

            if (data[0]['organization_id'] != null ){
              self.devicesOrganization(data)
              self.showOrgDevices(!self.showOrgDevices());
            }
        })
        $.post(base_url + '/api/uhoo/getNewDevices' ,{token: self.token()}).done(function(data){
            if (data != ''){
              self.newDevices(data)
              self.showNewDevices(!self.showNewDevices());
            }
        })
      }
      return true; // to trigger the browser default bahaviour
    }

    self.devicesOwner = function(data) {
      if(self.userRole() == 'user')
      {
        return '401';
      }
      var items=document.getElementsByName('devicesOrganization');
      var selectedItems = [];
      for(var i=0; i<items.length; i++){
        if(items[i].type=='checkbox' && items[i].checked==true)
        selectedItems.push(items[i].value+"\n");
      }
      if (selectedItems != 0) {
        $.post(base_url + '/api/uhoo/deleteDevicesOrganization' ,{token: self.token(), device_id:selectedItems}).done(function(data){
          if (data == 1) {
            $.post(base_url + '/api/uhoo/getNewDevices' ,{token: self.token()}).done(function(data){
                if (data[0]['organization_id'] == null ){
                  self.newDevices(data)
                  self.showNewDevices();
                }
                else {
                  console.log('Geen nieuwe devices');
                }
            })
            $.post(base_url + '/api/uhoo/getDevicesOrganization' ,{token: self.token(),id:self.orgId}).done(function(data){
                if (data[0]['organization_id'] != null ){
                  self.devicesOrganization(data)
                  self.showOrgDevices(self.showOrgDevices());
                }
                else {
                  console.log('Geen nieuwe devices');
                }
            })
          }else {
            console.log('Deleten niet gelukt')
          }
        })
      }
    }

    self.newDevice = function(data) {
      if(self.userRole() == 'user')
      {
        return '401';
      }
      var items=document.getElementsByName('newDevices');
      var selectedItems = [];
      for(var i=0; i<items.length; i++){
        if(items[i].type=='checkbox' && items[i].checked==true)
        selectedItems.push(items[i].value+"\n");
      }
      if (selectedItems != 0) {
        $.post(base_url + '/api/uhoo/addDeviceOrg' ,{token: self.token(), organization_id:self.orgId, device_id:selectedItems}).done(function(data){
          if (data == 1) {
            $.post(base_url + '/api/uhoo/getNewDevices' ,{token: self.token()}).done(function(data){
                if (data[0]['organization_id'] == null ){
                  self.newDevices(data)
                  self.showNewDevices();
                }
                else {
                  console.log('Geen nieuwe devices');
                }
            })
            $.post(base_url + '/api/uhoo/getDevicesOrganization' ,{token: self.token(),id:self.orgId}).done(function(data){
                if (data[0]['organization_id'] != null ){
                  self.devicesOrganization(data)
                  self.showOrgDevices(self.showOrgDevices());
                }
                else {
                  console.log('Geen devices van organization');
                }
            })
          }else {
            console.log('Updaten niet gelukt')
          }
        })
      }
    }
    /*END STEFAN CODE*/
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
