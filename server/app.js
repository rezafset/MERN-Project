const dotenv = require('dotenv');
const { json } = require('express');
const express = require('express');
const app = express();

dotenv.config({path: './config.env' })
require('./db/connection')

app.use(express.json())
// const User = require('./model/userSchema');
app.use(require('./router/auth'))

const PORT = process.env.PORT;

const middleware = (req, res, next) =>{
    console.log('middleware is ready');
    next();
}

// app.get('/', (req , res) =>{
//     res.send('Hlw!! Wellcome to my Server Home');
// })

app.get('/about', middleware, (req , res) =>{
    res.send('Hlw!! Wellcome to my Server About');
})

app.get('/contact', (req , res) =>{
    res.send('Hlw!! Wellcome to my Server Contact');
})

app.get('/signup', (req , res) =>{
    res.send('Hlw!! Wellcome to my Server Register');
})

app.listen(PORT, () =>{
    console.log(`server is ready to go now at port ${PORT}`);
})