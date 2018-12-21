/**
*   Knockoutjs
*/
var dashModel = function (){
  var self = this
  self.optionValues = ko.observableArray(["Pick a value...","temperature", "relative_humidity", "pm2_5", "tvoc", "co2", "co", "air_pressure","ozone", "no2"])
  self.selectedOptionValue = ko.observable('Select a value')
  self.currentTemplate = ko.observable('blueprintPage')
  self.nav = ko.observable(true)
  self.setColorDevices = ko.observable(false)
  self.setBlueprint = ko.observable(true)
  self.showLocked = ko.observable(true)
  self.showUnlocked = ko.observable(false)
  self.token = ko.observable()
  self.blueprintName = ko.observable()
  self.blueprintData = ko.observableArray()
  self.blueprintDevices = ko.observableArray()
  self.userEmail = ko.observable()
  self.userOrganization = ko.observable()
  self.devices = ko.observableArray()
  self.currentBlueprint = ko.observable()
  self.user = ko.observableArray()
  self.allColorDevices = ko.observableArray()
  self.records = ko.observableArray()
  self.currentBlueprintSize = ko.observable()
  self.currentBlueprintHeight = ko.observable()
  self.currentBlueprintWidth = ko.observable()
  self.deviceId = ko.observable()
  self.selectedOptionValue = ko.observable()

  /**
   * Token
   */
  if (localStorage.getItem('token'))
  {
    self.token(localStorage.getItem('token'))
  }

  /**
   * Switching between models
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
        break
      case 'dev':
        ko.cleanNode($("#main")[0])
        var newModel = new adminDevicesModel()
        ko.applyBindings(newModel)
        break
      case 'out':
        ko.cleanNode($("#main")[0])
        var newModel = new logoutModel()
        ko.applyBindings(newModel)
        break
      case 'statData':
        ko.cleanNode($("#main")[0])
        var newModel = new staticDataModel()
        ko.applyBindings(newModel)
        break;
    }
  }

  /**
   * [selectFunc description]
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
        // If statement to check if height and width of blueprint
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

        // this function will remove after 1 second
        async function removeDraggable() {
          // create a new promise inside of the async function
          let promise = new Promise((resolve, reject) => {
            setTimeout(() => resolve($('.draggable').remove()), 10) // resolve
          });
          // wait for the promise to resolve
          let result = await promise;
          self.blueprintdash()
        }
        
        // call the function
        removeDraggable()
      })
    }
  }

  /**
   * Delete blueprint
  */
  self.deleteBP = function(){
    //request to delete blueprint
    $.post(base_url + '/api/blueprint/delete',{id:self.currentBlueprint().id})
    self.blueprintData.remove(self.currentBlueprint())
  }

  /**
   * Change blueprint name
   */
  self.changeNameBTN = function(){
    let id =  self.currentBlueprint()['id']
    // request to change name of blueprint
    $.post(base_url + "/api/blueprint/name/change",{name:$('#changeName').val(),id:id}).done(function(){
      self.blueprintData.removeAll()
      // request to get blueprint
      $.get(base_url + '/api/blueprint/get').done(function(data){
        for (var i = 0, d; d = data[i]; i++) {
          self.blueprintData.push({ id:d.id, name:d.name, path:d.path.replace('public/', '')})
        }
      })
    })
  }

  /**
  *   Upload image
  */
  self.fileSelect = function (element,event) {
    var files =  event.target.files// FileList object
    var formData = new FormData()

    // HTML file input, chosen by user
    formData.append("blueprint", files[0])
    formData.append("token", self.token())

    var request = new XMLHttpRequest()
    request.open("POST", base_url + '/api/blueprint/upload')
    request.send(formData)
    self.blueprintData.removeAll()
    
    // Request to get blueprint
    $.get(base_url + '/api/blueprint/get').done(function(data){
      for (var i = 0, d; d = data[i]; i++) {
        self.blueprintData.push({ id:d.id, name:d.name, path:d.path.replace('public/', '')})
      }
    })
  }

  /**
  *
  *   promise function
  *
  */
  function resolvePost(file) {
    return new Promise(resolve => {
      var formData = new FormData()
 
      // HTML file input, chosen by user
      formData.append("id", self.currentBlueprint()['id'])
      formData.append("blueprint", file)
      formData.append("token", self.token())

      var request = new XMLHttpRequest()
      // request tp update blueprint
      request.open("POST", base_url + '/api/blueprint/update')
      request.onreadystatechange = function () {
        if(request.readyState === 4 && request.status === 200) {
          console.log(request.responseText)
          resolve()
        }
      }
      request.send(formData)
    })
  }

  /**
  *
  *   Switch image
  */
  self.fileSwitch = function (element,event) {
    var files =  event.target.files// FileList object
    let img = new Image()
    img.src = window.URL.createObjectURL( files[0] )
    img.onload = async function(){
      var size = img.width / img.height

      if(self.currentBlueprintSize() != size){
        swal("Whoeps!", "The image size must be " + self.currentBlueprintWidth()  + " x " + self.currentBlueprintHeight() + " !", "warning");
        return;
      }

      let result = await resolvePost(files[0])
      // remove data from the blueprint
      self.blueprintData.removeAll()

      // Request to get blueprint
      $.get(base_url + '/api/blueprint/get').done(function(data){
        for (var i = 0, d; d = data[i]; i++) {
          self.blueprintData.push({ id:d.id, name:d.name, path:d.path.replace('public/', '')})
        }
      })
    }
  }

  /**
   * First get devices from DB then create element of devices with pixels and append to HTML
   * @return {[type]} [description]
   */
  /**
   * First get devices from DB then create element of devices with pixels and append to HTML
   * @return {[type]} [description]
   */
  self.blueprintdash = function () {
    // request to get devices on blueprint 
    $.get(base_url + '/api/blueprint/devices/get').done(function(data) { 
      self.blueprintDevices(data)  
    })

    // request to get devices where top_pixel and left_pixel are not equal to null
    $.get(base_url + '/api/blueprint/db/devices/get').done(function(data) {
      data.forEach(function(element) {
        if (element.blueprint_id == self.currentBlueprint().id) {
          var btn = document.createElement("BUTTON");
          let toppixel = element.top_pixel - 79
          btn.setAttribute("data-toggle", "popover");
          btn.style.position = 'absolute';
          btn.className = "btn draggable btn-circle drag-drop " + element.colorClass;
          btn.id = element.id;
          self.devices(btn.id)
          btn.style.left = element.left_pixel +'px';
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
              $.post(base_url + '/api/blueprint/records/device/get', {id: element.id}).done(function(data) {
                self.deviceId = element.id
                // this function will return device records
                async function returnDeviceRecords() {
                  // create a new promise inside of the async function
                  let promise = new Promise((resolve, reject) => {
                    setTimeout(() => resolve(self.records(data)), 500) // resolve
                  });
                  // wait for the promise to resolve
                  let result = await promise;
                }
                // call the function
                returnDeviceRecords()
              })

            // Method to remove device from blueprint and refresh page
            self.removeDevice = function(){
              $.post(base_url + '/api/blueprint/device/remove', {id: self.devices().id}).done(function(data) {
                self.stopDragNDropLogic()
              })
            }
          })
        }
      })
    })
  }

  /**
   * [dragNDropLogic description]
   * @return {[type]} [description]
   */
  self.dragNDropLogic = function () {
    self.showUnlocked(true);
    self.showLocked(false);
    $('.draggable').mousedown(function(event) {
      $('[data-toggle="popover"]').popover('hide')
      event.preventDefault()
      let dragElement = event.target.closest('.draggable');
      let currentDroppable = null;
      if (!dragElement) return;
      let coords, shiftX, shiftY;
      startDrag(event.clientX, event.clientY);
      document.addEventListener('mousemove', onMouseMove);

      // on drag start:
      // remember the initial shift
      // move the element position:fixed and a direct child of body
      function startDrag(clientX, clientY) {
        shiftX = clientX - dragElement.getBoundingClientRect().left;
        shiftY = clientY - dragElement.getBoundingClientRect().top;
        dragElement.className = "btn btn-info draggable btn-circle";
        dragElement.style.color = 'red';
        dragElement.style.position = 'fixed';
        document.body.append(dragElement);
        moveAt(clientX, clientY);
      }

      // switch to absolute coordinates at the end, to fix the element in the document and send coordinates to DB
      function finishDrag() {
        dragElement.style.top = parseInt(dragElement.style.top) + pageYOffset + 'px';
        dragElement.style.left = parseInt(dragElement.style.left) + pageXOffset + 'px';
        dragElement.style.position = 'absolute';
        dragElement.className = "btn btn-info draggable btn-circle drag-drop";
        document.removeEventListener('mousemove', onMouseMove);
        dragElement.onmouseup = null;
        //request to send device coordinations to DB
        $.post(base_url + '/api/blueprint/coordinations/get', {blueprintData: [{left: dragElement.style.left, top: dragElement.style.top, id: self.currentBlueprint().id, device_id: dragElement.id}]}).done(function(data) {})
      }

      // method to what happens when device is not clicked
      dragElement.onmouseup = function(event) {
        event.preventDefault()
        finishDrag()
      }
      
      // When mouse is moving 
      function onMouseMove(event) {
        event.preventDefault()
        moveAt(event.clientX, event.clientY);

        // in a mouse event handler
        dragElement.hidden = true;
        let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
        dragElement.hidden = false;
        // elemBelow is the element below the dragElement. If it's droppable, we can handle it.
        
        // mousemove events may trigger out of the window (when the device is dragged off-screen)
        // if clientX/clientY are out of the window, then elementfromPoint returns null
        if (!elemBelow) return;
        // potential droppables are labeled with the class "droppable" (can be other logic)
        let droppable = elemBelow.closest('#bp');
        if (currentDroppable != droppable) { 
          // if there are any changes
          //   currentDroppable=null if we were not over a droppable (e.g over an empty space)
          //   droppable=null if we're not over a droppable now, during this event
          if (currentDroppable) {
            // the logic to process "flying out" of the droppable (remove highlight)
            leaveDroppable(currentDroppable);
          }

          currentDroppable = droppable;
          if (currentDroppable) {
            // the logic to process "flying in" of the droppable
            enterDroppable(currentDroppable);
          }
        }
      }
      
      // When device enters blueprint or is in blueprint
      function enterDroppable(elem) {
        elem.style.background = '#f3f8fa';
      }

      // When device leaves blueprint
      function leaveDroppable() {
        document.removeEventListener('mousemove', onMouseMove);
        swal({
          title: "ERROR!",
          text: "Please stay inside the blueprint.",
          icon: "error"
        })
        self.stopDragNDropLogic()
      }

      // get coordinates when mouse is moving
      function moveAt(clientX, clientY) {
        // new window-relative coordinates
        let newX = clientX - shiftX;
        let newY = clientY - shiftY;

        dragElement.style.left = newX + 'px';
        dragElement.style.top = newY + 'px';
      }
    })
  }

  /**
   * Logic for records in chart
   * @param  {[type]} data  [description]
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  self.getChart = function(data,event) {
    console.log(data);
    if(event.target.value != 'Pick a value...' && self.deviceId){
      $.get(base_url + '/api/airlab/device/records/chart/get' ,{id:self.deviceId, name:event.target.value}).done(function(data){
        var modData = [];
        for (var i = 0; i < data.length; i++) {
          modData.push(data[i][event.target.value])
        }
        var ctx = document.getElementById('myChart').getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',
            // The data for our dataset
            data: {
                labels: modData,
                datasets: [{
                    label: "",
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: modData,
                }]
            },
            // Configuration options go here
            options: {}
        });
      })
    }
  }

  /**
   * Button to stop drag and drop from working
   * @return {[type]} [description]
   */
  self.stopDragNDropLogic = function () {
    self.showUnlocked(false)
    self.showLocked(true)
    $('.draggable').off("mousedown")
    $('.draggable').remove()
    self.blueprintdash()
  }

  /**
  * Display blueprint and drag n drop devices onto blueprint
  * @return {[type]} [description]
  */
  self.enterPage = function () {
    // request to get user's blueprint from DB
    $.get(base_url + '/api/blueprint/get').done(function(data){
      for (var i = 0, d; d = data[i]; i++) {
        self.blueprintData.push({ id:d.id, name:d.name, path:d.path.replace('public/', '')})
      }
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
