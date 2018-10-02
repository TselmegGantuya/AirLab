/**
*
*   Knockoutjs
*/
var adminModel = function (){
  var self = this

  self.adminPageVis = ko.observable(true)
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
			    'token': self.token()
			  }
			})
      if(self.setRole())
      {
      	self.loginPageVis = ko.observable(false)
      	if(self.userRole() == 'user')
      	{
      		//ko.applyBindings(model)
      	}
      	else
      	{
      		//ko.applyBindings(admin())
      	}
      }
    })
  }


  self.setRole = function()
  {
  	$.post(base_url + '/api/me').done(function(data)
    {
      if ( data['role'] == 1 )
      {
        self.userRole('user')    
      }
      else if ( data['role'] == 2 ) {
  	    self.userRole('admin')
      }
    }).fail(function(xhr, status, error){
    	 alert("Login expired");
    	 return false;
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
    if (localStorage.getItem('token'))
    {
      self.token(localStorage.getItem('token'))
      $.ajaxSetup({
			  headers: {
			    'token': self.token()
			  }
			})
      if(self.setRole())
      {
      	self.loginPageVis = ko.observable(false)
      	if(self.userRole() == 'user')
      	{
      		//ko.applyBindings(model)
      	}
      	else
      	{
      		//ko.applyBindings(admin())
      	}
      }
    }
    self.choosePage('login')
  }
  self.enterPage()
}

var model = new loginModel()
ko.applyBindings(model)