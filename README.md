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
