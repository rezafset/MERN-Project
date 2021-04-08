const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

require('../db/connection')
const User = require('../model/userSchema')

router.get('/', (req, res) => {
    res.send('Hlw!! Wellcome to my Server Home form Router');
})

// Using Promise

// router.post('/register', (req, res) => {

//     const { name , email , phone, work, password, confirmpassword } = req.body;

//     if(!name || !email || !phone || !work || !password || !confirmpassword){
//        return  res.status(422).json({ error: "Plz fillup all field" })
//     }

//     User.findOne( { email : email })
//     .then((alreadyExit) =>{

//         if(alreadyExit){
//             return res.status(422).json({ error: "Email Already Exit" })
//         }

//         const user = new User({ name , email , phone, work, password, confirmpassword })

//         user.save().then(() =>{
//             res.status(201).json({ message: "User Register Successfully" })
//         }).catch((err) =>{
//             res.status(500).json({ message: "Fail to register Register" })
//         })

//     }).catch((err)=> console.log(err))
// })

// Using Async

router.post('/register', async (req, res) => {

    const { name, email, phone, work, password, confirmpassword } = req.body;

    if (!name || !email || !phone || !work || !password || !confirmpassword) {
        return res.status(422).json({ error: "Plz fillup all field" })
    }

    try {

        const alreadyExit = await User.findOne({ email: email })

        if (alreadyExit) {
            return res.status(422).json({ error: "Email Already Exit" })

        } else if (password != confirmpassword) {

            return res.status(400).json({ error: "Password is not match" })

        } else {
            const user = new User({ name, email, phone, work, password, confirmpassword })
            // Before save we need to hash our password here
            const userRegister = await user.save();

            if (userRegister) {
                res.status(201).json({ message: "User Register Successfully" })
            }
            else {
                res.status(500).json({ message: "Fail to register Register" })
            }
        }

    } catch (error) {
        console.log(error);
    }
})

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Plz Fill the require information" })
    }

    try {

        const userLogin = await User.findOne({ email: email });
        // console.log(userLogin);

        if (userLogin) {

            const isMatch = await bcrypt.compare( password , userLogin.password )

            const token = await userLogin.generateAuthToken();
            console.log(token);

            res.cookie('jwtoken', token, {
                expires: new Date( Date.now() + 25892000000 ),
                httpOnly: true
            });
            
            if(!isMatch ){
                res.status(400).json({ error: "Invalid password" })
            }else{
                res.status(201).json({ message: "User Login Successfully" })
            }
            
        } else {
            res.status(400).json({ error: "Invalid email" })
        }

    } catch (error) {
        console.log(error);
    }

})


module.exports = router;