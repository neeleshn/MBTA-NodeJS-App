app.controller("ProfileCtrl", function ($scope, $sce, UserService, $http, $routeParams) {
    var ActiveUser;
    $scope.flag = 0;
    $http.get("http://realtime.mbta.com/developer/api/v2/alertheaders?api_key=wX9NwuHnZU2ToO7GmGR9uw&format=json")
            .success(function (response) {
                var alertsjs = [];
                for (var i = 0; i < 5; i++) {
                    alertsjs.push(response.alert_headers[i]);
                }
                $scope.alerts = alertsjs;
            });

    $http.get("/getuser").success(function (response) {
        console.log("get user Response : " + response);
        ActiveUser = response;
        $scope.ActiveUser = ActiveUser;
        console.log("Active user in profile get user : " + $scope.ActiveUser);
    });

    $http.get("/useralerts").success(function (response) {
        console.log("Response : " + response);
        var useralertsjs = [];
        var n = 5;
        if (response.length < 5) {
            n = response.length;
        }

        for (var i = 0; i < n; i++) {
            useralertsjs.push(response[i]);
        }
        $scope.useralerts = useralertsjs;
    });

    $scope.PostAlert = function () {
        var alertjs1;
        console.log("Active User in post alert : " + ActiveUser);
        console.log("Active User Name in post alert : " + ActiveUser.Name);
        alertjs1 = { Name: ActiveUser.Name, Alert: $scope.alertModel };
        $http.post("/postalert/", alertjs1).success(function (response) {
            console.log("Post Alert Response" + response);
            $scope.alertModel = "";
            $scope.flag = 1;
        });
    }
})

