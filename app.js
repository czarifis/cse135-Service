var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/delivery_db", {native_parser:true});


var app = express();


app.set('jsonp callback name', 'callback');

var global_trucks;
app.get('/delivery_trucks', function(req, res) {
   // db.collection('trucks').find().toArray(function (err, items) {
   //     res.jsonp(items);
   // });
    res.jsonp(global_trucks);
});

app.get('/delivery_trucksi', function(req, res) {
   // db.collection('trucks').find().toArray(function (err, items) {
   //     res.jsonp(items);
   // });
    res.json(global_trucks);
});


var TRUCKS_NO = 100;
var DELIVERIES_NO = 40;

var createRandomTruck = function (i) {
    var lat_min = -90,
        lat_range = 90 - lat_min,
        lng_min = -180,
        lng_range = 180 - lng_min;

    var truck_key = "id";

    var deliveries = [];

    for (var k =0;k<DELIVERIES_NO;k++){

        var del = createDeliveries(k);
        deliveries.push(del);
    }

    var latitude = lat_min + (Math.random() * lat_range);
    var longitude = lng_min + (Math.random() * lng_range);
    var ret = {
        truck_key: i,
        coords: {
            latitude: latitude,
            longitude: longitude
        },
        all_deliveries: deliveries,
        pending_deliveries : deliveries.length,
        visible:true
    };
    ret[truck_key] = i;
    return ret;
};

var createDeliveries = function(j){

    return {
        delivery_id: j,
        recipient: 'The White House',
        //...

        scheduled_time: '14:19',
        delivered_time: '14:19',
        item_title: 'item title'+j,
        item_description: 'blahBlahBlah'
    };
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

setInterval(function() {
    console.log(Date.now());
    var trucks = [];
    for (var i = 0; i < TRUCKS_NO; i++) {

        var mm = createRandomTruck(i);
        trucks.push(mm);

    }
   // var trucks = createRandomTruck()

    global_trucks = trucks;
}, 1000);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
