const express = require('express');
const publicRoutes = require('./router/publicRouter');
const app = express();
const authjwt = require('./helpers/jwt');
// const errorhandlers = require('./helpers/error-handlers');
require('dotenv/config');
const bodyParser = require('body-parser');
const  Mongoose  = require('mongoose');
const cors = require('cors');
const api = process.env.API_URL;
const URL = process.env.connection_string;

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', publicRoutes); 
app.use(cors());
app.options('*', cors());
app.use(authjwt());
// app.use(errorhandlers);
// app.use(morgan('tiny'));

// database connection

Mongoose.connect(URL ,{
    useNewUrlParser: true,
    useUnifiedTopology: true 
    
}).then(()=>{
    console.log("database connected  succesfully")
}).catch((err) =>{
    console.log('connection failed' ,err);

})

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})

// module.exports = config;