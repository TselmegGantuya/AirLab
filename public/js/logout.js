// Logout model
var logoutModel = function (){
  var self = this
  self.nav = ko.observable(false)
  self.token = ko.observable()

  /**
   * Token
  */
  if (localStorage.getItem('token')){
    self.token(localStorage.getItem('token'))
  }

  self.loadModel = ko.observable(false)

  /**
   * Method to logout from app
   * @return {[type]} [description]
   */
  self.logout = function(){
    $.post(base_url + '/api/logout', {token:self.token()}).done(function(data){
      localStorage.removeItem('myCat')
      localStorage.removeItem('token')
      ko.cleanNode($("#main")[0])
      var newModel = new loginModel()
      ko.applyBindings(newModel)
    })
  }
  self.logout()
}
