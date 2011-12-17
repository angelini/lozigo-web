(function(Search) {

  Search.Model = Backbone.Model.extend({
    search: function(query, callback) {
      app.socket.emit('search', query, function(result_text) {
        var result = new Search.ResultModel({
          text: result_text
        });

        callback(result);
      });
    }
  });

  Search.ResultModel = Backbone.Model.extend({

  });

  Search.View = Backbone.View.extend({
    className: 'search',

    events: {
      'click input[type=submit]': 'search',
      'click .close': 'close'
    },

    initialize: function() {
      _.bindAll(this);
      this.template = $('#search-tmpl').html();
    },

    render: function() {
      var $el = $(this.el);
      $el.html(this.template);

      return this;
    },

    close: function() {
      var $el = $(this.el);

      $el.find('.results').html('');
    },

    search: function() {
      var $el = $(this.el);
      var query = $el.find('.query').val();

      this.model.search(query, function(result) {
        var resultView = new Search.ResultView({
          model: result
        });

        $el.find('.results').html(resultView.render().el);
      });
    }
  });

  Search.ResultView = Backbone.View.extend({
    initialize: function() {
      this.template = $('#search-results-tmpl').html();
    },
    
    render: function() {
      var $el = $(this.el);
      var html = Mustache.to_html(this.template, this.model.attributes);

      $el.html(html);
      return this;
    }
  });

})(app.module('search'));
