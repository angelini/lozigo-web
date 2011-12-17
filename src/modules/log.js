(function(Log) {

  Log.Model = Backbone.Model.extend({
    initialize: function() {
      this.entries = [];
    },

    pushEntry: function(entry) {
      this.entries.push(entry);
      this.trigger('newLine', entry.data);

      if(entry.keywords.indexOf('error') !== -1) {
        app.notify();
      }
    }
  });

  Log.Collection = Backbone.Collection.extend({
    model: Log.Model,

    newEntry: function(entry) {
      var log = this.get(entry.log.name);

      if(!log) {
        log = new Log.Model({
          id: entry.log.name,
          path: entry.log.path
        });

        this.add(log);
      }

      log.pushEntry(entry);
    }
  });

  Log.SingleView = Backbone.View.extend({
    className: 'log',

    initialize: function() {
      _.bindAll(this);
      this.template = $('#log-tmpl').html();
      this.model.bind('newLine', this.newLine);
    },

    render: function() {
      var $el = $(this.el);
      var html = Mustache.to_html(this.template, this.model.attributes);

      $el.html(html);
      return this;
    },

    newLine: function(line) {
      var $lines = $(this.el).find('.lines');
      var lines = $lines[0];
      var scroll = false;
      var text = $lines.text();

      if(lines.scrollTop + lines.offsetHeight - lines.scrollHeight >= 0) {
        scroll = true;
      }

      $lines.text(text + '>  ' + line + '\n');
      
      if(scroll) {
        lines.scrollByLines(400);
      }
    }
  });

  Log.ListView = Backbone.View.extend({
    className: 'logs-wrapper',

    initialize: function() {
      _.bindAll(this);
      this.collection.bind('add', this.newLog);
    },

    render: function() {
      var that = this;
      var $el = $(this.el);

      this.collection.each(function(log) {
        that.newLog(log);
      });

      return this;
    },

    newLog: function(log) {
      var $el = $(this.el);
      var logView = new Log.SingleView({
        model: log
      });

      $el.append(logView.render().el);
    }
  });

})(app.module('log'));
