app.controller("RegisterCtrl", function ($scope, UserService, $http, $routeParams) {
    console.log(" ####################### in register function");
    $scope.flag = 0;
    $scope.usercheck = function () {
        var usernamejs = $scope.usermodel;
        $http.get("/users/" + usernamejs).success(function (response) {
            if (response)
                $scope.usernameerr = "Username Already Exists!!!";
            else $scope.usernameerr = null;
        });
    }

    $scope.signup = function () {
        console.log("in sign up fn");
        var userjs = { username: $scope.usermodel, name: $scope.namemodel, pass: $scope.passmodel };
        $http.post("/adduser/", userjs).success(function (response) {
            $scope.ActiveUser = userjs;
            console.log("in add user function : " + $scope.ActiveUser);
            $scope.flag = 1;
            $scope.usermodel = "";
            $scope.namemodel = "";
            $scope.passmodel = "";
        });
    }
})
