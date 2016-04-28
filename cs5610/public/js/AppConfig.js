var app = angular.module("MyApp", ["ngRoute"]);

app.config(['$routeProvider',
        function ($routeProvider) {
            console.log("in config");
            $routeProvider.
            when('/register', {
                templateUrl: '/register',
                controller: 'RegisterCtrl'
            }).
            when('/blue', {
                templateUrl: '/blue',
                controller: 'BlueCtrl'
            }).
            when('/greenb', {
                templateUrl: '/greenb',
                controller: 'GreenBCtrl'
            }).
            when('/greenc', {
                templateUrl: '/greenc',
                controller: 'GreenCCtrl'
            }).
            when('/greend', {
                templateUrl: '/greend',
                controller: 'GreenDCtrl'
            }).
            when('/greene', {
                templateUrl: '/greene',
                controller: 'GreenECtrl'
            }).
            when('/orange', {
                templateUrl: '/orange',
                controller: 'OrangeCtrl'
            }).
            when('/ashmont', {
                templateUrl: '/ashmont',
                controller: 'AshmontCtrl'
            }).
            when('/braintree', {
                templateUrl: '/braintree',
                controller: 'BraintreeCtrl'
            }).
            when('/profile', {
                templateUrl: '/profile',
                controller: 'ProfileCtrl'
            }).
            otherwise({
                redirectTo: '/register'
            });
        } ]);
