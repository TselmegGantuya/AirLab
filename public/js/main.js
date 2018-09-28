$.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
    }
});
/**
*
*   Data tables
*/  
    ko.bindingHandlers.dataTablesForEach = {
    page: 0,
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
      var options = ko.unwrap(valueAccessor());
      ko.unwrap(options.data);
      if(options.dataTableOptions.paging){
        valueAccessor().data.subscribe(function (changes) {
            var table = $(element).closest('table').DataTable();
            ko.bindingHandlers.dataTablesForEach.page = table.page();
            table.destroy();
        }, null, 'arrayChange');          
      }
        var nodes = Array.prototype.slice.call(element.childNodes, 0);
        ko.utils.arrayForEach(nodes, function (node) {
            if (node && node.nodeType !== 1) {
                node.parentNode.removeChild(node);  
            }
        });
        return ko.bindingHandlers.foreach.init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {        
        var options = ko.unwrap(valueAccessor()),
            key = 'DataTablesForEach_Initialized';
        ko.unwrap(options.data);
        var table;
        if(!options.dataTableOptions.paging){
          table = $(element).closest('table').DataTable();
            table.destroy();
        }
        ko.bindingHandlers.foreach.update(element, valueAccessor, allBindings, viewModel, bindingContext);
        table = $(element).closest('table').DataTable(options.dataTableOptions);
        if (options.dataTableOptions.paging) {
           if (table.page.info().pages - ko.bindingHandlers.dataTablesForEach.page == 0) 
               table.page(--ko.bindingHandlers.dataTablesForEach.page).draw(false);                
           else 
               table.page(ko.bindingHandlers.dataTablesForEach.page).draw(false);                
        }        
        if (!ko.utils.domData.get(element, key) && (options.data || options.length))
            ko.utils.domData.set(element, key, true);
        return { controlsDescendantBindings: true };
    }}; 



/**
*
*   Knockoutjs
*/
var ViewModel = function (){


    var localStorage = window.localStorage;
    var base_url = window.location.origin;
    var self = this
    self.files = ko.observableArray()


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
        {name:"NO2"}
    ])

    self.token = ko.observable()
    self.currentPageData = ko.observableArray()
    self.currentPage = ko.observable()
    self.currentTab = ko.observable()
    self.currentTabHead = ko.observableArray()
    self.currentTabData = ko.observableArray()
    self.currentTabDataProfile = ko.observableArray()
    self.currentTabDataDevices = ko.observableArray()
    self.currentTabDataRecords = ko.observableArray()

    self.prof =  ko.observableArray()
    self.pages = ko.observableArray()
    self.user = ko.observableArray()

    self.userDevice = ko.observableArray()
    self.deviceMeter = ko.observableArray()
    self.lastRecord = ko.observableArray()
    self.lastRecordHead = ko.observableArray()
    self.currentLastRecord = ko.observableArray()
    self.lastCurrentTab = ko.observable()

    self.showRow = ko.observable(false);
    self.showDev = ko.observable(false);
    self.showRec = ko.observable(false);

    self.current_password = ko.observable()
    self.new_password = ko.observable()
    self.confirm_password = ko.observable()

    self.organization = ko.observableArray()
    self.devicesOrganization = ko.observableArray()
    self.newDevices = ko.observableArray()
    self.showOrgDevices = ko.observable(false)
    self.showNewDevices = ko.observable(false)
    self.orgId = ko.observable()

    /**
    *
    *  Canvas coordinates
    */
    var canvas = document.getElementById('background')
    var context = canvas.getContext('2d')
    /**
    *
    *   Devices placement 
    */
    $('#background').click(function(event)
    {
        let xy = getMousePos(canvas,event)
        console.log(getMousePos(canvas,event))
        //post coordination
        context.fillStyle = "#FF0000";  
        context.fillRect(xy['x'],xy['y'],10,10)
    })
    function getMousePos(canvas, event) {
        var rect = canvas.getBoundingClientRect()
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
            }
    }
    /**
    *
    *   Upload image
    */
        self.fileSelect= function (element,event) {
        var files =  event.target.files;// FileList object
        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {

          // Only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }          

            var reader = new FileReader();

              // Closure to capture the file information.
            reader.onload = (function() {
                return function(event){
                    var img = new Image();
                    img.addEventListener("load", function() {
                        context.drawImage(img, 0, 0);
                    });
                    img.src = event.target.result;
                }                
            })(f);
            var formData = new FormData();

              // HTML file input, chosen by user
            formData.append("blueprint", f);
            formData.append("token", self.token());
            
            var request = new XMLHttpRequest();
            request.open("POST", base_url + '/api/blueprint/upload');
            request.send(formData);
              // Read in the image file as a data URL.
            reader.readAsDataURL(f);    

        }
    };

    /**
     * [choosePage description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
   self.choosePage = function(data)
    {
        data = data.toLowerCase()
        self.currentPage(data)

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
                localStorage.setItem('token',self.token())
                $.post(base_url + '/api/me', {token:self.token()}).done(function(data)
                {
                    self.user(data['name'])
                })

                $("#container").removeClass("d-none")
                $("#loginCont").addClass("d-none")            

                self.getOrganizations()
            })
        } else if (self.loginButton() == "Sign up") {
            $.post(base_url + '/api/create',{email:$('#email').val(), password:$('#password').val(), name:$('#name').val()}).done(function(data)
            {
                self.loginButton("Sign in")
                self.loginToken()
            })          
        }
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
            localStorage.removeItem('myCat')
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
        })
        self.showRow(!self.showRow());
        self.showDev(false);
        self.showRec(false);
    };

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
    self.toggleVisibilityDevices = function() {
        $.post(base_url + '/api/uhoo/user/device', {token: self.token()}).done(function(data){
            self.currentTab("Devices")
            self.currentTabHead(self.dev())

            data.forEach(function(element) {
               self.currentTabData(data)
            });
            
            $.post(base_url + '/api/uhoo/records', {token: self.token()}).done(function(data) {

                self.lastCurrentTab("Devices/Record")
                self.lastRecordHead(self.record())
                for (var x in self.currentTabData()) {
                    for (var i in data) {
                        if (data[i].device_id == self.currentTabData()[x].id) {
                            $.post(base_url + '/api/uhoo/record', {token: self.token(),id:self.currentTabData()[x].id}).done(function(data) {
                                self.lastRecord.push(data)
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

            });
        })
        self.showRec(!self.showRec());
        self.showDev(false);
        self.showRow(false);
    };

    $('#openBtn').click(function(){
        $('#myModal').modal({show:true})
    });
    self.enterPage = function() {

        
        if (localStorage.getItem('token'))
        {
            self.token(localStorage.getItem('token'))
            $.post(base_url + '/api/me', {token: self.token()}).done(function(data){
                self.user(data['name'])
                $("#container").removeClass("d-none")
                $("#loginCont").addClass("d-none")            
            }).fail()
        }
        self.choosePage('login')
    }
    self.saveToPhp = function() {

    }
    self.enterPage()
}

var vm = new ViewModel();
ko.applyBindings(vm);

