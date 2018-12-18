/**
*
*   Knockoutjs
*/
var profileModel = function (){
  var self = this
  self.nav = ko.observable(true)
  self.showAdminPart = ko.observable(false)
  self.showUserPart = ko.observable(true)
  self.currentTemplate = ko.observable('profileTemplate')
  self.profiles = ko.observableArray([
    {name:"Name"},
    {name:"Email"},
    {name:"Organization"}
  ])
  self.username = ko.observable()
  self.useremail = ko.observable()
  self.userorganization = ko.observable()
  self.currentTabHead = ko.observableArray()
  self.currentTabData = ko.observableArray()
  self.currentUser = ko.observable()
  self.currentOrg = ko.observable()
  self.current_password = ko.observable()
  self.new_password = ko.observable()
  self.confirm_password = ko.observable()
  self.userEmail = ko.observable()
  self.userOrganization = ko.observable()
  self.organizations = ko.observableArray()
  self.token = ko.observable()
  self.role = ko.observable()
  self.users = ko.observable()
  self.user_input = ko.observable([
      {name:"Name", input:"text"},
      {name:"Password", input:"password"},
      {name:'Email', input:'text'}
    ])
  self.reg_input = ko.observable([

    {name:"Name", input:"text"},
    {name:"Password", input:"password"},
    {name:'Email', input:'text'}
  ])
  self.up_input = ko.observable([
    {name:"Name", input:"text"},
    {name:"file", input:"file"},
  ])
  self.inputs = ko.observableArray([
    {name:"Name", input:"text"},
    {name:"Password", input:"password"},
    {name:'Email', input:'text'}
  ])
  self.selectedOrg = ko.observable()
  self.set = ko.observable('Register')

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
   * Method to change from tabs
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  self.changeSet = function(data){
    self.set(data)
    if(self.set() == 'Register'){
      self.inputs(self.reg_input())
    }else if(self.set() == 'Upload Blueprint'){
      self.inputs(self.up_input())
    }
    else if(self.set() == 'Change setting'){
      self.inputs(self.user_input())
    }
  }

  /*
  *   Edit Profile
  */
   self.editProfile = function(data){
    $.post(base_url + '/api/uhoo/editProfile' ,{token: self.token(),id:data.id, name: data.name, email: data.email, password: self.new_password()})
      .done(function(data){
        console.log(data);
        if(data ){
          swal("Success!", "Name has been changed!", "success");
        }

      })
  }
  self.multiFunc = function() {
    /* 
    * Register New blueprints as a admin
    */
    if(self.set() == 'Upload Blueprint'){
      var formData = new FormData()
      console.log($('#file')[0].files[0])
      // HTML file input, chosen by user
      formData.append("blueprint", $("#file")[0].files[0])
      formData.append("token", self.token())
      formData.append("organizations", $("#orgSelect").val())
      formData.append("name", $("#Name").val())
      var request = new XMLHttpRequest()
      request.open("POST", base_url + '/api/blueprint/upload/admin')
      request.onreadystatechange = function () {
        if(request.readyState === 4 && request.status === 200) {
          swal("Success!", "Image succesfull uploaded!", "success")
        }
      }
      request.send(formData)
      
    }
    /* 
    * Register New users as a admin
    */
    else if(self.set() == 'Register'){
      $.post(base_url + '/api/user/register',{name:$("#Name").val(), password:$("#Password").val(), email:$("#Email").val(), org:$("#orgSelect").val()}).done(function(data){
        swal("Success!", "Profile succesfull created!", "success")
      })
    }
    else if(self.set() == 'Change setting'){
      $.post(base_url + '/api/user/info',{name:$("#Name").val(), password:$("#Password").val(), email:$("#Email").val(), id:$('#userSelect').val(), org:$('#orgChange').val()}).done(function(data){
        swal("Success!", "Profile succesfull edited!", "success")
        self.orgSet()
      })
    }
  }

  /**
   * Token
   */
  if (localStorage.getItem('token')){
    self.token(localStorage.getItem('token'))
  }

  /**
  * Display blueprint and drag n drop devices onto blueprint
  * @return {[type]} [description]
  */
  self.enterPage = function() {
    $.get(base_url + '/api/airlab/organizations/get').done(function(data){
      self.organizations(data)
      self.currentOrg(self.organizations()[0].id)
      $.get(base_url + '/api/getUsersOrg', {id: self.currentOrg()}).done(function(data){
      self.users(data)
      })
    })
    
    $.post(base_url + '/api/me').done(function(data){
      self.username(data.name)
      self.useremail(data.email)
      self.userorganization(data.organization)
      self.currentTabHead(self.profiles())
      self.currentTabData(data)
      self.currentTabData().password = "";
      self.userEmail(data.email)
      self.userOrganization(data.name)
      self.role(data.role)
      if(self.role() == 1){
        self.showAdminPart(false)
      }else if (self.role() == 2){
        self.showAdminPart(true)
        self.showUserPart(false) 
      } 
    })
  }
  self.enterPage()
}