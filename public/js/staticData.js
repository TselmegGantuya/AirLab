var staticDataModel = function (){
  var self = this
  self.nav = ko.observable(true)
  self.currentTemplate = ko.observable('staticDataPage')
  self.organization = ko.observableArray()
  self.devicesOrganization = ko.observableArray()
  self.newDevices = ko.observableArray()
  self.showOrgDevices = ko.observable(false)
  self.showNewDevices = ko.observable(false)
  self.orgId = ko.observable()
  self.user = ko.observableArray()
  self.allColorDevices = ko.observableArray()
  self.token = ko.observable()
  self.userEmail = ko.observable()
  self.userOrganization = ko.observable()

  // Load model
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
      case 'statData':
        ko.cleanNode($("#main")[0])
        var newModel = new staticDataModel()
        ko.applyBindings(newModel)
        break;
    }
  }

  /**
   * Token
   */
  if (localStorage.getItem('token'))
  {
    self.token(localStorage.getItem('token'))
  }

  /**
  * [colorDevices description]
  * @return {[type]} [description]
  */
  self.colorDevices = function(){
    $.post(base_url + '/api/me', {token: self.token()}).done(function(data){
      self.user(data)
      //get devices with organization
      $.get(base_url + '/api/airlab/devices/data/get' ,{token: self.token(),id:self.user().organization_id}).done(function(data){
        self.allColorDevices(data)
      })
    })
  }
  self.colorDevices()
  
  // request to send user info to backend
  $.post(base_url + '/api/me', {token: self.token()}).done(function(data){
    self.userEmail(data.email)
    self.userOrganization(data.name)
  })
}
