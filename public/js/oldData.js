var oldDataModel = function (data){
  var self = this
  self.nav = ko.observable(true)
  self.currentTemplate = ko.observable('oldData')
  self.organization = ko.observableArray()
  self.token = ko.observable()
  self.user = ko.observableArray()
  self.allUserDevices = ko.observableArray()
  self.orgId = ko.observable()
  self.userEmail = ko.observable()
  self.userOrganization = ko.observable()
  self.deviceId = ko.observable()
  self.oldRecords = ko.observableArray()
  self.deviceName = ko.observable()
  self.history = ko.observable(false)
  self.noData = ko.observable(false)

  // Load Model
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

  self.deviceId = data.id
  self.deviceName = data.name
  // request to get records
  $.get(base_url + '/api/airlab/records/id/get' ,{id: self.deviceId}).done(function(data){
    if(data.length != 0){
      self.history(true)
      self.oldRecords(data)
    }else {
      self.noData(true)
    }
  })
}
