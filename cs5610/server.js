var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());

var mongoose = require('mongoose');
mongoose.connect(process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/test' || 'mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/');

var form1;
var ActiveUser=null;

var BlueSchema = new mongoose.Schema({ StopID: String, StopName: String, StopLatitude: String, StopLongitude: String }, { collection: "BlueModel" });
var BlueModel = mongoose.model("BlueModel", BlueSchema);


var OrangeSchema = new mongoose.Schema({ StopID: String, StopName: String, StopLatitude: String, StopLongitude: String }, { collection: "OrangeModel" });
var OrangeModel = mongoose.model("OrangeModel", OrangeSchema);


var AshmontSchema = new mongoose.Schema({ StopID: String, StopName: String, StopLatitude: String, StopLongitude: String }, { collection: "AshmontModel" });
var AshmontModel = mongoose.model("AshmontModel", AshmontSchema);


var BraintreeSchema = new mongoose.Schema({ StopID: String, StopName: String, StopLatitude: String, StopLongitude: String }, { collection: "BraintreeModel" });
var BraintreeModel = mongoose.model("BraintreeModel", BraintreeSchema);


var GreenBSchema = new mongoose.Schema({ StopID: String, StopName: String }, { collection: "GreenBModel" });
var GreenBModel = mongoose.model("GreenBModel", GreenBSchema);


var GreenCSchema = new mongoose.Schema({ StopID: String, StopName: String }, { collection: "GreenCModel" });
var GreenCModel = mongoose.model("GreenCModel", GreenCSchema);


var GreenDSchema = new mongoose.Schema({ StopID: String, StopName: String }, { collection: "GreenDModel" });
var GreenDModel = mongoose.model("GreenDModel", GreenDSchema);


var GreenESchema = new mongoose.Schema({ StopID: String, StopName: String }, { collection: "GreenEModel" });
var GreenEModel = mongoose.model("GreenEModel", GreenESchema);

var TripSchema = new mongoose.Schema({ Start: String, Stop: String, Line: String }, { collection: "TripModel" });
var TripModel = mongoose.model("TripModel", TripSchema);

var UserSchema = new mongoose.Schema({ Username: String, Name: String, Pass: String, Trips: [TripModel] }, { collection: "UserModel" });
var UserModel = mongoose.model("UserModel", UserSchema);

var AlertSchema = new mongoose.Schema({ Name: String, Alert: String }, { collection: "AlertModel" });
var AlertModel = mongoose.model("AlertModel", AlertSchema);




app.get('/', function (req, res) {
    res.sendfile('public/index.html');
});


app.get('/register', function (req, res) {
    res.sendfile('public/register.html');
});


app.post('/adduser/', function (req, res) {
    ActiveUser = req.body;
    console.log("Active user in add user : " + req.body);
    console.log("Active name in add user : " + req.body.name);
    form1 = new UserModel({ Username: req.body.username, Name: req.body.name, Pass: req.body.pass, Trips: [] });
    form1.save(function (err, user) {
        if (err)
            console.log("---------------there is an error----------");
        else {
            res.send(ActiveUser);
        }
    });
});


app.get('/users/:name', function (req, res) {
    UserModel.find({ Username: req.params.name }, function (err, response) {
        res.send(response[0]);
    });
});


app.get('/users', function (req, res) {
    UserModel.find(function (err, response) {
        res.send(response);
    });
});


app.get('/useralerts', function (req, res) {
    AlertModel.find(function (err, response) {
        res.send(response);
    });
});


app.post('/postalert/', function (req, res) {
    form1 = new AlertModel({ Name: req.body.Name, Alert: req.body.Alert });
    form1.save(function (err, alert) {
        if (err)
            console.log("---------------there is a post alert error----------");
        else {
            res.send(alert);
        }
    });
});


app.get('/profile', function (req, res) {
    res.sendfile('public/profile.html');
});


app.post('/setuser/', function (req, res) {
    console.log("set user : " + req.body);
    ActiveUser = req.body;
    console.log("Active User in set user : " + ActiveUser);
    res.send(ActiveUser);
});


app.get('/nulluser', function (req, res) {
    ActiveUser = null;
    res.send(ActiveUser);
});


app.get('/getuser', function (req, res) {
    res.send(ActiveUser);
});



app.post('/addtrip/:name', function (req, res) {
    console.log("in post addtrip");
/*    console.log("Active name in add user : " + req.params.name);
    console.log("Active user in add trip : " + req.body);
    console.log("all trips in add trip : " + req.body.Trips);
    console.log("first trip in add trip : " + req.body.Trips[0].Line); */
    form1 = new TripModel({ Start: req.body.Start, Stop: req.body.Stop, Line: req.body.Line });
    form1.save(function (err) {
        if (err)
            console.log(err);
        else console.log("Saved into DB");
    });
    UserModel.update({ Username: req.params.name },
    { Username: ActiveUser.Username,
      Name: ActiveUser.Name,
      Pass: ActiveUser.Pass,
      Trips: ActiveUser.Trips.push(form1)
    },
    { upsert : true }, 
    function (err, response) {
        console.log("Response in Add Trip : %j", response);
        console.log("ActiveUser in Add Trip : %j", ActiveUser);
        res.send(ActiveUser);
    });
});


app.get('/users/:name', function (req, res) {
    UserModel.find({ Username: req.params.name }, function (err, response) {
        res.send(response[0]);
    });
});



/*
form1 = new BlueModel({StopID: "70038", StopName: "Bowdoin", StopLatitude: "42.3613662719727", StopLongitude: "-71.0620346069336"});
form1.save(function (err) {
if (err)
console.log("---------------there is an error----------");
else console.log("Saved into DB");
});

form1 = new BlueModel({StopID: "70039", StopName: "Government Center Station", StopLatitude: "42.3597068786621", StopLongitude: "-71.059211730957"});
form1.save(function (err) {
if (err)
console.log(err);
else console.log("Saved into DB");
});
form1 = new BlueModel({StopID: "70041", StopName: "State Street", StopLatitude: "42.3589782714844", StopLongitude: "-71.0575942993164"});
form1.save(function (err) {
if (err)
console.log(err);
else console.log("Saved into DB");
});

form1 = new BlueModel({StopID: "70043", StopName: "Aquarium", StopLatitude: "42.3597831726074", StopLongitude: "-71.0516510009766"});
form1.save(function (err) {
if (err)
console.log(err);
else console.log("Saved into DB");
});
form1 = new BlueModel({StopID: "70045", StopName: "Maverick", StopLatitude: "42.3691177368164", StopLongitude: "-71.0395278930664"});
form1.save(function (err) {
if (err)
console.log(err);
else console.log("Saved into DB");
});
form1 = new BlueModel({StopID: "70047", StopName: "Airport", StopLatitude: "42.3742637634277", StopLongitude: "-71.0303955078125"});
form1.save(function (err) {
if (err)
console.log(err);
else console.log("Saved into DB");
});
form1 = new BlueModel({StopID: "70049", StopName: "Wood Island", StopLatitude: "42.379638671875", StopLongitude: "-71.0228652954102"});
form1.save(function (err) {
if (err)
console.log(err);
else console.log("Saved into DB");
});
form1 = new BlueModel({StopID: "70051", StopName: "Orient Heights", StopLatitude: "42.3868675231934", StopLongitude: "-71.0047378540039"});
form1.save(function (err) {
if (err)
console.log(err);
else console.log("Saved into DB");
});
form1 = new BlueModel({StopID: "70053", StopName: "Suffolk Downs", StopLatitude: "42.3904991149902", StopLongitude: "-70.9971237182617"});
form1.save(function (err) {
if (err)
console.log(err);
else console.log("Saved into DB");
});
form1 = new BlueModel({StopID: "70055", StopName: "Beachmont", StopLatitude: "42.3975410461426", StopLongitude: "-70.992317199707"});
form1.save(function (err) {
if (err)
console.log(err);
else console.log("Saved into DB");
});
form1 = new BlueModel({StopID: "70057", StopName: "Revere Beach", StopLatitude: "42.4078407287598", StopLongitude: "-70.9925308227539"});
form1.save(function (err) {
if (err)
console.log(err);
else console.log("Saved into DB");
});
form1 = new BlueModel({StopID: "70060", StopName: "Wonderland", StopLatitude: "42.4134216308594", StopLongitude: "-70.9916458129883"});
form1.save(function (err) {
if (err)
console.log(err);
else console.log("Saved into DB");
});


























form1 = new OrangeModel({ StopID: "70001", StopName: "Forest Hills", StopLatitude: "42.3005218505859", StopLongitude: "-71.1136856079102" });
form1.save(function (err) {
    if (err)
        console.log("---------------there is an error----------");
    else console.log("Saved into DB");
});

form1 = new OrangeModel({ StopID: "70002", StopName: "Green Street", StopLatitude: "42.3105239868164", StopLongitude: "-71.1074142456055" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new OrangeModel({ StopID: "70004", StopName: "Stony Brook", StopLatitude: "42.3170623779297", StopLongitude: "-71.104248046875" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});

form1 = new OrangeModel({ StopID: "70006", StopName: "Jackson Square", StopLatitude: "42.3231315612793", StopLongitude: "-71.0995941162109" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new OrangeModel({ StopID: "70008", StopName: "Roxbury Crossing", StopLatitude: "42.3313980102539", StopLongitude: "-71.0954513549805" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new OrangeModel({ StopID: "70010", StopName: "Ruggles", StopLatitude: "42.3363761901855", StopLongitude: "-71.0889587402344" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new OrangeModel({ StopID: "70012", StopName: "Massachusetts Ave", StopLatitude: "42.3415107727051", StopLongitude: "-71.0834197998047" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new OrangeModel({ StopID: "70014", StopName: "Back Bay", StopLatitude: "42.3473510742188", StopLongitude: "-71.0757293701172" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new OrangeModel({ StopID: "70016", StopName: "Tufts Medical Center", StopLatitude: "42.3496627807617", StopLongitude: "-71.0639190673828" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new OrangeModel({ StopID: "70018", StopName: "Chinatown", StopLatitude: "42.3525466918945", StopLongitude: "-71.0627517700195" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new OrangeModel({ StopID: "70020", StopName: "Downtown Crossing", StopLatitude: "42.3555183410645", StopLongitude: "-71.0602264404297" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new OrangeModel({ StopID: "70022", StopName: "State Street", StopLatitude: "42.3589782714844", StopLongitude: "-71.0575942993164" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new OrangeModel({ StopID: "70024", StopName: "Haymarket", StopLatitude: "42.3630218505859", StopLongitude: "-71.0582885742188" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new OrangeModel({ StopID: "70026", StopName: "North Station", StopLatitude: "42.3655776977539", StopLongitude: "-71.0612869262695" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new OrangeModel({ StopID: "70028", StopName: "Community College", StopLatitude: "42.3736228942871", StopLongitude: "-71.0695343017578" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new OrangeModel({ StopID: "70030", StopName: "Sullivan Square", StopLatitude: "42.383975982666", StopLongitude: "-71.0769958496094" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new OrangeModel({ StopID: "70032", StopName: "Wellington Station", StopLatitude: "42.4023704528809", StopLongitude: "-71.0770797729492" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new OrangeModel({ StopID: "70034", StopName: "Malden Center", StopLatitude: "42.4266319274902", StopLongitude: "-71.0741119384766" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new OrangeModel({ StopID: "70036", StopName: "Oak Grove", StopLatitude: "42.4366798400879", StopLongitude: "-71.0710983276367" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});























form1 = new AshmontModel({ StopID: "70061", StopName: "Alewife", StopLatitude: "42.3954277038574", StopLongitude: "-71.1424865722656" });
form1.save(function (err) {
    if (err)
        console.log("---------------there is an error----------");
    else console.log("Saved into DB - ashmont start");
});

form1 = new AshmontModel({ StopID: "70063", StopName: "Davis", StopLatitude: "42.3967399597168", StopLongitude: "-71.1218185424805" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new AshmontModel({ StopID: "70065", StopName: "Porter", StopLatitude: "42.3884010314941", StopLongitude: "-71.1191482543945" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new AshmontModel({ StopID: "70067", StopName: "Harvard", StopLatitude: "42.373363494873", StopLongitude: "-71.1189575195313" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new AshmontModel({ StopID: "70069", StopName: "Central", StopLatitude: "42.3654861450195", StopLongitude: "-71.1038055419922" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new AshmontModel({ StopID: "70071", StopName: "Kendall", StopLatitude: "42.362491607666", StopLongitude: "-71.0861740112305" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new AshmontModel({ StopID: "70073", StopName: "Charles", StopLatitude: "42.3611640930176", StopLongitude: "-71.0706253051758" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new AshmontModel({ StopID: "70075", StopName: "Park Street", StopLatitude: "42.3563957214355", StopLongitude: "-71.0624237060547" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new AshmontModel({ StopID: "70077", StopName: "Downtown Crossing", StopLatitude: "42.3555183410645", StopLongitude: "-71.0602264404297" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new AshmontModel({ StopID: "70079", StopName: "South Station", StopLatitude: "42.3522720336914", StopLongitude: "-71.0552444458008" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new AshmontModel({ StopID: "70081", StopName: "Broadway", StopLatitude: "42.3426208496094", StopLongitude: "-71.0569686889648" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new AshmontModel({ StopID: "70083", StopName: "Andrew", StopLatitude: "42.3301544189453", StopLongitude: "-71.0576553344727" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new AshmontModel({ StopID: "70087", StopName: "Savin Hill", StopLatitude: "42.3112907409668", StopLongitude: "-71.0533294677734" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new AshmontModel({ StopID: "70089", StopName: "Fields Corner", StopLatitude: "42.3000946044922", StopLongitude: "-71.0616683959961" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new AshmontModel({ StopID: "70091", StopName: "Shawmut", StopLatitude: "42.2931251525879", StopLongitude: "-71.0657348632813" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new AshmontModel({ StopID: "70093", StopName: "Ashmont", StopLatitude: "42.2846527099609", StopLongitude: "-71.0644912719727" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new AshmontModel({ StopID: "70095", StopName: "JFK", StopLatitude: "42.320686340332", StopLongitude: "-71.0523910522461" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB - ashmont end");
});


















form1 = new BraintreeModel({ StopID: "70061", StopName: "Alewife", StopLatitude: "42.3954277038574", StopLongitude: "-71.1424865722656" });
form1.save(function (err) {
    if (err)
        console.log("---------------there is an error----------");
    else console.log("Saved into DB - braintree start");
});

form1 = new BraintreeModel({ StopID: "70063", StopName: "Davis", StopLatitude: "42.3967399597168", StopLongitude: "-71.1218185424805" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new BraintreeModel({ StopID: "70065", StopName: "Porter", StopLatitude: "42.3884010314941", StopLongitude: "-71.1191482543945" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new BraintreeModel({ StopID: "70067", StopName: "Harvard", StopLatitude: "42.373363494873", StopLongitude: "-71.1189575195313" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new BraintreeModel({ StopID: "70069", StopName: "Central", StopLatitude: "42.3654861450195", StopLongitude: "-71.1038055419922" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new BraintreeModel({ StopID: "70071", StopName: "Kendall", StopLatitude: "42.362491607666", StopLongitude: "-71.0861740112305" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new BraintreeModel({ StopID: "70073", StopName: "Charles", StopLatitude: "42.3611640930176", StopLongitude: "-71.0706253051758" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new BraintreeModel({ StopID: "70075", StopName: "Park Street", StopLatitude: "42.3563957214355", StopLongitude: "-71.0624237060547" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new BraintreeModel({ StopID: "70077", StopName: "Downtown Crossing", StopLatitude: "42.3555183410645", StopLongitude: "-71.0602264404297" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new BraintreeModel({ StopID: "70079", StopName: "South Station", StopLatitude: "42.3522720336914", StopLongitude: "-71.0552444458008" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new BraintreeModel({ StopID: "70081", StopName: "Broadway", StopLatitude: "42.3426208496094", StopLongitude: "-71.0569686889648" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new BraintreeModel({ StopID: "70083", StopName: "Andrew", StopLatitude: "42.3301544189453", StopLongitude: "-71.0576553344727" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new BraintreeModel({ StopID: "70095", StopName: "JFK", StopLatitude: "42.320686340332", StopLongitude: "-71.0523910522461" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new BraintreeModel({ StopID: "70097", StopName: "North Quincy", StopLatitude: "42.275276184082", StopLongitude: "-71.0295867919922" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new BraintreeModel({ StopID: "70099", StopName: "Wollaston", StopLatitude: "42.2665138244629", StopLongitude: "-71.0203399658203" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new BraintreeModel({ StopID: "70101", StopName: "Quincy Center", StopLatitude: "42.2518081665039", StopLongitude: "-71.0054092407227" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new BraintreeModel({ StopID: "70103", StopName: "Quincy Adams", StopLatitude: "42.2333908081055", StopLongitude: "-71.0071563720703" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new BraintreeModel({ StopID: "70105", StopName: "Braintree", StopLatitude: "42.2078552246094", StopLongitude: "-71.0011367797852" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB - braintree end");
});



























form1 = new GreenEModel({ StopID: "70210", StopName: "Lechmere" });
form1.save(function (err) {
    if (err)
        console.log("---------------there is an error----------");
    else console.log("Saved into DB - GreenE start");
});

form1 = new GreenEModel({ StopID: "70208", StopName: "Science Park" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenEModel({ StopID: "70206", StopName: "North Station" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenEModel({ StopID: "70204", StopName: "Haymarket" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenEModel({ StopID: "70199", StopName: "Park Street" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenEModel({ StopID: "70159", StopName: "Boylston" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenEModel({ StopID: "70157", StopName: "Arlington" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenEModel({ StopID: "70155", StopName: "Copley" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenEModel({ StopID: "70239", StopName: "Prudential" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenEModel({ StopID: "70241", StopName: "Symphony" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenEModel({ StopID: "70243", StopName: "Northeastern University" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenEModel({ StopID: "70245", StopName: "Museum of Fine Arts" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenEModel({ StopID: "70247", StopName: "Longwood Medical Area" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenEModel({ StopID: "70249", StopName: "Brigham Circle" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenEModel({ StopID: "70251", StopName: "Fenwood Road" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenEModel({ StopID: "70253", StopName: "Mission Park" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenEModel({ StopID: "70255", StopName: "Riverway" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenEModel({ StopID: "70257", StopName: "Back of the Hill" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenEModel({ StopID: "70260", StopName: "Heath Street" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB - GreenE end");
});






























form1 = new GreenDModel({ StopID: "70206", StopName: "North Station" });
form1.save(function (err) {
    if (err)
        console.log("---------------there is an error----------");
    else console.log("Saved into DB - GreenD start");
});
form1 = new GreenDModel({ StopID: "70204", StopName: "Haymarket" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenDModel({ StopID: "70198", StopName: "Park Street" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenDModel({ StopID: "70159", StopName: "Boylston" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenDModel({ StopID: "70157", StopName: "Arlington" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenDModel({ StopID: "70155", StopName: "Copley" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenDModel({ StopID: "70153", StopName: "Hynes" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenDModel({ StopID: "70151", StopName: "Kenmore" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenDModel({ StopID: "70187", StopName: "Fenway" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenDModel({ StopID: "70183", StopName: "Longwood" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenDModel({ StopID: "70181", StopName: "Brookline Village" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenDModel({ StopID: "70179", StopName: "Brookline Hills" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenDModel({ StopID: "70177", StopName: "Beaconsfield" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenDModel({ StopID: "70175", StopName: "Reservoir" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenDModel({ StopID: "70173", StopName: "Chestnut Hill" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenDModel({ StopID: "70171", StopName: "Newton Centre" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenDModel({ StopID: "70169", StopName: "Newton Highlands" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenDModel({ StopID: "70167", StopName: "Eliot" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenDModel({ StopID: "70165", StopName: "Waban" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenDModel({ StopID: "70163", StopName: "Woodland" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenDModel({ StopID: "70161", StopName: "Riverside" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB - GreenD end");
});





























form1 = new GreenCModel({ StopID: "70206", StopName: "North Station" });
form1.save(function (err) {
    if (err)
        console.log("---------------there is an error----------");
    else console.log("Saved into DB - GreenC start");
});
form1 = new GreenCModel({ StopID: "70204", StopName: "Haymarket" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenCModel({ StopID: "70197", StopName: "Park Street" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenCModel({ StopID: "70159", StopName: "Boylston" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenCModel({ StopID: "70157", StopName: "Arlington" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenCModel({ StopID: "70155", StopName: "Copley" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenCModel({ StopID: "70153", StopName: "Hynes" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenCModel({ StopID: "70151", StopName: "Kenmore" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenCModel({ StopID: "70211", StopName: "Saint Mary Street" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenCModel({ StopID: "70213", StopName: "Hawes Street" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenCModel({ StopID: "70215", StopName: "Kent Street" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenCModel({ StopID: "70217", StopName: "Saint Paul Street" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenCModel({ StopID: "70219", StopName: "Coolidge Corner" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenCModel({ StopID: "70223", StopName: "Summit Avenue" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenCModel({ StopID: "70225", StopName: "Brandon Hall" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenCModel({ StopID: "70227", StopName: "Fairbanks Street" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenCModel({ StopID: "70229", StopName: "Washington Square" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenCModel({ StopID: "70231", StopName: "Tappan Street" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenCModel({ StopID: "70233", StopName: "Dean Road" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenCModel({ StopID: "70235", StopName: "Englewood Avenue" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenCModel({ StopID: "70237", StopName: "Cleveland Circle" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB - GreenC end");
});





























form1 = new GreenBModel({ StopID: "70196", StopName: "Park Street" });
form1.save(function (err) {
    if (err)
        console.log("---------------there is an error----------");
    else console.log("Saved into DB - GreenB start");
});
form1 = new GreenBModel({ StopID: "70159", StopName: "Boylston" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenBModel({ StopID: "70157", StopName: "Arlington" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenBModel({ StopID: "70155", StopName: "Copley" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenBModel({ StopID: "70153", StopName: "Hynes" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenBModel({ StopID: "70151", StopName: "Kenmore" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenBModel({ StopID: "70149", StopName: "Blandford Street" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenBModel({ StopID: "70147", StopName: "Boston Univ East" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenBModel({ StopID: "70145", StopName: "Boston Univ Central" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenBModel({ StopID: "70143", StopName: "Boston Univ West" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenBModel({ StopID: "70141", StopName: "Saint Paul Street" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenBModel({ StopID: "70139", StopName: "Pleasant Street" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenBModel({ StopID: "70137", StopName: "Babcock Street" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenBModel({ StopID: "70135", StopName: "Packards Corner" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenBModel({ StopID: "70131", StopName: "Harvard Avenue" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenBModel({ StopID: "70129", StopName: "Griggs Street" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenBModel({ StopID: "70127", StopName: "Allston Street" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenBModel({ StopID: "70125", StopName: "Warren Street" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenBModel({ StopID: "70121", StopName: "Washington Street" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenBModel({ StopID: "70117", StopName: "Sutherland Road" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenBModel({ StopID: "70115", StopName: "Chiswick Road" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenBModel({ StopID: "70113", StopName: "Chestnut Hill Avenue" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenBModel({ StopID: "70111", StopName: "South Street" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB");
});
form1 = new GreenBModel({ StopID: "70107", StopName: "Boston College" });
form1.save(function (err) {
    if (err)
        console.log(err);
    else console.log("Saved into DB - GreenB end");
});
*/
























app.get('/blue', function (req, res) {
    res.sendfile('public/blue.html');
});


app.get('/bluestations/:name', function (req, res) {
    BlueModel.find({ StopName: req.params.name }, function (err, response) {
        res.send(response[0]);
    });
});











app.get('/orange', function (req, res) {
    res.sendfile('public/orange.html');
});


app.get('/orangestations/:name', function (req, res) {
    OrangeModel.find({ StopName: req.params.name }, function (err, response) {
        res.send(response[0]);
    });
});















app.get('/ashmont', function (req, res) {
    res.sendfile('public/ashmont.html');
});


app.get('/ashmontstations/:name', function (req, res) {
    AshmontModel.find({ StopName: req.params.name }, function (err, response) {
        res.send(response[0]);
    });
});
















app.get('/braintree', function (req, res) {
    res.sendfile('public/braintree.html');
});


app.get('/braintreestations/:name', function (req, res) {
    BraintreeModel.find({ StopName: req.params.name }, function (err, response) {
        res.send(response[0]);
    });
});












app.get('/greenb', function (req, res) {
    res.sendfile('public/greenb.html');
});


app.get('/greenbstations/:name', function (req, res) {
    GreenBModel.find({ StopName: req.params.name }, function (err, response) {
        res.send(response[0]);
    });
});













app.get('/greenc', function (req, res) {
    res.sendfile('public/greenc.html');
});


app.get('/greencstations/:name', function (req, res) {
    GreenCModel.find({ StopName: req.params.name }, function (err, response) {
        res.send(response[0]);
    });
});













app.get('/greend', function (req, res) {
    res.sendfile('public/greend.html');
});


app.get('/greendstations/:name', function (req, res) {
    GreenDModel.find({ StopName: req.params.name }, function (err, response) {
        res.send(response[0]);
    });
});













app.get('/greene', function (req, res) {
    res.sendfile('public/greene.html');
});


app.get('/greenestations/:name', function (req, res) {
    GreenEModel.find({ StopName: req.params.name }, function (err, response) {
        res.send(response[0]);
    });
});








app.listen(port, ip);
