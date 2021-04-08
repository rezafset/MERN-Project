const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const useSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    work: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
})

useSchema.pre('save', async function(next) {
    console.log('Hashing Process');

    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmpassword = await bcrypt.hash(this.confirmpassword, 10);
    }
    next();
})

// Generate Jwt token
useSchema.methods.generateAuthToken = async function(){
    try {
        
        let token = jwt.sign({ _id:this._id }, process.env.SECRET_KEY );
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;

    } catch (error) {
        console.log(error);
    }
}

const User = mongoose.model('USER', useSchema);
module.exports = User;