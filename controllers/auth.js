const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.session.user
  });
};


exports.postLogin = (req, res, next)=>{
  // res.setHeader("Set-Cookie", "loggedIn=true")  
  User.findById("62026c6121b58e935e9c90c7")
  .then(user=>{
    req.session.user = user
    res.redirect('/')
  }).catch(err=>console.log(err))
}