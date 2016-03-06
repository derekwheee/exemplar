import express from 'express';

// Constants
const DEFAULT_PORT = 3000;
const START_DIRECTORY = __dirname + '/../dist';

console.log(START_DIRECTORY);

let app = express();

app.set('port', (process.env.PORT || DEFAULT_PORT));

app.use(express.static(START_DIRECTORY));

app.listen(app.get('port'), function () {

  console.log('Node app is running at localhost:' + app.get('port'));

});
