// Constants
var BACKUP = 'backup.txt';

// Requires
var connect = require('connect');
var lozigo = require('lozigo');

// Connect Server
var app = connect.createServer();
app.use(connect['static'](__dirname));
app.use(connect.favicon());
app.listen(3010);

// Lozigo Server
var logs = lozigo.createServer();
logs.use(lozigo.keywords());

logs.use(lozigo.logger({
  file_path: BACKUP,
  include_meta: false,
  log_title: true
}));

logs.use(function(entry, acc, next) {
  acc.web = entry;
  acc.web.keywords = acc.keywords;
  next(entry, acc);
});

logs.connect(app, BACKUP);
logs.listen(3020);
