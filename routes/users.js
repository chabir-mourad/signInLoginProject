const express = require('express');
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport');
// User model

const User = require('../modals/User')

// Login route Page

router.get('/login' , function(req,res) {
    res.render('login')

})

// Register route Page
router.get('/register' , function(req,res) {
    res.render('register')
})

router.post('/register' , function(req,res) {

    const {name , email , password2 , password} = req.body

    
 const errors = []


// check required fields


if (!name || !email || !password || !password2 ) {


errors.push({msg : 'please fill in all fields'})
}

// check password match

if (password !== password2) {
    errors.push({ msg : "Password doesn't match"})
}

 if (password.length <6) {
    errors.push({msg : 'Passwor should be 6 characters'})
}

 if (errors.length > 0) {
res.render('register' , {errors , name , email , password , password2})

}
else {
   User.findOne({email : email} , function(err , foundUser) {
       if (!err) {
           if (foundUser) {
               errors.push({msg : "Email is already exists"})
            res.render('register' , {errors , name , email , password , password2})
           }
           else {
const newUser = new User ({
    name : name ,
    email : email ,
    password : password
})
// Hash password
bcrypt.genSalt(10 , (err,salt) => bcrypt.hash(newUser.password, salt , function(err,hash) {
    if (err) throw err ;
    //set password to a Hash
    newUser.password = hash
    newUser.save(function(err,user) {
        if (err) {
            console.log(err)
        }
        else {
req.flash('success_msg' , 'You are now registred and can log in')

            res.redirect('/users/login')
        }
    })
}))
           }
       }
   })
}

})


router.post('/login' , function(req,res,next) {
passport.authenticate('local', {
    successRedirect : '/dashboard',
    failureRedirect : '/users/login',
     failureFlash : true
})(req,res,next)
})


router.get('/logout' , function(req,res) {
    req.logOut()
    req.flash('success_msg' , "You are logged out")
    res.redirect('/users/login')
})

module.exports = router