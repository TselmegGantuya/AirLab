    $.ajaxSetup({
        headers: {
          'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
        }
    });

//data tables
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
// knockout js
var ViewModel = function (){

    var base_url = window.location.origin;
    var self = this
    self.files = ko.observableArray()
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
    self.records = ko.observableArray()
    self.devices = ko.observableArray()
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

    /**
    *
    *  canvas coordinates
    */
    var canvas = document.getElementById('background')
    var context = canvas.getContext('2d')
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
    *   upload image
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
     * [loginToken description]
     * @return {[type]} [description]
     */
    self.loginToken = function() {

        if (self.loginButton() == "Sign in") {
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
        } else if (self.loginButton() == "Sign up") {
            $.post(base_url + '/api/create',{email:$('#email').val(), password:$('#password').val(), name:$('#name').val()}).done(function(data)
            {
                console.log(data)
                self.loginButton("Sign in")
                self.loginToken()
            })
            $.post(base_url + '/api/me', {token:self.token()}).done(function(data){
                self.user(data['name'])
                console.log(self.user())
                console.log(self.records())
            })            
        }
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
                self.lastRecordHead(self.record())
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
    };

    $('#openBtn').click(function(){
        $('#myModal').modal({show:true})
    });

    // self.addTask = function() {
    //     self.tasks.push(new Task({ title: this.newTaskText() }));
    //     self.newTaskText("");
    // };
    self.saveToPhp = function() {
        
        console.log({id:$('#current_password').val()})
        // $.ajax("/echo/json/", {
        //     data: {
        //         json: ko.toJSON({
        //             tasks: this.tasks
        //         })
        //     },
        //     type: "POST",
        //     dataType: 'json',
        //     success: function(result) {
        //         alert(ko.toJSON(result))
        //     }
        // });
    };
}

var vm = new ViewModel();
ko.applyBindings(vm);
