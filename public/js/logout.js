var logoutModel = function (){
  var self = this
  self.nav = ko.observable(false)
  self.token = ko.observable()
  if (localStorage.getItem('token'))
  {
    self.token(localStorage.getItem('token'))
  }
  self.loadModel = ko.observable(false)
  console.log('Ik zit hier')

  /**
   * [logout description]
   * @return {[type]} [description]
   */

  self.logout = function(){
      $.post(base_url + '/api/logout', {token:self.token()}).done(function(data){
        console.log('User has been logged out')
          localStorage.removeItem('myCat')
          ko.cleanNode($("#main")[0])
          var newModel = new loginModel()
          ko.applyBindings(newModel)
      })
  }
  self.logout()
}
