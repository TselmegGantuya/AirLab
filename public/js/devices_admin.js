/**
 * Admin Devices Model
 * @return {[type]} [description]
 */
var adminDevicesModel = function (){
  var self = this
  self.nav = ko.observable(true)
  self.currentTemplate = ko.observable('deviceTemplate')
  self.organization = ko.observableArray()
  self.devicesOrganization = ko.observableArray()
  self.newDevices = ko.observableArray()
  self.showOrgDevices = ko.observable(false)
  self.showNewDevices = ko.observable(false)
  self.showAdminPart = ko.observable(false)
  self.token = ko.observable()
  self.user = ko.observableArray()
  self.allUserDevices = ko.observableArray()
  self.orgId = ko.observable()
  self.userEmail = ko.observable()
  self.userOrganization = ko.observable()

  /**
   * Method to load models 
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
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
      case 'oldData':
        ko.cleanNode($("#main")[0])
        var newModel = new oldDataModel()
        ko.applyBindings(newModel)
        break;
    }
  }

  /**
   * Get old data 
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  self.oldData = function(data){
    ko.cleanNode($("#main")[0])
    var newModel = new oldDataModel(data)
    ko.applyBindings(newModel)
  }

  /**
   * Token
   */
  if (localStorage.getItem('token')){
    self.token(localStorage.getItem('token'))
  }

  /**
   * Method to get organizations
   * @return {[type]} [description]
   */
  self.getOrganizations = function(){
    $.get(base_url + '/api/airlab/organizations/get').done(function(data){
      self.organization(data)
    })
  }
  self.getOrganizations()

  /**
  * Method for checkbox. Get organizations devices when selected
  * @return {[type]} [description]
  */
  self.organizationRadiobox = function(data,event) {
    self.showOrgDevices(false)
    self.showNewDevices(false)
    if (event.target.checked) {
      //id organization
      self.orgId = event.target.value;
      //get all devices with no organization
      $.get(base_url + '/api/airlab/devices/organization/get' ,{id:self.orgId}).done(function(data){
        if (data != '' && data[0]['organization_id'] != null ){
          self.devicesOrganization(data)
          self.showOrgDevices(!self.showOrgDevices());
        }
      })
      // get new devices
      $.get(base_url + '/api/airlab/new/devices/get').done(function(data){
        if (data != ''){
          self.newDevices(data)
          self.showNewDevices(!self.showNewDevices());
        }
      })
    }
    return true; // to trigger the browser default bahaviour
 }

  /**
  * Devices belonged to User
  * @param  {[type]} data [description]
  * @return {[type]}      [description]
  */
  self.devicesOwner = function(data) {
    var items=document.getElementsByName('devicesOrganization');
    var selectedItems = [];
    for(var i=0; i<items.length; i++){
      if(items[i].type=='checkbox' && items[i].checked==true)
      selectedItems.push(items[i].value+"\n");
    }
    if (selectedItems != 0) {
      // request to delete device from organization
      $.post(base_url + '/api/airlab/device/organization/delete', {device_id:selectedItems}).done(function(data){
        if (data == 1) {
          // request to get new devices 
          $.get(base_url + '/api/airlab/new/devices').done(function(data){
            if (data[0]['organization_id'] == null ){
              self.newDevices(data)
              self.showNewDevices(true);
            }else {
              console.log('Geen nieuwe devices');
            }
          })
          // request to get organizations devices
          $.get(base_url + '/api/airlab/devices/organization/get' ,{id:self.orgId}).done(function(data){
            if(data != ''){
              if (data[0]['organization_id'] != null ){
                self.devicesOrganization(data)
                self.showOrgDevices(self.showOrgDevices());
              }
              else {
                console.log('Geen nieuwe devices');
              }
            }else {
              self.showOrgDevices(false)
            }
          })
        }else {
          console.log('Deleten niet gelukt')
        }
      })
    }
  }

/**
 * new devices
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
  self.newDevice = function(data) {
    var items=document.getElementsByName('newDevices');
    var selectedItems = [];
    for(var i=0; i<items.length; i++){
      if(items[i].type=='checkbox' && items[i].checked==true)
      selectedItems.push(items[i].value+"\n");
    }

    if (selectedItems != 0) {
      // request to add device to organization
      $.post(base_url + '/api/airlab/device/organization/add' ,{ organization_id:self.orgId, device_id:selectedItems}).done(function(data){
        if (data == 1) {
          // request to get new devices
          $.get(base_url + '/api/airlab/new/devices/get').done(function(data){
            if(data != '' ){
              if (data[0]['organization_id'] == null ){
                self.newDevices(data)
                self.showNewDevices();
              }
            }else {
              self.showNewDevices(false);
            }
          })
          // request to get organizations devices 
          $.get(base_url + '/api/airlab/devices/organization/get' ,{id:self.orgId}).done(function(data){
            if (data[0]['organization_id'] != null ){
              self.devicesOrganization(data)
              self.showOrgDevices(true);
            }
            else {
              console.log('Geen devices van organization');
            }
          })
        }else {
          console.log('Updaten niet gelukt')
        }
      })
    }
  }

  /**
  * Get the user devices
  * @return {[type]} [description]
  */
  self.getUserDevices = function(){
    $.post(base_url + '/api/me', {token: self.token()}).done(function(data){
      self.user(data)
      if(self.user().role == 1){
        self.showAdminPart(false)
        // request organizations devices
        $.get(base_url + '/api/airlab/devices/organization/get' ,{id:self.user().organization_id}).done(function(data){
          self.allUserDevices(data)
        })
      }else if(self.user().role == 2){
        self.showAdminPart(true)
      }
    })
  }
  self.getUserDevices()

  /**
   * Method to edit device
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  self.editDevice = function(data){
    // request to edit device
    $.post(base_url + '/api/airlab/device/edit' ,{token: self.token(),id:data.id, name: data.name}).done(function(data){
      if(data ){
        swal("Success!", "Name has been changed!", "success");
      }
    })
  }

  // request to send user info to backend
  $.post(base_url + '/api/me', {token: self.token()}).done(function(data){
    self.userEmail(data.email)
    self.userOrganization(data.name)
  })
}
