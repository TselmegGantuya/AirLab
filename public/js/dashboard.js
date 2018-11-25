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
  self.blueprintDevices = ko.observableArray()
  self.blueprintDevi = ko.observableArray()
  self.removeBpDevices = ko.observableArray() 
  self.userEmail = ko.observable()
  self.userOrganization = ko.observable()
  self.devices = ko.observableArray() 
  self.currentBlueprint = ko.observable()
  self.user = ko.observableArray()
  self.allColorDevices = ko.observableArray()

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
    // console.log(self.currentBlueprint())
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
  *   Switch image
  */
  self.fileSwitch = function (element,event) {
    var files =  event.target.files// FileList object
      var formData = new FormData()

      // HTML file input, chosen by user
      formData.append("id", self.currentBlueprint()['id'])
      formData.append("blueprint", files[0])
      formData.append("token", self.token())

      var request = new XMLHttpRequest()
      request.open("POST", base_url + '/api/blueprint/update')
      request.send(formData)
      
      self.blueprintData.removeAll()
      $.get(base_url + '/api/blueprint/get').done(function(data){
        for (var i = 0, d; d = data[i]; i++) {
          self.blueprintData.push({ id:d.id, name:d.name, path:d.path.replace('public/', '')})
        }
      })
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
				btn.className = "btn btn-info draggable btn-circle drag-drop";
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
          content: function() {
            if (element.id == btn.id) {
              return element.name
            }
          },
				})

				// Open modal to remove device from blueprint
			  $(btn).on('click', function() {
			    $('#removeDevice').modal('show')
			    self.devices(element)
          
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
    // let currentDroppable = null;
    // $('.draggable').mousedown(function(event) {
    //   $('[data-toggle="popover"]').popover('hide')
    //   var dragElement = event.target.closest('.draggable');
    //   if (!dragElement) return;
    //   event.preventDefault()
    //   let shiftX = event.clientX - dragElement.getBoundingClientRect().left;
    //   let shiftY = event.clientY - dragElement.getBoundingClientRect().top;
      
    //   // dragElement.className = "btn btn-info draggable btn-dev";
    //   dragElement.style.position = 'absolute';
    //   dragElement.style.zIndex = 1000;
    //   document.body.append(dragElement);
    //   moveAt(event.pageX, event.pageY);

    //   function moveAt(pageX, pageY) {
    //     dragElement.style.left = pageX - shiftX + 'px';
    //     dragElement.style.top = pageY - shiftY + 'px';
    //     console.log(dragElement)
    //   }

    //   function onMouseMove(event) {
    //     moveAt(event.pageX, event.pageY);

    //     // dragElement.hidden = true;
    //     // let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
    //     // dragElement.hidden = false;
    //     // if (!elemBelow) return;

    //     // let droppableBelow = elemBelow.closest('.droppable');
    //     // if (currentDroppable != droppableBelow) {
    //     //   if (currentDroppable) { // null when we were not over a droppable before this event
    //     //     console.log('stop')
    //     //   }
    //     //   currentDroppable = droppableBelow;
    //     //   if (currentDroppable) { // null if we're not coming over a droppable now
    //     //     // (maybe just left the droppable)
    //     //     console.log('continue')
    //     //   }
    //     // }
    //   }

    //   dragElement.addEventListener('mousemove', onMouseMove);

    //   dragElement.onmouseup = function() {
    //     // dragElement.style.top = parseInt(dragElement.style.top) + pageYOffset + 'px';
    //     // dragElement.style.left = parseInt(dragElement.style.left) + pageXOffset + 'px';
    //     dragElement.style.position = 'absolute';
    //     dragElement.className = "btn btn-info draggable btn-circle drag-drop";
    //     dragElement.removeEventListener('mousemove', onMouseMove);
    //     dragElement.onmouseup = null;
    //     return false
    //     // $.post(base_url + '/api/blueprint/coordinations/get', {blueprintData: [{left: dragElement.style.left, top: dragElement.style.top, id: self.currentBlueprint().id, device_id: dragElement.id}]})
    //   };
    // })


    var box = $('.draggable')
    var drag = {
      elem: $('.draggable'),
      x: 0,
      y: 0,
      state: false
    }
    var delta = {
      x: 0,
      y: 0
    }

    box.mousedown(function(e) {
      $('[data-toggle="popover"]').popover('hide')
      if (!drag.state) {
        drag.elem = this;
        drag.x = e.pageX;
        drag.y = e.pageY;
        drag.state = true;
      }
      return false;
    })

    $(document).mousemove(function(e) {
      if (drag.state) {
        console.log(drag.elem.style)
        delta.x = e.pageX - drag.x;
        delta.y = e.pageY - drag.y;

        console.log(e.pageX + ' ' + e.pageY)
        var cur_offset = $(drag.elem).offset()

        $(drag.elem).offset({
            left: (cur_offset.left + delta.x),
            top: (cur_offset.top + delta.y)
        });

        drag.x = e.pageX;
        drag.y = e.pageY;
      }
    })

    $(document).mouseup(function() {
      if (drag.state) {

        // drag.elem.style.top = parseInt(drag.y) + 'px';
        // drag.elem.style.left = parseInt(drag.x) + 'px';
        // drag.elem.style.position = 'absolute';
        // dragElement.className = "btn btn-info draggable btn-circle drag-drop";
        // dragElement.removeEventListener('mousemove', onMouseMove);
        // dragElement.onmouseup = null;
        // return false
        // $.post(base_url + '/api/blueprint/coordinations/get', {blueprintData: [{left: dragElement.style.left, top: dragElement.style.top, id: self.currentBlueprint().id, device_id: dragElement.id}]})
        drag.state = false;
      }
    })

  }


  
  /**
   * Button to stop drag and drop from working
   * @return {[type]} [description]
   */
  self.stopDragNDropLogic = function () {
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