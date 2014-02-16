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
  if (!_ || !Backbone) {
    return;
  }

  // defintion of Extension
  function BackboneEventSourceExtension(view) {}

  BackboneEventSourceExtension.prototype = {
    delegateSourceEvents: function(events) {
      if (!this.eventSource) return this;
      if (!(events || (events = _.result(this, 'sourceEvents')))) return this;
      this.undelegateSourceEvents();

      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) continue;
        method = _.bind(method, this);
        this.eventSource.addEventListener.call(this.eventSource, key, method, false);
      }
      return this;
    },

    undelegateSourceEvents: function() {
      if (this.eventSource) {
        this.eventSource.removeEventListener()
      }
      return this;
    },

    remove: function() {
      this.undelegateSourceEvents();
      Backbone.View.prototype.remove.apply(this, arguments);
    }
  };

  var init = function() {
    Backbone.trigger('extend:View', {
      key: 'eventSourceURL',
      extension: BackboneEventSourceExtension,
      initialize: function () {
        this.eventSource = new EventSource(this.eventSourceURL);
        this.delegateSourceEvents();
      }
    });
  };

  init();

  // if using AMD and xManager is loaded after the extension
  Backbone.on('xManager:ready', init);
}());