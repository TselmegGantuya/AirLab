/**
*   Knockoutjs
*/
var dashModel = function (){
  var self = this
  self.currentTemplate = ko.observable('blueprintPage')
  self.nav = ko.observable(true)
  self.setColorDevices = ko.observable(false)
  self.setBlueprint = ko.observable(true)
  self.token = ko.observable()
  self.blueprintData = ko.observableArray() 
  self.blueprintDev = ko.observableArray() 
  self.devices = ko.observableArray()
  self.dev_id = ko.observable() 
  self.button = ko.observable() 
  self.currentBlueprint = ko.observable()
  self.user = ko.observableArray()
  self.allColorDevices = ko.observableArray()
  self.lastRecord = ko.observableArray()
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
    let path = self.currentBlueprint()['path']
    // console.log(self.currentBlueprint())
    let img = new Image()
    img.src = base_url + '/storage/' + path
    img.addEventListener("load", function() {
      context.drawImage(img,
      canvas.width / 2 - img.width / 2,
      canvas.height / 2 - img.height / 2
      )
    })
  }

  /**
   * Delete blueprint
   * @return {[type]} [description]
   */
  self.deleteBP = function(){
    $.post(base_url + '/api/blueprint/delete',{id:self.currentBlueprint().id})
  }



  /* START CODE LARS */
  self.getColorDevices = function(){
    self.setColorDevices(true);
    self.setBlueprint(false);
  }

  self.getBlueprint = function(){
    self.setBlueprint(true);
    self.setColorDevices(false);
  }

  self.colorDevices = function(){
    $.post(base_url + '/api/me', {token: self.token()})
      .done(function(data){
        self.user(data)
        //get devices with organization
        $.post(base_url + '/api/uhoo/getDevicesWithData' ,{token: self.token(),id:self.user().organization_id})
              .done(function(data){
              self.allColorDevices(data)
              console.log(data);
          })
      })
  }
  self.colorDevices()
  /**
   * Change blueprint name
   * @return {[type]} [description]
   */
  self.changeNameBTN = function(){
    let id =  self.currentBlueprint()['id']
    let oldie = self.currentBlueprint()
    self.currentBlueprint().name = $('#changeName').val()

    $.post(base_url + "/api/blueprint/changeName",{name:$('#changeName').val(),id:id}).done(function(){
      self.blueprintData.replace(oldie,self.currentBlueprint())
      console.log(self.blueprintData())
    })
  }

  /**
  *
  *   Upload image
  */
  self.fileSelect = function (element,event) {
    var files =  event.target.files// FileList object
    // Loop through the FileList and render image files as thumbnails.
    var canvas = document.getElementById('background')
  	var context = canvas.getContext('2d')
    for (var i = 0, f; f = files[i]; i++) {
      // Only process image files.
      if (!f.type.match('image.*')) {
        continue
      }
      var reader = new FileReader()

      // Closure to capture the file information.
      reader.onload = (function() {
        return function(event){
          var img = new Image()
          img.addEventListener("load", function() {
            context.drawImage(img,
              canvas.width / 2 - img.width / 2,
              canvas.height / 2 - img.height / 2
              )
          })
          img.src = event.target.result
        }
      })(f)
      var formData = new FormData()

      // HTML file input, chosen by user
      formData.append("blueprint", f)
      formData.append("token", self.token())

      var request = new XMLHttpRequest()
      request.open("POST", base_url + '/api/blueprint/upload')
      request.send(formData)
      // Read in the image file as a data URL.
      reader.readAsDataURL(f)
    }
  }

	/**
	 * Get devices from DB that has no blueprint data
	 * @param  {[type]} data) {                   self.blueprintData(data)        console.log(self.blueprintData())    } [description]
	 * @return {[type]}       [description]
	 */
	self.getDevices = function () {
		$.get(base_url + '/api/blueprint/devices/get').done(function(data) {
			self.blueprintDev(data)
			// console.log(self.blueprintDev())
		});
	}
	self.getDevices()

	/**
	 * First get devices from DB then create element of devices with pixels and append to HTML
	 * @return {[type]} [description]
	 */
	self.blueprintdash = function () {
		// request to get devices where top_pixel and left_pixel are not equal to null
		$.get(base_url + '/api/blueprint/db/devices/get').done(function(data) {
			self.devices(data)
			data.forEach(function(element) {
				var btn = document.createElement("BUTTON");
				// var t = document.createTextNode(element.name);
				let toppixel = element.top_pixel - 79
				btn.setAttribute("data-toggle", "popover");
				btn.style.position = 'absolute';
				btn.className = "btn btn-info draggable btn-circle drag-drop";
				btn.id = element.id;
				self.dev_id(btn.id)
				btn.style.left = element.left_pixel +'px';
				btn.style.top = toppixel +'px';
				// btn.appendChild(t);
				document.getElementById("bp").appendChild(btn);
				// jquery popover method. Return device name when hovered over 
				$('[data-toggle="popover"]').popover({
				  placement: 'top',
				  animation: true,
					trigger: 'focus',
					title: "Device",
					content: function() {
						if (element.id == btn.id) {
							// dev = []
							// dev.push(element.name, element.id)
							return element.name
						}
					},
				})
			})
		})
	}
	self.dragNDropLogic = function () {
			$('.draggable').mousedown(function(event) {
				let dragElement = event.target.closest('.draggable');
				if (!dragElement) return;
				let coords, shiftX, shiftY;
				startDrag(event.clientX, event.clientY);
				dragElement.addEventListener('mousemove', onMouseMove);

				// on drag start:
				//   remember the initial shift
				//   move the element position:fixed and a direct child of body
				function startDrag(clientX, clientY) {
					shiftX = clientX - dragElement.getBoundingClientRect().left;
					shiftY = clientY - dragElement.getBoundingClientRect().top;
					
					// dragElement.className = "btn btn-info draggable btn-dev";
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
					dragElement.removeEventListener('mousemove', onMouseMove);
					dragElement.onmouseup = null;
					$.post(base_url + '/api/blueprint/coordinations/get', {blueprintData: [{left: dragElement.style.left, top: dragElement.style.top, id: self.currentBlueprint().id, device_id: dragElement.id}]}).done(function(data) {})
				}

				// method to what happens when device is not clicked
				dragElement.onmouseup = function(event) {
					event.preventDefault()
					finishDrag();
				}

				// When mouse is moving 
				function onMouseMove(event) {
					moveAt(event.clientX, event.clientY);
				}
				
				// get coordinates when mouse is moving
				function moveAt(clientX, clientY) {
					// new window-relative coordinates
					let newX = clientX - shiftX;
					let newY = clientY - shiftY;
					// check if the new coordinates are below the bottom window edge
					let newBottom = newY + dragElement.offsetHeight; // new bottom
					// below the window? let's scroll the page
					if (newBottom > document.documentElement.clientHeight) {
						// window-relative coordinate of document end
						let docBottom = document.documentElement.getBoundingClientRect().bottom;
						// scroll the document down by 10px has a problem
						// it can scroll beyond the end of the document
						// Math.min(how much left to the end, 10)
						let scrollY = Math.min(docBottom - newBottom, 10);
						// calculations are imprecise, there may be rounding errors that lead to scrolling up
						// that should be impossible, fix that here
						if (scrollY < 0) scrollY = 0;
						window.scrollBy(0, scrollY);
						// a swift mouse move make put the cursor beyond the document end
						// if that happens -
						// limit the new Y by the maximally possible (right at the bottom of the document)
						newY = Math.min(newY, document.documentElement.clientHeight - dragElement.offsetHeight);
					}
					// check if the new coordinates are above the top window edge (similar logic)
					if (newY < 0) {
						// scroll up
						let scrollY = Math.min(-newY, 10);
						if (scrollY < 0) scrollY = 0; // check precision errors
						window.scrollBy(0, -scrollY);
						// a swift mouse move can put the cursor beyond the document start
						newY = Math.max(newY, 0); // newY may not be below 0
					}
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
   * Display blueprint and drag n drop devices onto blueprint
   * @return {[type]} [description]
   */
  self.enterPage = function () {
    // request to get user's blueprint from DB
    $.get(base_url + '/api/blueprint/get').done(function(data){
      for (var i = 0, d; d = data[i]; i++) {
        self.blueprintData.push({ id:d.id, name:d.name, path:d.path.replace('public/', '')})
        // console.log(self.blueprintData())
      }
      self.blueprintdash()
      console.log('jiji')
    })
  }
  self.enterPage()
}