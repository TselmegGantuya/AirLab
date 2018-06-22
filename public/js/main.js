function Model (){
    var self = this;
    self.loginInfo = ko.observableArray([
        {name:"email"},
        {name:"password"}
    ]);
    self.registerInfo = ko.observableArray([
        {name:"email"},
        {name:"name"},
        {name:"password"},
        {name:"password"}
    ]);
    self.forgetInfo = ko.observableArray([{name:"email"}]);
    self.currentPageData = ko.observableArray();
    self.currentPage = ko.observable();
    self.pages = ko.observableArray();
    //login function
    self.login = function(data) {
        //send data to database for login
    }

    self.choosePage = function(data){
        data = data.toLowerCase();
        self.currentPage(data);
        console.log(self.currentPage());
        if(data == "login"){
            self.currentPageData(self.loginInfo());
            self.pages([{name: 'Register'}, {name: 'Forget password'}]);
        }else if (data == "register"){
            self.currentPageData(self.registerInfo());
            self.pages([{name: 'Login'}, {name: 'Forget password'}]);
        }else{
            self.currentPageData(self.forgetInfo());
            self.pages([{name: 'Register'}, {name: 'Login'}]);
        }
        console.log(self.currentPageData());
    }
    self.choosePage('login');
}

ko.applyBindings(new Model());
