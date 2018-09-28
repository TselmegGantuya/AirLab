  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
    }
  });

function Model ()
{
    var counter = 0;
    var base_url = window.location.origin;
    var self = this;
    self.none = ko.observable('none')
    self.loginButton = ko.observable()
    self.loginInfo = ko.observableArray([
        {name:"email"},
        {name:"password"}
    ])
    self.registerInfo = ko.observableArray([
        {name:"email"},
        {name:"name"},
        {name:"password"}
    ])
    self.forgetInfo = ko.observableArray([
        {name:"email"}
    ])
    self.token = ko.observable()
    self.currentPageData = ko.observableArray()
    self.currentPage = ko.observable()
    self.pages = ko.observableArray()
    self.meters = ko.observableArray()
    self.devices = ko.observableArray()
    self.user = ko.observableArray()
    self.userDevice = ko.observableArray()
    self.deviceMeter = ko.observableArray()
    self.organization = ko.observableArray()
    self.devicesOrganization = ko.observableArray()
    self.newDevices = ko.observableArray()
    self.showOrgDevices = ko.observable(false)
    self.showNewDevices = ko.observable(false)
    self.orgId = ko.observable()

    //test
    self.checkSession = function() {
      console.log();
    }

    /**
     * [loginToken description]
     * @return {[type]} [description]
     */
    self.loginToken = function() {
        if (self.loginButton() == "Sign in") {
            $.post(base_url + '/api/login',{email:$('#email').val(), password:$('#password').val()}).done(function(data)
            {

                self.token(data['access_token'])
                console.log(self.token())

                $.post(base_url + '/api/uhoo/last-meter',{token:self.token()}).done(function(data)
                {
                    self.meters(data)
                    $("#container").removeClass("d-none")
                    $("#loginCont").addClass("d-none")
                })
                /*
                $.post(base_url + '/api/uhoo/devices', {token:self.token()}).done(function(data)
                {
                  console.log(data)
                    self.devices(data)


                })
                */
                self.getOrganizations()
            })
        } else if (self.loginButton() == "Sign up") {
            $.post(base_url + '/api/create',{email:$('#email').val(), password:$('#password').val(), name:$('#name').val()}).done(function(data)
            {
                console.log(data)
                self.loginButton("Sign in")
                self.loginToken()
            })
        } else {
            //forget password comes here
        }

    }

    /**
     * [getMeters description]
     * @return {[type]} [description]
     */
    self.getMeters = function(){
        $.post(base_url + '/api/uhoo/meters', {token: self.token()}).done(function(data){
            self.deviceMeter(data)
            console.log(self.deviceMeter())
        })
    }

    /**
     * [getDevices description]
     * @return {[type]} [description]
     */
    self.getDevices = function(){
        $.post(base_url + '/api/uhoo/user/device', {token: self.token()}).done(function(data){
            self.userDevice(data)
            console.log(self.userDevice())
        })
    }

    /**
     * [getOrganizations description]
     * @return {[type]} [description]
     */
     /*START STEFAN CODE*/
    self.getOrganizations = function(){
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
            if (data[0]['organization_id'] == null ){
              self.newDevices(data)
              self.showNewDevices(!self.showNewDevices());
            }
        })
      }
      return true; // to trigger the browser default bahaviour
    }

    self.devicesOwner = function(data) {
      console.log('Sup1')
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
    self.profile = function(){
        $.post(base_url + '/api/me', {token:self.token()}).done(function(data){
            self.user(data)
            console.log(self.user())
        })
    }

    /**
     * [choosePage description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    self.choosePage = function(data)
    {
        data = data.toLowerCase()
        self.currentPage(data)
        console.log(self.currentPage())

        if (data == "login") {
            self.loginButton('Sign in')
            self.currentPageData(self.loginInfo())
            self.pages([{name: 'Register'}, {name: 'Forgot password'}])

        }else if (data == "register"){
            self.loginButton('Sign up')
            self.currentPageData(self.registerInfo())
            self.pages([{name: 'Login'}, {name: 'Forgot password'}])

        }else{
            self.loginButton('Send email')
            self.currentPageData(self.forgetInfo())
            self.pages([{name: 'Register'}, {name: 'Login'}])

        }
        console.log(self.currentPageData())
    }
    self.choosePage('login')

    /**
     * [logout description]
     * @return {[type]} [description]
     */
    self.logout = function(){
        $.post(base_url + '/api/logout', {token:self.token()}).done(function(data)
        {
            $("#container").addClass("d-none")
            $("#loginCont").removeClass("d-none")
            $('#email').val("")
            $('#password').val("")
            self.meters("")
            self.devices("")

            console.log(data)
        })
    }
}


ko.applyBindings(new Model())
