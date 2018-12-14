/**
*   Knockoutjs
*/
var localStorage = window.localStorage
var base_url = window.location.origin
var fullModel = function (){
  var self = this
  self.setColorDevices = ko.observable(false)
  self.setBlueprint = ko.observable(true)
  self.token = ko.observable()
  self.blueprintName = ko.observable()
  self.blueprintData = ko.observableArray() 
  self.blueprintDevices = ko.observableArray()
  self.blueprintDevi = ko.observableArray()
  self.removeBpDevices = ko.observableArray() 
  self.userEmail = ko.observable()
  self.userOrganization = ko.observable()
  self.devices = ko.observableArray() 
  self.currentBlueprint = ko.observable()
  self.user = ko.observableArray()
  self.allColorDevices = ko.observableArray()
  self.records = ko.observableArray()
  self.lastRecord = ko.observableArray()
  self.currentBlueprintSize = ko.observable()
  self.currentBlueprintHeight = ko.observable()
  self.currentBlueprintWidth = ko.observable()
  /**
   * [selectFunc description]
   * @return {[type]} [description]
   */
  self.selectFunc = function(){
    let canvas = document.getElementById("currentBP")
    let context = canvas.getContext("2d")
    context.clearRect(0, 0, canvas.width, canvas.height)
    if(self.currentBlueprint()){
    let path = self.currentBlueprint()['path']
    self.blueprintName(self.currentBlueprint().name);
    let img = new Image()
    img.src = base_url + '/storage/' + path
    img.addEventListener("load", function() {
      if(img.width / canvas.width < img.height / canvas.height){
        let mult = img.height / canvas.height
        let w = Math.floor(img.width / mult)
        let h = Math.floor(img.height / mult)
        context.drawImage(img,canvas.width / 2 - w / 2,0,w,h)
      }
      else
      {
        let mult = img.width / canvas.width
        let w = Math.floor(img.width / mult)
        let h = Math.floor(img.height / mult)
        context.drawImage(img,0,canvas.height / 2 - h / 2,w,h)
      }
      self.currentBlueprintSize(img.width/img.height)
      self.currentBlueprintWidth(img.width)
      self.currentBlueprintHeight(img.height)
    })
    }
  }
  self.blueprintdash = function () {
    // request to get devices where top_pixel and left_pixel are not equal to null
    $.get(base_url + '/api/blueprint/db/devices/get').done(function(data) {
      data.forEach(function(element) {
        var btn = document.createElement("BUTTON");
        let toppixel = element.top_pixel - 134
        let leftpixel = element.left_pixel - 258
        btn.setAttribute("data-toggle", "popover");
        btn.style.position = 'absolute';
        btn.className = "btn draggable btn-circle drag-drop " + element.colorClass;
        btn.id = element.id;
        self.devices(btn.id)
        btn.style.left = leftpixel +'px';
        btn.style.top = toppixel +'px';
        document.getElementById("bp").appendChild(btn);

        // jquery popover method. Return device name when hovered over 
        $('[data-toggle="popover"]').popover({
          placement: 'top',
          animation: true,
          trigger: 'hover',
          title: "Device",
          title: function() {
            if (element.id == btn.id) {
              return element.name
            }
          },
          content: function() {
            if (element.id == btn.id) {
              return element.danger
            }
          },
        })

        // Open modal to remove device from blueprint
        $(btn).on('click', function(e) {
          $('#removeDevice').modal('show')
          self.devices(element)
          $.post(base_url + '/api/blueprint/records/getForDevice', {id: element.id}).done(function(data) {
            // this function will return true after 1 second (see the async keyword in front of function)
            async function returnTrue() {
              // create a new promise inside of the async function
              let promise = new Promise((resolve, reject) => {
                setTimeout(() => resolve(self.records(data)), 500) // resolve
              });
              // wait for the promise to resolve
              let result = await promise;
              console.log(data);
            }
            // call the function
            returnTrue()

            // setTimeout(function(){
            //   self.records(data)
            //   console.log(data);
            // }, 10)
          })

          // Method to remove device from blueprint and refresh page
          self.removeDevice = function(){
            $.post(base_url + '/api/blueprint/device/remove', {id: self.devices().id}).done(function(data) {
            // this function will return true after 1 second (see the async keyword in front of function)
            async function returnTrue() {
              // create a new promise inside of the async function
              let promise = new Promise((resolve, reject) => {
                setTimeout(() => resolve($('.draggable').remove()), 500) // resolve
              });
              // wait for the promise to resolve
              let result = await promise;
              self.blueprintdash()
              // request to get devices on blueprint
              $.get(base_url + '/api/blueprint/devices/get').done(function(data) {
                self.blueprintDevices(data)
              })
            }
            // call the function
            returnTrue()
            })
          }
        })
      })
    })
  }
  /**
  * Display blueprint and drag n drop devices onto blueprint
  * @return {[type]} [description]
  */
  self.enterPage = function () {
    if (localStorage.getItem('token'))
  {
    self.token(localStorage.getItem('token'))
    $.ajaxSetup({
        headers: {
          'Authorization': 'Bearer '+ self.token()
        }
    })
  }
  $.post(base_url + '/api/me', {token: self.token()}).fail(function(data){
      window.location.replace(base_url)
    })
  
    // request to get user's blueprint from DB
    $.get(base_url + '/api/blueprint/get').done(function(data){
      for (var i = 0, d; d = data[i]; i++) {
        self.blueprintData.push({ id:d.id, name:d.name, path:d.path.replace('public/', '')})
      }
      // request to get devices on blueprint
      $.get(base_url + '/api/blueprint/devices/get').done(function(data) {
        self.blueprintDevices(data)
      })
      self.blueprintdash()
    })

    // request to get user info to backend
    $.post(base_url + '/api/me', {token: self.token()}).done(function(data){
        self.userEmail(data.email)
        self.userOrganization(data.name)
    })
  }
  self.enterPage()
}
var model = new fullModel()
ko.applyBindings(model)