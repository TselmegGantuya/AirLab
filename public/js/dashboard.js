/**['records']
*   Knockoutjs
*/
var dashModel = function (){
  var self = this
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
   * Token
   */
  if (localStorage.getItem('token'))
  {
    self.token(localStorage.getItem('token'))
  }

  /**
   * Switching between models
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

  /**
   * Delete blueprint
   * @return {[type]} [description]
  */
  self.deleteBP = function(){
    $.post(base_url + '/api/blueprint/delete',{id:self.currentBlueprint().id})
    self.blueprintData.remove(self.currentBlueprint())
  }

  /**
   * Change blueprint name
   * @return {[type]} [description]
   */
  self.changeNameBTN = function(){
    let id =  self.currentBlueprint()['id']

    $.post(base_url + "/api/blueprint/changeName",{name:$('#changeName').val(),id:id}).done(function(){
      self.blueprintData.removeAll()
    $.get(base_url + '/api/blueprint/get').done(function(data){
        for (var i = 0, d; d = data[i]; i++) {
          self.blueprintData.push({ id:d.id, name:d.name, path:d.path.replace('public/', '')})
        }
      })
    })
  }

  /**
  *
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
      request.open("POST", base_url + '/api/blueprint/update')
      request.onreadystatechange = function () {
        if(request.readyState === 4 && request.status === 200) {
          console.log(request.responseText)
          resolve()
        }
      };
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
      img.onload = async function()
      {
        var size = img.width / img.height
      if(self.currentBlueprintSize() != size){
        swal("Whoeps!", "The image size must be " + self.currentBlueprintWidth()  + " x " + self.currentBlueprintHeight() + " !", "warning");
        return;
      }
      let result = await resolvePost(files[0])

        self.blueprintData.removeAll()

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
	self.blueprintdash = function () {
		// request to get devices where top_pixel and left_pixel are not equal to null
		$.get(base_url + '/api/blueprint/db/devices/get').done(function(data) {
			data.forEach(function(element) {
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

        self.blueprintDevi.push(btn)

				// jquery popover method. Return device name when hovered over 
				$('[data-toggle="popover"]').popover({
          placement: 'top',
          animation: true,
          trigger: 'hover',
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
              setTimeout(function(){
                self.records(data)
                console.log(data);
              }, 10)
            })
          // Method to remove device from blueprint and refresh page
			    self.removeDevice = function(){
				    $.post(base_url + '/api/blueprint/device/remove', {id: self.devices().id}).done(function(data) {
							setTimeout(function(){
								location.reload();
							}, 10)
				    })
			    }
			  })
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
      //   remember the initial shift
      //   move the element position:fixed and a direct child of body
      function startDrag(clientX, clientY) {
        shiftX = clientX - dragElement.getBoundingClientRect().left;
        shiftY = clientY - dragElement.getBoundingClientRect().top;
        dragElement.className = "btn btn-info draggable btn-dev";
        dragElement.removeAttribute("data-bind")
        dragElement.style.position = 'fixed';
        document.body.append(dragElement);
        moveAt(clientX, clientY);
      }

      // switch to absolute coordinates at the end, to fix the element in the document
      function finishDrag() {
        dragElement.style.top = parseInt(dragElement.style.top) + pageYOffset + 'px';
        dragElement.style.left = parseInt(dragElement.style.left) + pageXOffset + 'px';
        dragElement.style.position = 'absolute';
        dragElement.className = "btn btn-info draggable btn-circle drag-drop";
        document.removeEventListener('mousemove', onMouseMove);
        dragElement.onmouseup = null;
        $.post(base_url + '/api/blueprint/coordinations/get', {blueprintData: [{left: dragElement.style.left, top: dragElement.style.top, id: self.currentBlueprint().id, device_id: dragElement.id}]}).done(function(data) {})
      }

      // method to what happens when device is not clicked
      dragElement.onmouseup = function(event) {
        event.preventDefault()
        finishDrag()

        // this function will return true after 1 second (see the async keyword in front of function)
        async function returnTrue() {
          
          // create a new promise inside of the async function
          let promise = new Promise((resolve, reject) => {
            setTimeout(() => resolve(dragElement.remove()), 500) // resolve
          });
          
          // wait for the promise to resolve
          let result = await promise;

          // console log the result (true)
          self.blueprintdash()
          // console.log(result);
        }

        // call the function
        returnTrue();
      }

      // When mouse is moving 
      function onMouseMove(event) {
        event.preventDefault()
        moveAt(event.clientX, event.clientY);
      }

      // get coordinates when mouse is moving
      function moveAt(clientX, clientY) {
        // new window-relative coordinates
        let newX = clientX - shiftX;
        let newY = clientY - shiftY;
        // check if the new coordinates are below the bottom window edge
        let newBottom = newY + dragElement.offsetHeight; // new bottom
        // // below the window? let's scroll the page
        // if (newBottom > document.documentElement.clientHeight) {
        //   // window-relative coordinate of document end
        //   let docBottom = document.documentElement.getBoundingClientRect().bottom;
        //   // scroll the document down by 10px has a problem
        //   // it can scroll beyond the end of the document
        //   // Math.min(how much left to the end, 10)
        //   let scrollY = Math.min(docBottom - newBottom, 10);
        //   // calculations are imprecise, there may be rounding errors that lead to scrolling up
        //   // that should be impossible, fix that here
        //   if (scrollY < 0) scrollY = 0;
        //   window.scrollBy(0, scrollY);
        //   // a swift mouse move make put the cursor beyond the document end
        //   // if that happens -
        //   // limit the new Y by the maximally possible (right at the bottom of the document)
        //   newY = Math.min(newY, document.documentElement.clientHeight - dragElement.offsetHeight);
        // }
        // check if the new coordinates are above the top window edge (similar logic)
        // if (newY < 0) {
        //   // scroll up
        //   let scrollY = Math.min(-newY, 10);
        //   if (scrollY < 0) scrollY = 0; // check precision errors
        //   window.scrollBy(0, -scrollY);
        //   // a swift mouse move can put the cursor beyond the document start
        //   newY = Math.max(newY, 0); // newY may not be below 0
        // }
        
        // limit the new X within the window boundaries
        // there's no scroll here so it's simple
        if (newX < 0) newX = 0;
        if (newX > document.documentElement.clientWidth - dragElement.offsetWidth) {
          newX = document.documentElement.clientWidth - dragElement.offsetWidth;
        }

        dragElement.style.left = newX + 'px';
        dragElement.style.top = newY + 'px';
      }
    })
  }

  /**
   * Button to stop drag and drop from working
   * @return {[type]} [description]
   */
  self.stopDragNDropLogic = function () {
    self.showUnlocked(false);
    self.showLocked(true);
  	$('.draggable').off("mousedown")
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