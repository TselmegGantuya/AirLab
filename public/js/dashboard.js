/**
*
*   Knockoutjs
*/
var dashModel = function (){
  var self = this
  self.currentTemplate = ko.observable('blueprintPage')
  self.nav = ko.observable(true)
  self.token = ko.observable()
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
        break;
      case 'dev':
        ko.cleanNode($("#main")[0])
        var newModel = new dashModel()
        ko.applyBindings(newModel)
        break;
      case 'out':
        ko.cleanNode($("#main")[0])
        var newModel = new dashModel()
        ko.applyBindings(newModel)
        break;
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
    context.fillStyle = "#FF0000";
    context.fillRect(xy['x'],xy['y'],8,8)
  })
  function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
  }
  /**
  *
  *   Upload image
  */
  self.fileSelect= function (element,event) {
    var files =  event.target.files;// FileList object
    // Loop through the FileList and render image files as thumbnails.
    var canvas = document.getElementById('background')
  	var context = canvas.getContext('2d')
    for (var i = 0, f; f = files[i]; i++) {

      // Only process image files.
      if (!f.type.match('image.*')) {
        continue;
      }
      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function() {
        return function(event){
          var img = new Image();
          img.addEventListener("load", function() {
            context.drawImage(img,
              canvas.width / 2 - img.width / 2,
              canvas.height / 2 - img.height / 2
              );
          });
          img.src = event.target.result;
        }
      })(f);
      var formData = new FormData();

      // HTML file input, chosen by user
      formData.append("blueprint", f);
      formData.append("token", self.token());

      var request = new XMLHttpRequest();
      request.open("POST", base_url + '/api/blueprint/upload');
      request.send(formData);
      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    }
  }
}
