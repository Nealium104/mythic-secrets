const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const { create } = require('express-handlebars')

const connectDB = require('./config/db')

// Load config
dotenv.config({ path: './config/config.env'})

//Passport Config
require('./config/passport')(passport)

connectDB()

const app = express()

//Logging
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Handlebars
const hbs = create({ defaultLayout: 'main', extname: '.hbs'})
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

// Sessions
app.use(
    session({
    secret: 'The Big Secret',
    resave: false,
    saveUninitialized: false,
})
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Static folder
app.use(express.static(path.join(__dirname, 'public')))
app.use('/auth', require('./routes/auth'))

//Routes
app.use('/', require('./routes/index'))


const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`))