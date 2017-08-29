const express = require('express');
const exphbs  = require('express-handlebars');
const config = require('./config');
const helpers = require('./helpers');

let app;

if (!config.USE_SSL) {
    http = require('http');
    app = express();
    init();
    http.createServer(app).listen(process.env.PORT || config.DEFAULT_PORT);
} else {
    let pem = require('pem');
    https = require('https');
    pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
        app = express();
        init();
        https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(process.env.PORT || config.DEFAULT_PORT);
    });
}

function init() {

    app.set('views', config.VIEWS_PATH);

    app.engine('.hbs', exphbs({
        layoutsDir : `${config.VIEWS_PATH}/layouts/`,
        partialsDir : `${config.VIEWS_PATH}/partials/`,
        defaultLayout : 'main',
        extname : '.hbs',
        helpers : helpers,
    }));

    app.set('view engine', '.hbs');

    app.use(express.static(config.STATIC_PATH))

    app.get('/', function (req, res) {
        res.render('index');
    });

    app.get('/:path', function (req, res) {
        try {
            res.render(req.params.path);
        } catch (err) {
            console.log(404, req.params.path);
        }
    });

    console.log('Listening on port', process.env.PORT || config.DEFAULT_PORT);
}