const User = require("../models/user");
const bcryptjs = require('bcryptjs')

const mailgun = require("mailgun-js")

exports.getLogin = (req, res, next) => {
  let error = req.flash('error')
  let errorMessage = error.length>0?error:null
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage
  });
};

exports.getSignup = (req, res, next)=>{
  let error = req.flash('error')
  let errorMessage = error.length>0?error:null
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage
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
      req.flash("error", "Email already exists!")
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
      const DOMAIN = 'sandboxc696bf8267be477385c1c4c7513f01b5.mailgun.org';
      const mg = mailgun({
        apiKey: "d673032e3cec3b8679f80eb68a04dd75-c3d1d1eb-575a1723",
        domain: DOMAIN
      });
      console.log(email);
      const data = {
        from: 'Excited User <'+ email +'>',
        to: ['macdon202@gmail.com'],
        subject: 'Hello',
        text: 'Testing some Mailgun awesomness!'
      };
      mg.messages().send(data, function (error, body) {
        console.log(error);
        console.log(body);
        res.redirect("/login")
      });
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