const User = require("../models/user");
const bcryptjs = require('bcryptjs')

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: req.flash("error")
  });
};

exports.getSignup = (req, res, next)=>{
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup'
  });
}


exports.postLogin = (req, res, next)=>{
  // res.setHeader("Set-Cookie", "loggedIn=true")  
  const {email, password} = req.body
  User.findOne({email: email})
  .then(user=>{
    if(!user){
      req.flash("error", "Invalid email or password")
      return res.redirect("/login")
    }
    bcryptjs.compare(password, user.password)
    .then(doMatch=>{
      if(!doMatch){
        req.flash("error", "Invalid email or password")
        return res.redirect("/login")
      }
      req.session.isLoggedIn = true
      req.session.user = user
      req.session.save(err=>{
        res.redirect("/")
      })
    })
  }).catch(err=>console.log(err))
}

exports.postSignup = (req, res, next) => {
  const {email, password, confirmPassword} = req.body
  User.findOne({email: email})
  .then(user=>{
    if(user){
      return res.redirect("/signup")
    }

    return bcryptjs.hash(password, 12)
    .then(hashedPassword=>{
      const newUser = User({
        password: hashedPassword,
        email,
        cart: { items: [] }
      })
  
      return newUser.save()
    })
    .then(result=>{
      res.redirect("/login")
    })
  })
  .catch(err => console.log(err))
}

exports.postLogout = (req, res, next)=>{
  req.session.destroy(err=>{
    console.log(err);
    res.redirect("/login")
  })
}