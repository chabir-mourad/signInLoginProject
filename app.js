const  express = require('express')
const app = express()
const PORT = 3000 || process.env.PORT
const expressLayoutes = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

//Passport cofig 

require('./config/passport')(passport)




app.use(express.static('public'))





// connect To MoNGo

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true})
.catch((err)=> console.log(err))
.then(()=> console.log("mongodb connected ..."))

//EJS 
app.use(expressLayoutes)
app.set('view engine' , 'ejs')
 

// BodyParser 
app.use(express.urlencoded({extended:false}))

// Express session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  
  }))

  // Passport midelwear
  app.use(passport.initialize());
app.use(passport.session());



  // Connect Flash

  app.use(flash())

 // Global Variables 

 app.use(function(req,res,next) {
     res.locals.success_msg = req.flash('success_msg')
     res.locals.error_msg = req.flash('error_msg')
     res.locals.error = req.flash('error')
     next()
 } )

// Routes
app.use('/' , require('./routes/index'))
app.use('/users' , require('./routes/users'))



app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))