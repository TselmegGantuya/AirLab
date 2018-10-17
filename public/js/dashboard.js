/**
*
*   Knockoutjs
*/

var dashModel = function (){
  var self = this
  self.currentTemplate = ko.observable('blueprintPage')
  self.nav = ko.observable(true)
  self.token = ko.observable()
  self.blueprintData = ko.observableArray() 
  self.currentBlueprint = ko.observable({ id:'1', name:'file', path:'/AjZx9PYst2lIXcg7ASdBwYTBBm2ZIH17yz9UE7el.jpeg'})
  if (localStorage.getItem('token'))
  {
    self.token(localStorage.getItem('token'))
  }
  self.loadModel = function(data) {
    switch(data) {
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
  *
  *   Devices placement
  */
  $('#background').click(function(event)
  {
    let xy = getMousePos(canvas,event)
    console.log(getMousePos(canvas,event))
    //post coordination
    context.fillStyle = "#FF0000"
    context.fillRect(xy['x'],xy['y'],8,8)

  })
  
  function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
  }
  
  self.selectFunc  = function(){
    let canvas = document.getElementById("currentBP")
    let context = canvas.getContext("2d")
    context.clearRect(0, 0, canvas.width, canvas.height)
    let path = self.currentBlueprint()['path']
    console.log(self.currentBlueprint())
    let img = new Image()
    img.src = base_url + '/storage/' + path
    img.addEventListener("load", function() {
      context.drawImage(img, 
      canvas.width / 2 - img.width / 2,
      canvas.height / 2 - img.height / 2
      )
    })
  }



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
  self.enterPage = function () {
    $.get(base_url + '/api/blueprint/get').done(function(data){
      for (var i = 0, d; d = data[i]; i++) {
        self.blueprintData.push({ id:d.id, name:d.name, path:d.path.replace('public/', '')})
      } 
      self.currentBlueprint(self.blueprintData()[0])
    })
  }
  self.enterPage()
}