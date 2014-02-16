var sse, express, app;

sse = require('connect-sse')();
express = require('express');

app = express();
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/events', sse, function (req, res) {
  var id = 0;
  setInterval(function() {
    id++;
    res.write('event: updateID\n');
    res.json(id);
    console.log("Sending " + id + "...");
  }, 1000);
  // res.json("this is an event");
  // res.json({here: "is", another: "event"});
});

console.log("Listening on port 3000...")
app.listen(3000);