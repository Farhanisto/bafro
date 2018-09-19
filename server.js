import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import Game from './app/models/game';
import {getGames,getGame,postGame,deleteGame} from './app/routes/game';

const app = express();
const port = process.env.PORT || 8080;

//DB connection setting with mongoose
const options = {
    useNewUrlParser: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
  };

mongoose.Promise =global.Promise;
mongoose.connect('mongodb://localhost:27017/myapp',options);

const db = mongoose.connection;
db.on('error', ()=>{
    console.error.bind(console, 'connection error');
})


//Body parser and morgan middle-wares
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

// Tell express where to find out public folder
app.use(express.static(__dirname + '/client/dist'));

// Enable CORS so that we can make HTTP request from webpack-dev-server
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

//API Route
app.route('/games')
   //create a game
   .post(postGame)
   //get all games
   .get(getGames);

app.route('/games/:id')
   //get a single game
   .get(getGame)
   //delete a single game
   .delete(deleteGame);

// for all other request just send to the homepage
app.route('*').get(((req,res)=>{
   res.sendFile('client/dist/index.html', {root:__dirname});
}));

app.listen(port);

console.log(`Server running on port ${port}`)