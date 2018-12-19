/**
*
*   Knockoutjs
*/
var adminModel = function (){
	var self = this

	/**
	* Token
	*/
	if (localStorage.getItem('token')){
		self.token(localStorage.getItem('token'))
	}

  self.user = ko.observable()
  self.adminPageVis = ko.observable(true)
}