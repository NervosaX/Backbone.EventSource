(function() {

  var ContentView = Backbone.View.extend({

    eventSourceURL: "http://localhost:3000/events",
    template: _.template($("#content-template").html()),
    el: "#content",
    pause: false,

    events: {
      "click #pause": "clickPause"
    },

    sourceEvents: {
      "updateID": "updateID"
    },

    onEventSourceConnected: function() {
      console.log("Client connected");
    },

    onEventSourceDisconnected: function() {
      console.log("Client disconnected");
    },

    clickPause: function(e) {
      var target = $(e.target);
      var val = this.paused ? "Pause" : "Resume";
      this.paused = !this.paused;     
      target.val(val);
        
      this.messageToSource({
        paused: this.paused,
        channel: this.channel
      }).done(function() {
        target.val(val);
      });
      e.preventDefault();
    },

    updateID: function(e) {
      this.channel = e.data.channel;
      this.count = e.data.id;
      this.$el.find("span").html(this.count);
    },

    render: function() {
      var renderedTemplate = this.template({
        count: this.count || 0
      });
      this.$el.html(renderedTemplate);
    }
  });

  new ContentView().render();
}());