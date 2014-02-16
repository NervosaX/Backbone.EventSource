(function() {

  var ContentView = Backbone.View.extend({

    eventSourceURL: "http://localhost:3000/events",
    template: $("#content-template").html(),
    el: "#content",

    sourceEvents: {
      "updateID": "updateID"
    },

    updateID: function(e) {
      this.count = e.data;
      this.render();
    },

    render: function() {
      var renderedTemplate = _.template(this.template)({
        count: this.count || 0
      });
      this.$el.html(renderedTemplate);
    }
  });

  new ContentView().render();
}());