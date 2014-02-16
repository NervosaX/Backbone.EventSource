Backbone EventSource
====================

Backbone EventSource adds the power of EventSource to your Backbone Views, allowing for automated updates from any basic http server.

### Requirements

Makes use of backbone.beamer ( https://github.com/orizens/Backbone.Beamer ) for hooking 
into the Backbone View.

As it is a Backbone plugin, you will need Underscore, Backbone and jQuery.

### Usage

In your Backbone View, add `eventSourceURL` to your event source HTTP endpoint.
Like using Backbone events, add an `eventSources` object that maps to methods:

```javascript
var View = Backbone.View.extend({
  eventSourceURL: "http://path.to.your/endpoint",

  eventSources: {
    "eventName": "eventOccurance"
  },

  eventOccurance: function(e) {
    console.log("Event 'eventName' has been sent from the server to the client! ", e.data);
  }
});
```
### Additional methods
`this.messageToSource(object):` Because EventSource is one directional (from server to client), we need a way to respond to the server (or not). If you do, this function makes a jquery POST to the eventSourceURL. It should take one argument, an object with all your data in it. It will return with a jquery promise.

`onEventSourceConnected` Add this into your view for when a connection is made to the EventSource.

`onEventSourceDisconnected` Add this into your view for when you are disconnected from the EventSource.

### Examples
See examples folder to see how the client and server could work (and keep in mind, the server can be anything you want, I chose node for simplicity).