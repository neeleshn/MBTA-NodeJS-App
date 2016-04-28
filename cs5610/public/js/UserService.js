app.factory("UserService", function ($http) {
    console.log("in factory");
    var ActiveUser;
    
    var validate = function (username, password, logins) {
        console.log("in userservice validate");
        for (var i = 0; i < logins.length; i++) {
            if (username == logins[i].Username && password == logins[i].Pass) {
                ActiveUser = logins[i];
                return ActiveUser;
            }
        }
        return null;
    }

    var logoutFn = function () {
        ActiveUser = null;
    }

    var getUser = function () {
            return ActiveUser;
    }

    return {
        validate: validate,
        logoutFn: logoutFn,
        getUser: getUser
    }
});