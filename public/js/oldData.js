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


    console.log('Hey!');
    // hier komt nog data sht call
    self.deviceId = data.id
    self.deviceName = data.name
    $.post(base_url + '/api/uhoo/recordsById' ,{id: self.deviceId})
          .done(function(data){
            console.log(data)
            if(data.length != 0){
              console.log('sup')
              self.history(true)
              console.log(data);
              self.oldRecords(data)
            }else {
              self.noData(true)
            }

      })
}
