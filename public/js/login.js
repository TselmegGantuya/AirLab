$.ajaxSetup({
  headers: {
    'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
  }
})
var localStorage = window.localStorage
var base_url = window.location.origin
$( document ).ajaxError(function( event, jqXHR, settings, thrownError) {
  var msg = ''
  if (jqXHR.status === 0) {
    msg = 'Not connect.\n Verify Network.'
  } else if (jqXHR.status == 404) {
    msg = 'Requested page not found. [404]'
  } else if (jqXHR.status == 500) {
    msg = 'Internal Server Error [500].'
  } else if (jqXHR.status == 401) {
    msg = 'Unauthorized.'
    localStorage.removeItem('token')
    ko.cleanNode($("#main")[0])
    var newModel = new loginModel()
    ko.applyBindings(newModel)
  } else if (exception === 'parsererror') {
    msg = 'Requested JSON parse failed.'
  } else if (exception === 'timeout') {
    msg = 'Time out error.'
  } else if (exception === 'abort') {
    msg = 'Ajax request aborted.'
  } else {
    msg = 'Uncaught Error.\n' + jqXHR.responseText
  }
  alert(msg)
})
/**
*
*   Knockoutjs
*/
var loginModel = function (){
  var self = this
  self.userRole = ko.observable()
	self.loginButton = ko.observable()
  self.loginInfo = ko.observableArray([
    {name:"email"},
    {name:"password"}
  ])
  self.forgetInfo = ko.observableArray([
    {name:"email"}
  ])
  self.loginButton = ko.observable()
  self.token = ko.observable()
  self.pages = ko.observableArray()
  self.nav = ko.observable(false)
  self.currentPage = ko.observable()
  self.currentPageData = ko.observableArray()
  self.currentTemplate = ko.observable('loginPage')

  self.loadModel = function(data) {
    switch(data) {
    	case 'dash':
    		break
      case 'pro':
        break
      case 'dev':
        break
      case 'out':
        break
    }
  }
     /**
     * [loginToken description]
     * @return {[type]} [description]
     */

  self.loginToken = function() {

    $.post(base_url + '/api/login',{email:$('#email').val(), password:$('#password').val()}).done(function(data)
    {
      self.token(data['access_token'])
      localStorage.setItem('token',self.token())
      $.ajaxSetup({
			  headers: {
			    'Authorization': 'Bearer '+ self.token()
			  }
			})
		$.post(base_url + '/api/me').done(function(data)
    {

      if ( data['role'] == 1 )
      {
        self.userRole('user')
        console.log('set to user')
        ko.cleanNode($("#main")[0])
        var newModel = new dashModel()
        ko.applyBindings(newModel)
      }
      else if ( data['role'] == 2 ) {
  	    self.userRole('admin')
  	    console.log('set to admin')
        ko.cleanNode($("#main")[0])
        var newModel = new dashModel()
        ko.applyBindings(newModel)
      }

    }).fail(function(xhr, status, error){

    	 console.log("Login expired")
    })

    })
  }


  self.choosePage = function(data)
  {
    data = data.toLowerCase()
    self.currentPage(data)

    if (data == "login") {
      self.loginButton('Sign in')
      self.currentPageData(self.loginInfo())
      self.pages([{name: 'Forgot password'}])
    }
    else{
        self.loginButton('Send email')
        self.currentPageData(self.forgetInfo())
        self.pages([{name: 'Login'}])
    }
  }


  self.enterPage = function() {
  self.choosePage('login')
    if (localStorage.getItem('token'))
    {
      self.token(localStorage.getItem('token'))
      $.ajaxSetup({
			  headers: {
			    'Authorization': 'Bearer '+ self.token()
			  }
			})

  /**
   * [description]
   * @param  {[type]} data)                 {            if ( data['role'] [description]
   * @return {[type]}       [description]
   */
    $.post(base_url + '/api/me').done(function(data)
    {

      if ( data['role'] == 1 )
      {
        self.userRole('user')
        console.log('set to user')
        ko.cleanNode($("#main")[0])
        self.currentTemplate = ko.observable('blueprintPage')
        var newModel = new dashModel()
        ko.applyBindings(newModel)
      }
      else if ( data['role'] == 2 ) {
  	    self.userRole('admin')
  	    console.log('set to admin')
      }

    })
	}
  }
  self.enterPage()
}
var model = new loginModel()
ko.applyBindings(model)