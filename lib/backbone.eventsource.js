/*
  Backbone EventSource
  ====================

  Makes use of backbone.beamer ( https://github.com/orizens/Backbone.Beamer ).
  Adds support for EventSource in Backbone. Use is simple:

  In your Backbone View, add a eventSourceURL to your event source HTTP endpoint.
  Like using Backbone events, add a eventSources object that maps to methods:

  var View = Backbone.View.extend({
    eventSourceURL: "http://path.to.your/endpoint",

    eventSources: {
        "eventName": "eventOccurance"
    },

    eventOccurance: function(e) {
        console.log("Event 'eventName' has been sent from the server to the client!");
    }
  });
*/
(function(){

  // check for Backbone
  // check for Underscore
  var _ = this._;
  var Backbone = this.Backbone;

  // if Underscore or Backbone have not been loaded
  // exit to prevent js errors
  if (!_ || !Backbone || !JSON) {
    return;
  }

  // defintion of Extension
  function BackboneEventSourceExtension(view) {}

  BackboneEventSourceExtension.prototype = {
    delegateSourceEvents: function(events) {
      if (!this.eventSource) return this;
      if (!(events || (events = _.result(this, 'sourceEvents')))) return this;
      var self = this;
      this.undelegateSourceEvents();

      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) continue;
        alteredMethod = function(e) {
          // Data comes out as a string, so convert it into an object
          // with JSON parse
          var ev = _.clone(e);
          ev.data = JSON.parse(e.data);
          method.call(self, ev);
        };
        this.eventSource.addEventListener.call(this.eventSource, key, alteredMethod, false);
      }
      return this;
    },

    undelegateSourceEvents: function() {
      if (this.eventSource) {
        this.eventSource.removeEventListener(null, null);
      }
      return this;
    },

    remove: function() {
      this.undelegateSourceEvents();
      Backbone.View.prototype.remove.apply(this, arguments);
    },

    messageToSource: function(data, success, error) {
      return $.ajax({
        url: this.eventSourceURL,
        method: "POST",
        dataType: "json",
        contentType:"application/json; charset=utf-8",
        data: JSON.stringify(data),
        success: function() {
          if (_.isFunction(success)) success.call(this, arguments);
        },
        error: function() {
          if (_.isFunction(error)) error.call(this, arguments);
        }
      });
    }
  };

  var init = function() {
    Backbone.trigger('extend:View', {
      key: 'eventSourceURL',
      extension: BackboneEventSourceExtension,
      initialize: function () {
        var self = this;
        this.eventSource = new EventSource(this.eventSourceURL);
        this.eventSource.addEventListener("open", function(e) {
          self._eventSourceConnected = true;
          if (self.onEventSourceConnected) {
            self.onEventSourceConnected.call(this, e);
          }
        }, false);
        this.eventSource.addEventListener("error", function(e) {
          if (self._eventSourceConnected) {
            if (self.onEventSourceDisconnected) {
              self.onEventSourceDisconnected.call(this, e);
            }
            self._eventSourceConnected = false;
          }
        });
        this.delegateSourceEvents();
      }
    });
  };

  init();

  // if using AMD and xManager is loaded after the extension
  Backbone.on('xManager:ready', init);
}());