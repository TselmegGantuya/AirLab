    $.ajaxSetup({
        headers: {
          'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
        }
    });

var ViewModel = function (){

    var base_url = window.location.origin;
    var self = this
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

    self.profiles = ko.observableArray([
        {name:"Name"},
        {name:"Email"}
    ])
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
    self.token = ko.observable()
    self.currentPage = ko.observable()
    self.currentTab = ko.observable()
    self.lastCurrentTab = ko.observable()
    self.showRow = ko.observable(false);
    self.showDev = ko.observable(false);
    self.showRec = ko.observable(false);
    self.current_password = ko.observable()
    self.new_password = ko.observable()
    self.confirm_password = ko.observable()

    self.currentTabHead = ko.observableArray()
    self.currentTabData = ko.observableArray()
    self.currentPageData = ko.observableArray()
    self.currentTabDataProfile = ko.observableArray()
    self.currentTabDataDevices = ko.observableArray()
    self.currentTabDataRecords = ko.observableArray()
    self.prof =  ko.observableArray()
    self.pages = ko.observableArray()
    self.records = ko.observableArray()
    self.devices = ko.observableArray()
    self.user = ko.observableArray()
    self.userDevice = ko.observableArray()
    self.deviceMeter = ko.observableArray()
    self.lastRecord = ko.observableArray()
    self.lastRecordHead = ko.observableArray()
    self.currentLastRecord = ko.observableArray()

    /**
     * [check description]
     * @return {[type]} [description]
     */
    self.check = function(){
        
    }

    /**
     * [choosePage description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    self.choosePage = function(data){
        data = data.toLowerCase()
        self.currentPage(data)
        console.log(self.currentPage())

        if (data == "login") {

            self.currentPageData(self.loginInfo())
            self.pages([{name: 'Register'}, {name: 'Forgot password'}])

        }else if (data == "register"){

            self.currentPageData(self.registerInfo())
            self.pages([{name: 'Login'}, {name: 'Forgot password'}])

        }else{

            self.currentPageData(self.forgetInfo())
            self.pages([{name: 'Register'}, {name: 'Login'}])

        }
        console.log(self.currentPageData())
    }
    self.choosePage('login')

    /**
     * [loginToken description]
     * @return {[type]} [description]
     */
    self.loginToken = function() {
        $.post(base_url + '/api/login',{email:$('#email').val(), password:$('#password').val()}).done(function(data)
        {
            self.token(data['access_token'])
            console.log(self.token())

            $.post(base_url + '/api/uhoo/records',{token:self.token()}).done(function(data)
            {
                self.records(data)
                $("#container").removeClass("d-none")
                $("#loginCont").addClass("d-none")
            })
                 $.post(base_url + '/api/uhoo/devices', {token:self.token()}).done(function(data)
            {
                self.devices(data)
            })
            $.post(base_url + '/api/me', {token:self.token()}).done(function(data){
                self.user(data['name'])
                console.log(self.user())
                console.log(self.records())
            })            
        })  
    }

    /**
     * [registerToDB description]
     * @return {[type]} [description]
     */
    self.registerToDB = function(){
        $.post(base_url + '/api/validate',{email:$('#email').val(), password:$('#password').val(), name:$('#name').val()}).done(function(data)
        {
            console.log(data)
        })
    }

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
            self.records("")
            self.devices("")
            // console.log(data)
        })
    }

    /**
     * [toggleVisibilityProfile description]
     * @return {[type]} [description]
     */
    self.toggleVisibilityProfile = function() {
        $.post(base_url + '/api/me', {token:self.token()}).done(function(data){
            self.currentTab("Profile")
            self.currentTabHead(self.profiles())
            self.currentTabDataProfile(data)
            // console.log(self.currentTabDataProf(data))
        })
        self.showRow(!self.showRow());
        self.showDev(false);
        self.showRec(false);
    };

    /**
     * [toggleVisibilityDevices description]
     * @return {[type]} [description]
     */
    self.toggleVisibilityDevices = function() {
        $.post(base_url + '/api/uhoo/user/device', {token: self.token()}).done(function(data){
            self.currentTab("Devices")
            self.currentTabHead(self.dev())

            data.forEach(function(element) {
               self.currentTabData(data)
            });
            
            $.post(base_url + '/api/uhoo/records', {token: self.token()}).done(function(data) {
                self.lastCurrentTab("Devices/Record")
                self.lastRecordHead(self.recordHead())
                for (var x in self.currentTabData()) {
                    for (var i in data) {
                        if (data[i].device_id == self.currentTabData()[x].id) {
                            $.post(base_url + '/api/uhoo/record', {token: self.token(),id:self.currentTabData()[x].id}).done(function(data) {
                                self.lastRecord.push(data)
                                // console.log(self.lastRecord())
                            })
                            break;
                        }
                        else if(self.currentTabData().length == i ){
                            // console.log(self.currentTabData()[x].id)
                            // console.log('nothing found')
                        }
                    }
                }
            })
        })
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
    $('#openBtn').click(function(){
        $('#myModal').modal({show:true})
    });

    /**
     * [saveToPhp description]
     * @return {[type]} [description]
     */
    self.saveToPhp = function() {
        var formData = $('#pass_form').serialize();
        $.post(base_url + '/api/uhoo/password/reset',{token: self.token(),formData}).done(function(data){
            console.log('Check PHP')
        });
    };
}

var vm = new ViewModel();
ko.applyBindings(vm);
