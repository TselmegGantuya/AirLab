/**
*
*   Knockoutjs
*/
var profileModel = function (){
  var self = this
  self.nav = ko.observable(true)
  self.currentTemplate = ko.observable('profileTemplate')
  self.profiles = ko.observableArray([
    {name:"Name"},
    {name:"Email"}
  ])
  self.user = ko.observable()
  self.currentTabHead = ko.observableArray()
  self.currentTabData = ko.observableArray()
  self.current_password = ko.observable()
  self.new_password = ko.observable()
  self.confirm_password = ko.observable()


  self.loadModel = function(data) {
    switch(data) {
      case 'dash':
        ko.cleanNode($("#main")[0])
        var newModel = new dashModel()
        ko.applyBindings(newModel)
        break
      case 'pro':
        ko.cleanNode($("#main")[0])
        var newModel = new profileModel()
        ko.applyBindings(newModel)
        break;
      case 'dev':
        ko.cleanNode($("#main")[0])
        var newModel = new adminDevicesModel()
        ko.applyBindings(newModel)
        break;
      case 'out':
        ko.cleanNode($("#main")[0])
        var newModel = new logoutModel()
        ko.applyBindings(newModel)
        break;
    }
  }
  /**
   * [toggleVisibilityProfile description]
   * @return {[type]} [description]
   */
  self.enterPage = function() {
      $.post(base_url + '/api/me').done(function(data){
        console.log(data)
        self.user(data['name'])
          self.currentTabHead(self.profiles())
          self.currentTabData(data)
      })
  }

  self.openBtn = function(){
      $('#myModal').modal({show:true})
  }

self.enterPage()
  self.saveToPhp = function() {
      var formData = $('#pass_form').serialize();
      $.post(base_url + '/api/uhoo/password/reset',{formData}).done(function(data){
          console.log('Check PHP')
      })
  }
}
