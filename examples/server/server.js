var sse, express, app, Fiber;

sse = require('connect-sse')();
express = require('express');
Fiber = require('fibers');

app = express();
app.configure(function() {
  app.use(express.json());
  app.use(express.urlencoded());
});

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
  next();
});

var channel = 0;
var users = {};

function sleep(ms) {
    var fiber = Fiber.current;
    setTimeout(function() {
        fiber.run();
    }, ms);
    Fiber.yield();
}

var addUser = function(channel) {
  var user = users[channel];
  var request = user.request;
  var response = user.response;
  var paused = user.paused;
  var connected = true;
  var id = 0;

  console.log("User has joined");

  request.on("close", function() {
    connected = false;
    console.log("User has left..");
  });

  while (connected) {
    if (!user.paused) {
      id++;
      response.write('event: updateID\n');
      response.json({
        channel: channel,
        id: id
      });
    }
    sleep(1000);
  }
};

app.get('/events', sse, function (request, response) {
  channel++;
  users[channel] = {
    request: request,
    response: response,
    paused: false
  };
  Fiber(addUser).run(channel);
});

app.post('/events', function(request, response) {
  var data = request.body;
  var user = users[data.channel];
  user.paused = data.paused;
  response.end("200");
});

console.log("Listening on port 3000...")
app.listen(3000);