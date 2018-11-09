var adminDevicesModel = function (){
  var self = this
  self.nav = ko.observable(true)
  self.currentTemplate = ko.observable('deviceTemplate')
  self.organization = ko.observableArray()
  self.devicesOrganization = ko.observableArray()
  self.newDevices = ko.observableArray()
  self.showOrgDevices = ko.observable(false)
  self.showNewDevices = ko.observable(false)
  self.orgId = ko.observable()
  /*START STEFAN CODE*/

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
 self.getOrganizations = function(){
     $.post(base_url + '/api/uhoo/organizations').done(function(data){
         self.organization(data)
         console.log(self.organization())
     })
 }
 self.getOrganizations()
 /**
  * [organizationCheckbox description]
  * @return {[type]} [description]
  */
 self.organizationRadiobox = function(data,event) {
   self.showOrgDevices(false)
   self.showNewDevices(false)
   if (event.target.checked) {
     //id organization
     console.log(event.target.value)
     self.orgId = event.target.value;
     //get all devices with no organization
     $.post(base_url + '/api/uhoo/getDevicesOrganization' ,{id:self.orgId}).done(function(data){

         if (data != '' && data[0]['organization_id'] != null ){
           self.devicesOrganization(data)
           self.showOrgDevices(!self.showOrgDevices());
         }
     })
     $.post(base_url + '/api/uhoo/getNewDevices').done(function(data){
         if (data != ''){
           self.newDevices(data)
           self.showNewDevices(!self.showNewDevices());
         }
     })
   }
   return true; // to trigger the browser default bahaviour
 }

 self.devicesOwner = function(data) {
   var items=document.getElementsByName('devicesOrganization');
   var selectedItems = [];
   for(var i=0; i<items.length; i++){
     if(items[i].type=='checkbox' && items[i].checked==true)
     selectedItems.push(items[i].value+"\n");
   }
   if (selectedItems != 0) {
     $.post(base_url + '/api/uhoo/deleteDevicesOrganization', {device_id:selectedItems}).done(function(data){
       if (data == 1) {
         $.post(base_url + '/api/uhoo/getNewDevices').done(function(data){
             if (data[0]['organization_id'] == null ){
               self.newDevices(data)
               self.showNewDevices(true);
             }
             else {
               console.log('Geen nieuwe devices');
             }
         })
         $.post(base_url + '/api/uhoo/getDevicesOrganization' ,{id:self.orgId}).done(function(data){
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

 self.newDevice = function(data) {
   var items=document.getElementsByName('newDevices');
   var selectedItems = [];
   for(var i=0; i<items.length; i++){
     if(items[i].type=='checkbox' && items[i].checked==true)
     selectedItems.push(items[i].value+"\n");
   }
   if (selectedItems != 0) {
     $.post(base_url + '/api/uhoo/addDeviceOrg' ,{ organization_id:self.orgId, device_id:selectedItems}).done(function(data){
       if (data == 1) {
         console.log('privjet')
         $.post(base_url + '/api/uhoo/getNewDevices').done(function(data){
           console.log(data)
           if(data != '' ){
             console.log('test')
             if (data[0]['organization_id'] == null ){
               self.newDevices(data)
               self.showNewDevices();
             }
           }else {
              self.showNewDevices(false);
           }
         })
         $.post(base_url + '/api/uhoo/getDevicesOrganization' ,{id:self.orgId}).done(function(data){
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
 /*END STEFAN CODE*/
}
