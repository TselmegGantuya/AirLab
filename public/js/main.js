    $.ajaxSetup({
        headers: {
          'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
        }
    });


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
        {name:"Email"},
        {name:"Name"}
    ])
    self.dev = ko.observableArray([
        {name:"Device Name"},
        {name:"Mac Address"},
        {name:"Serial Number"}
    ])
    self.record = ko.observableArray([
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
    self.currentTabD = ko.observableArray()
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
    *
    *  canvas coordinates
    */
    var canvas = document.getElementById('background')
    var context = canvas.getContext('2d')
    $('#background').click(function(event)
    {
        let xy = getMousePos(canvas,event)
        console.log(getMousePos(canvas,event))
        
        context.fillStyle = "#FF0000";  
        context.fillRect(xy['x'],xy['y'],10,10)
    })
    function getMousePos(canvas, event) {
        var rect = canvas.getBoundingClientRect()-
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
              // Read in the image file as a data URL.
            reader.readAsDataURL(f);
        }
    };

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
                $.post(base_url + '/api/uhoo/devices', {token:self.token()}).done(function(data)
                {
                    self.devices(data)
                    $("#container").removeClass("d-none")
                    $("#loginCont").addClass("d-none")
                    console.log(self.devices())
                })            
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
    self.getRecords = function(){
        $.post(base_url + '/api/uhoo/records', {token: self.token()}).done(function(data){
            self.currentTab("Records")
            self.currentTabHead(self.record())

            // $.each(data, function(index, el) {
            //     console.log(index, el)
            //     self.currentTabData(el)
            // });

            // for (var i = 0; i < data.length; i++) {
            //     self.currentTabData(data[i])
            //     console.log(data[i])
            // }

            // for (var i in data) {
            //     self.currentTabData(data[i])
            //     console.log(data[i])
            // }

            // self.currentTabData(data[0])
            // console.log(data)

            data.forEach(function(element) {
               self.currentTabData(data)
               console.log(element);
            });

        })
    }

    /**
     * [getDevices description]
     * @return {[type]} [description]
     */
    self.getDevices = function(){
        $.post(base_url + '/api/uhoo/user/device', {token: self.token()}).done(function(data){
            self.currentTab("Devices")
            self.currentTabHead(self.dev())
            // self.currentTabData(data)
            // console.log(data)
            // for (var i in self.currentTabData()) {
            //     self.currentTabD.push(self.currentTabData()[i])
            //     console.log(self.currentTabD())
            // }

            data.forEach(function(element) {
               self.currentTabData(data)
            });

            // console.log(self.currentTabData()[0])

            // for (var i = self.currentTabHead.length - 1; i >= 0; i--) {
            //     self.currentTabData().push(data[self.currentTabHead[i]])
            // }
            // console.log(self.currentTabHead()[0].name)
            // console.log(self.currentTabData())
            
            $.post(base_url + '/api/uhoo/last-record', {token: self.token()}).done(function(data) {
                self.lastRecordHead(self.record())
                for (var x in self.currentTabData()) {
                    for (var i in data) {
                        if (data[i].device_id == self.currentTabData()[x].id) {
                            $.post(base_url + '/api/uhoo/record', {token: self.token(),id:self.currentTabData()[x].id}).done(function(data) {
                                self.lastRecord.push(data)

                                console.log(self.lastRecord())

                            })
                            // console.log(data[i].id)
                            // console.log(self.currentTabData()[x].id)
                            // console.log('yes')
                            // return self.lastRecord(data[i])
                            break;

                        }
                        else if(self.currentTabData().length == i ){
                            console.log(self.currentTabData()[x].id)
                            console.log('nothing found')
                        }
                        // console.log('i was here')
                    }
                }
            })
        })
    }

    self.getLastRecord = function(data){
        self.currentLastRecord(self.lastRecord()[data])
    }

    /**
     * [profile description]
     * @return {[type]} [description]
     */
    self.profile = function(){
        $.post(base_url + '/api/me', {token:self.token()}).done(function(data){
            self.currentTab("Profile")
            self.currentTabHead(self.profiles())
            self.currentTabData(data)
            console.log(data)
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
            self.records("")
            self.devices("")

            console.log(data)
        })
    }
}

var vm = new ViewModel();
ko.applyBindings(vm);
// ko.applyBindings(new viewModel());

// $(document).ready(function() {
//     $('#myTable').DataTable({responsive:true});
// } );