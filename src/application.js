var app = {
  module: (function() {
    // Internal module cache.
    var modules = {};

    return function(name) {
      // If this module has already been created, return it.
      if (modules[name]) {
        return modules[name];
      }

      // Create a module and save it under this name
      modules[name] = {
        Views: {}
      };
      return modules[name];
    };
  })(),

  socket: (function() {
    var api = window.location.protocol + '//' + window.location.host;
    return io.connect(api);
  })(),

  init: function() {
    var Log = app.module('log');
    var Search = app.module('search');

    var logs = new Log.Collection();
    var logsView = new Log.ListView({
      collection: logs
    });

    var search = new Search.Model();
    var searchView = new Search.View({
      model: search
    });

    app.socket.on('lozigo', function(entry) {
      logs.newEntry(entry);
    });

    $('#main').append(searchView.render().el)
              .append(logsView.render().el);
  },

  notify: (function() {
    var count = 0;
    var title = 'Lozigo Web';

    $(window).focus(function() {
      count = 0;
      document.title = title;
    });

    return function() {
      count++;
      document.title = count + ' - ' + title;
    }
  })()
};

jQuery(function($) {
  var Router = Backbone.Router.extend({
    routes: {
      '': 'init'
    },

    init: function() {
      app.init();
    }
  });

  app.router = new Router();

  Backbone.history.start();
});

