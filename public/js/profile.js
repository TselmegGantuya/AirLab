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
  self.userEmail = ko.observable()
  self.userOrganization = ko.observable()
  self.organizations = ko.observableArray()
  self.token = ko.observable()
  self.role = ko.observable()
  self.inputs = ko.observableArray([
        {name:"Name", input:"text"},
        {name:"Password", input:"password"},
        {name:'Email', input:'text'}
      ])
  self.selectedOrg = ko.observable()


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
  /* 
  *   Register New users a admin
  */
  self.register = function() {
    $.post(base_url + '/api/user/register',{name:$("#Name").val(), password:$("#Password").val(), email:$("#Email").val(), org:$("#orgSelect").val()})
  }
  /**
   * [toggleVisibilityProfile description]
   * @return {[type]} [description]
   */
   if (localStorage.getItem('token'))
  {
    self.token(localStorage.getItem('token'))
  }
  self.enterPage = function() {
    $.post(base_url + '/api/uhoo/organizations').done(function(data){
      self.organizations(data)
    })
    $.post(base_url + '/api/me').done(function(data){
      console.log(data)
      self.user(data.name)
      self.currentTabHead(self.profiles())
      self.currentTabData(data)
      self.userEmail(data.email)
      self.userOrganization(data.name)
      self.role(data.role)
      console.log(self.role())
    })
  }
self.enterPage()
}