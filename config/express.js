var config = require('../config/env/development');
var express = require('express'),
morgan = require('morgan'),
compress = require('compression'),
bodyParser = require('body-parser'),
methodOverride = require('method-override');//,
session = require('express-session');

var routes = require('../app/routes/index.server.routes')
var about = require('../app/routes/about.server.routes')
var projects = require('../app/routes/projects.server.routes');
var services = require('../app/routes/services.server.routes');
var contact = require('../app/routes/contact.server.routes');

module.exports = function() {
var app = express();
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
} else if (process.env.NODE_ENV === 'production'){
    app.use(compress());
}

app.use((req, res, next) => {
	if (req.path.substr(-1) == '/' && req.path.length > 1) {
		const query = req.url.slice(req.path.length)
		res.redirect(301, req.path.slice(0, -1) + query)
	} else {
		next()
	}
})

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());


app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret
}));


app.set('views', './app/views');
app.set('view engine', 'ejs');

require('../app/routes/index.server.routes.js')(app);
require('../app/routes/about.server.routes.js')(app);
require('../app/routes/projects.server.routes.js')(app);
require('../app/routes/services.server.routes.js')(app);
require('../app/routes/contact.server.routes.js')(app);

app.use('index', routes);
app.use('about', about);
app.use('projects', projects)
app.use('services.ejs', services);
app.use('contact', contact);

app.use(express.static('./public'));

return app;
};