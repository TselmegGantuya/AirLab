  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
    }
  });

function Model ()
{
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
    self.token = ko.observable()
    self.currentPageData = ko.observableArray()
    self.currentPage = ko.observable()
    self.pages = ko.observableArray()
    self.meters = ko.observableArray()
    self.devices = ko.observableArray()

    /**
     * [loginToken description]
     * @return {[type]} [description]
     */
    self.loginToken = function() {
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
    }


    self.registerToDB = function()

    {
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

    self.choosePage = function(data)
    {
        data = data.toLowerCase()
        self.currentPage(data)
        console.log(self.currentPage())

        if (data == "login") {

            self.currentPageData(self.loginInfo())
            self.pages([{name: 'Register'}, {name: 'Forget password'}])

        }else if (data == "register"){

            self.currentPageData(self.registerInfo())
            self.pages([{name: 'Login'}, {name: 'Forget password'}])

        }else{

            self.currentPageData(self.forgetInfo())
            self.pages([{name: 'Register'}, {name: 'Login'}])

        }

        console.log(self.currentPageData())
    }

    self.choosePage('login')
}

ko.applyBindings(new Model())
