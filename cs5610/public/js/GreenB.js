app.controller("GreenBCtrl", function ($scope, $sce, UserService, $http, $routeParams) {
    $scope.validsearch = false;
    console.log("In controller");

    var FromID;
    var FromLat;
    var FromLong;
    var ToID;
    var ToLat;
    var ToLong;
    var FromRoutes = [];
    var ToRoutes = [];
    var CommonRoutes = [];

    $scope.trustSrc = function (src) {
        return $sce.trustAsResourceUrl(src);
    }


    var GreenBTrips = [];
    $scope.FavGreenBTrips = [];

    $http.get("/getuser").success(function (response) {
        console.log(" in get user : " + response);
        $scope.ActiveUser = response;

        console.log(" Active User explained ========= %j", $scope.ActiveUser);

        FavTrips();

    });


















    FavTrips = function () {

        GreenBTrips = [];

        for (var k = 0; k < $scope.ActiveUser.Trips.length; k++) {
            if ($scope.ActiveUser.Trips[k].Line == "GreenB")
                GreenBTrips.push($scope.ActiveUser.Trips[k]);
        }

        angular.forEach(GreenBTrips, function (eachTrip) {
            $http.get("http://realtime.mbta.com/developer/api/v2/schedulebyroute?api_key=TbUOod1u00WYU5oe6x7h1g&route=green-b&format=json").success(function (response) {

                var direction_id = 0;
                var stops = response.direction[0].trip[0].stop;
                for (var i = 0; i < stops.length; i++) {
                    var stop_name1 = stops[i].stop_name;
                    if (stop_name1.indexOf(eachTrip.Start) >= 0) {
                        break;
                    }
                    if (stop_name1.indexOf(eachTrip.Stop) >= 0) {
                        direction_id = 1;
                        break;
                    }
                }

                var triplen = response.direction[direction_id].trip.length;
                var greenbstops = response.direction[direction_id].trip[2].stop;
                for (var i = 0; i < greenbstops.length; i++) {
                    var stop_name = greenbstops[i].stop_name;

                    if (stop_name.indexOf(eachTrip.Start) >= 0) {
                        var FromDate = new Date(greenbstops[i].sch_arr_dt * 1000);
                    }
                    if (stop_name.indexOf(eachTrip.Stop) >= 0) {
                        var ToDate = new Date(greenbstops[i].sch_arr_dt * 1000);
                    }
                }

                var Fminutes = FromDate.getMinutes();
                var Fhours = FromDate.getHours();
                var Tminutes = ToDate.getMinutes();
                var Thours = ToDate.getHours();

                if (FromDate.getMinutes() < 10) {
                    Fminutes = "0" + FromDate.getMinutes();
                }
                if (FromDate.getHours() < 10) {
                    Fhours = "0" + FromDate.getHours();
                }

                if (ToDate.getMinutes() < 10) {
                    Tminutes = "0" + ToDate.getMinutes();
                }
                if (ToDate.getHours() < 10) {
                    Thours = "0" + ToDate.getHours();
                }

                var FromStationjs = eachTrip.Start;
                var ToStationjs = eachTrip.Stop;
                var FromTime = Fhours + " : " + Fminutes;
                var ToTime = Thours + " : " + Tminutes;

                $scope.FavGreenBTrips.push("Next Train from " + FromStationjs + " is at " + FromTime + " and will reach " + ToStationjs + " at " + ToTime);
            });
        });
    }




    AddFavTrips = function (OneTrip) {
        eachTrip = OneTrip;
        $http.get("http://realtime.mbta.com/developer/api/v2/schedulebyroute?api_key=TbUOod1u00WYU5oe6x7h1g&route=green-b&format=json").success(function (response) {
            var direction_id = 0;
            var stops = response.direction[0].trip[0].stop;
            for (var i = 0; i < stops.length; i++) {
                var stop_name1 = stops[i].stop_name;
                if (stop_name1.indexOf(eachTrip.Start) >= 0) {
                    break;
                }
                if (stop_name1.indexOf(eachTrip.Stop) >= 0) {
                    direction_id = 1;
                    break;
                }
            }

            var triplen = response.direction[direction_id].trip.length;
            var greenbstops = response.direction[direction_id].trip[2].stop;
            for (var i = 0; i < greenbstops.length; i++) {
                var stop_name = greenbstops[i].stop_name;

                if (stop_name.indexOf(eachTrip.Start) >= 0) {
                    var FromDate = new Date(greenbstops[i].sch_arr_dt * 1000);
                }
                if (stop_name.indexOf(eachTrip.Stop) >= 0) {
                    var ToDate = new Date(greenbstops[i].sch_arr_dt * 1000);
                }
            }

            var Fminutes = FromDate.getMinutes();
            var Fhours = FromDate.getHours();
            var Tminutes = ToDate.getMinutes();
            var Thours = ToDate.getHours();

            if (FromDate.getMinutes() < 10) {
                Fminutes = "0" + FromDate.getMinutes();
            }
            if (FromDate.getHours() < 10) {
                Fhours = "0" + FromDate.getHours();
            }

            if (ToDate.getMinutes() < 10) {
                Tminutes = "0" + ToDate.getMinutes();
            }
            if (ToDate.getHours() < 10) {
                Thours = "0" + ToDate.getHours();
            }

            var FromStationjs = eachTrip.Start;
            var ToStationjs = eachTrip.Stop;
            var FromTime = Fhours + " : " + Fminutes;
            var ToTime = Thours + " : " + Tminutes;

            $scope.FavGreenBTrips.push("Next Train from " + FromStationjs + " is at " + FromTime + " and will reach " + ToStationjs + " at " + ToTime);
        });
    }




    $scope.AddTrip = function () {
        console.log("ActiveUser in Addtrip" + $scope.ActiveUser);
        var newtrip = { Start: $scope.FromStation, Stop: $scope.ToStation, Line: "GreenB" };
        $http.post("/addtrip/" + $scope.ActiveUser.Username, newtrip).success(function (response) {
            $scope.ActiveUser = response;
            AddFavTrips(newtrip);
        });
    }
















    $scope.searchfn = function () {
        console.log($scope.FromStation);
        console.log($scope.ToStation);
        var FromStation = $scope.FromStation;
        var ToStation = $scope.ToStation;

        $http.get("/greenbstations/" + FromStation).success(function (response) {
            console.log(response);
            FromID = response.StopID;
            console.log("From ID in function : " + FromID);
            FromLat = response.StopLatitude;
            FromLong = response.StopLongitude;

            $http.get("/greenbstations/" + ToStation).success(function (response) {
                console.log(response);
                ToID = response.StopID;
                console.log("To ID in function : " + ToID);
                ToLat = response.StopLatitude;
                ToLong = response.StopLongitude;

                var AngOrigin = "(" + FromLat + "," + FromLong + ")";
                var AngDest = "(" + ToLat + "," + ToLong + ")";

                var MapsURLvar = "https://www.google.com/maps/embed/v1/directions?key=AIzaSyCLlRVW7YJr9bzdSoQkpqy4IwA5FV7gte4&origin=" + FromStation + "+Station+Boston+MA&destination=" + ToStation + "+Station+Boston+MA&mode=transit";
                $scope.MapsURL = MapsURLvar;
                console.log("*****************************************");
                console.log(MapsURLvar);
                console.log("*****************************************");


                $http.get("http://realtime.mbta.com/developer/api/v2/schedulebyroute?api_key=TbUOod1u00WYU5oe6x7h1g&route=green-b&format=json")
                .success(function (response) {
                    var direction_id = 0;
                    var stops = response.direction[0].trip[0].stop;
                    for (var i = 0; i < stops.length; i++) {
                        var stop_name1 = stops[i].stop_name;
                        if (stop_name1.indexOf(FromStation) >= 0) {
                            break;
                        }
                        if (stop_name1.indexOf(ToStation) >= 0) {
                            direction_id = 1;
                            break;
                        }
                    }

                    var triplen = response.direction[direction_id].trip.length;
                    var greenbstops = response.direction[direction_id].trip[2].stop;
                    for (var i = 0; i < greenbstops.length; i++) {
                        var stop_name = greenbstops[i].stop_name;

                        if (stop_name.indexOf(FromStation) >= 0) {
                            var FromDate = new Date(greenbstops[i].sch_arr_dt * 1000);
                            console.log("From Arrival Date: " + FromDate.toLocaleString());
                            console.log("From Arrival hours : " + FromDate.getHours());
                            console.log("From Arrival minutes : " + FromDate.getMinutes());
                        }
                        if (stop_name.indexOf(ToStation) >= 0) {
                            var ToDate = new Date(greenbstops[i].sch_arr_dt * 1000);
                            console.log("To Arrival Date: " + ToDate.toLocaleString());
                            console.log("To Arrival hours: " + ToDate.getHours());
                            console.log("To Arrival minutes : " + ToDate.getMinutes());
                            console.log("To Arrival Time : " + ToDate.getTime());
                        }
                    }

                    var Fminutes = FromDate.getMinutes();
                    var Fhours = FromDate.getHours();
                    var Tminutes = ToDate.getMinutes();
                    var Thours = ToDate.getHours();

                    if (FromDate.getMinutes() < 10) {
                        Fminutes = "0" + FromDate.getMinutes();
                    }
                    if (FromDate.getHours() < 10) {
                        Fhours = "0" + FromDate.getHours();
                    }

                    if (ToDate.getMinutes() < 10) {
                        Tminutes = "0" + ToDate.getMinutes();
                    }
                    if (ToDate.getHours() < 10) {
                        Thours = "0" + ToDate.getHours();
                    }

                    $scope.FromStationjs = FromStation;
                    $scope.ToStationjs = ToStation;

                    $scope.FromTime = Fhours + " : " + Fminutes;
                    $scope.ToTime = Thours + " : " + Tminutes;

                    console.log("From Time : " + FromDate.getHours() + " Hours, " + FromDate.getMinutes() + " Minutes");
                    console.log("Destination Time : " + ToDate.getHours() + " Hours, " + ToDate.getMinutes() + " Minutes");
                    if (FromDate.getHours() == ToDate.getHours()) {
                        $scope.TimeDiff = " " + (ToDate.getMinutes() - FromDate.getMinutes()) + " Minutes";
                    }
                    else if (FromDate.getMinutes() > ToDate.getMinutes()) {
                        var timediff = 60 - FromDate.getMinutes() + ToDate.getMinutes();
                        $scope.TimeDiff = " " + timediff + " Minutes";
                    }
                    else {
                        $scope.TimeDiff = " " + (ToDate.getHours() - FromDate.getHours()) + " Hours, " + (ToDate.getMinutes() - FromDate.getMinutes()) + " Minutes";
                    }
                    console.log("Time Difference : " + $scope.TimeDiff);
                    $scope.validsearch = true;
                });
            });
        });
    }
})
