    require('dotenv').config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStartegy = require("passport-local");
const User = require("./models/user.js");

// const dbUrl = process.env.;

//Express Routers
const listingRouter  = require("./routes/listing.js");
const reviewRouter  = require("./routes/review.js");
const userRouter  = require("./routes/user.js");
const { log } = require('console');

const dbUrl = process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log("connection to DB is succesful");
})
.catch(err => console.log(err));

async function main(){
    await mongoose.connect(dbUrl);
}



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("ERROR IN MONGODB SESSION",err);
})
const sessionOptions ={
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge :7*24*60*60*1000,
        httpOnly:true
    },
}



// app.get("/",(req,res)=>{
//     res.send("I am Root");
// }) 

app.use(session(sessionOptions));
app.use(flash());

//Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStartegy(User.authenticate()));

passport.serializeUser(User.serializeUser()); //storing data of user in session
passport.deserializeUser(User.deserializeUser());//removing data of user from session

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})




//Express Router for listings
app.use("/listings",listingRouter);

//Express Router for Reviews
app.use("/listings/:id/reviews",reviewRouter);

//Express Router for User
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
})

app.use((err,req,res,next)=>{
    let {statusCode = 500,message="Something Went Wrong"} = err;
    res.status(statusCode).render("error.ejs",{err});
    // res.status(statusCode).send(message); 
})


app.listen(3000,()=>{
  console.log("Connection is perfect");
})

