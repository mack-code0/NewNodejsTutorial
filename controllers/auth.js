const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.getSignup = (req, res, next)=>{
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
}


exports.postLogin = (req, res, next)=>{
  // res.setHeader("Set-Cookie", "loggedIn=true")  
  User.findById("62026c6121b58e935e9c90c7")
  .then(user=>{
    if(user){
      req.session.user = user
      res.redirect('/')
    }else{
      res.redirect("/login")
    }
  }).catch(err=>console.log(err))
}

exports.postSignup = (req, res, next) => {
  const {email, password, confirmPassword} = req.body
}

exports.postLogout = (req, res, next)=>{
  req.session.destroy(err=>{
    console.log(err);
    res.redirect("/login")
  })
}