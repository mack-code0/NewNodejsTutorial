const path = require('path');

const express = require('express');
const session = require('express-session')
const bodyParser = require('body-parser');
const csrf = require('csurf')
const flash = require('connect-flash')
const mongoose = require('mongoose');
const mongoDbStore = require('connect-mongodb-session')(session)

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/test'

const app = express();
const store = new mongoDbStore({
  uri: MONGODB_URI,
  collection: "sessions"
})
const csrfProtection = csrf()

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: "My Secret Key",
  resave: false,
  saveUninitialized: false,
  store: store
}))
app.use(flash())
app.use(csrfProtection)

app.use((req, res, next)=>{
  res.locals.isAuthenticated = req.session.isLoggedIn
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use((req, res, next)=>{
  if(!req.session.user){
    return next()
  }
  User.findById(req.session.user._id)
  .then(user=>{
    req.user = user
    next()
  })
})


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect(MONGODB_URI)
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
});
