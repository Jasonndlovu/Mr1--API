const { config } = require('dotenv');
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

app.use(cors());
app.options('*',cors());

//Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(errorHandler);

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

//Routers
const strategyRouters = require('./routers/strategy');
const notificationsRoutes = require('./routers/notifications');
const signalRoutes = require('./routers/signal');
const userRoutes = require('./routers/users');
const moduleRoutes = require('./routers/module');
const onlineLessons = require('./routers/onlineLessons');
const membership = require('./routers/membership');

const api = process.env.API_URL;
app.use(`${api}/notifications`, notificationsRoutes);
app.use(`${api}/strategy`, strategyRouters);
app.use(`${api}/users`, userRoutes);
app.use(`${api}/module`, moduleRoutes);
app.use(`${api}/signal`, signalRoutes);
app.use(`${api}/onlineLessons`, onlineLessons);
app.use(`${api}/membership`, membership);


//dont need this anymore
//const Product = require('./models/product');




mongoose.connect(process.env.CONNECTION_STRING,{ useNewUrlParser: true,useUnifiedTopology: true, dbName: 'MobileAPI'} )
.then(()=>{
    console.log('Database Connection is ready...')
})
.catch((err)=>{
    console.log(err);
})

const PORT = process.env.PORT || 3000;
//Server
app.listen(PORT, ()=>{
    
    console.log('server is running http://localhost:3000');
})
