app.controller("MyCtrl", function ($scope, $http, UserService) {
    console.log("in My Contrl");
    var ActiveUser;
    $http.get("/getuser").success(function (response) {
        ActiveUser = response;
        $scope.ActiveUser = ActiveUser;
    });

    $scope.validate = function () {
        var username = $scope.loginUser;
        var password = $scope.loginPass;
        var logins;
        console.log("in index validate");
        $http.get("/users").success(function (response) {
            logins = response;
            console.log("logins : " + logins);
            ActiveUser = UserService.validate(username, password, logins);
            $scope.ActiveUser = ActiveUser;
            console.log($scope.ActiveUser);
            $http.post("/setuser/", ActiveUser).success(function (response) {
                console.log("active user response in validate : " + response.Username);
                $scope.ActiveUser = response;
                window.location = "/#/profile";
            });
        });
    }

    $scope.logoutFn = function () {
        $scope.loginPass = null;
        $scope.loginUser = null;
        UserService.logoutFn();
        $http.get("/nulluser").success(function (response) {
            $scope.ActiveUser = response;
            console.log("Active user in logout : " + $scope.ActiveUser);
        });
        window.location = "/";
    }    
});
