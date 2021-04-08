const mongoose = require('mongoose');

// Database Connection Part
const DB = process.env.DATABASE;
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('Connect Successfully');
}).catch((err) =>{
    console.log('not connected');
})