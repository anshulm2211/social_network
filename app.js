const  express   = require('express'),
           app   = express(),
    bodyParser   = require('body-parser'),
         mysql   = require('mysql'),
         flash   = require('connect-flash'),
       session   = require('express-session'),
      passport   = require('passport'),
 LocalStrategy   = require('passport-local').Strategy,
    authRoutes   = require('./routes/auth'),
 contentRoutes   = require('./routes/content');

///////////////////////////
// database connection
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "db",
    multipleStatements: true
});

var status = { 
    uploads:0,
    follower:0,
    following:0,
    profilepic:String
}

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(session({ cookie: { maxAge: 3600000 }, 
    secret: 'woot',
    resave: false, 
    saveUninitialized: false}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(username, done) {
    con.query("select * from register where username = '"+username+"'",function(err,results){	
        done(null, username);
    });
});

///////////////////////////
//  authentication strategy
passport.use('local-login',new LocalStrategy({
    passReqToCallback : true
    },
    (req, username, password, done) => {
        con.query("select count(*) r from friends where added='"+username+"'", (err, results) => {
            if(err) {
                console.log(err);
            } else if(results.length > 0) {
                req.session.follower=results[0].r-1;
                // console.log(" 1 "+res.locals.follower);
            }
        });
        con.query("select count(*) r from friends where username='"+username+"'", (err, results) => {
            if(err) {
                console.log(err);
            } else if(results.length > 0) {
                req.session.following=results[0].r-1;
            } 
        });
        con.query("select count(*) r from uploads where username='"+username+"'", (err, results) => {
            if(err) {
                console.log(err);
            } else {
                req.session.uploads=results[0].r;
            }
        });
        q="select profilepic p from profiles where username='"+username+"'";
        con.query(q, (err,results) => {
            if(err) {
                console.log(err);
            } else {
                if(results.length>0)
                    req.session.profilepic=results[0].p;
                else
                    req.session.profilepic="/img/male-icon.png";
            }
        });
        con.query("select * from register where username='"+username+"'", (err, results) => {
            if(err) {
                return done(null,req.flash('message',err.sqlMessage));
            } else {
                if(results.length > 0) {
                    if(results[0].password == password) {
                        return done(null, results[0],req.flash('message',"Welcome " + username));
                    } else {
                        return done(null, false,req.flash('message','Username and password does not match'));
                    }
                } else {
                    return done(null, false, req.flash('message','Username does not exist'));
                }
            }
        })
    }
));


app.use(function(req,res,next){
    var username = req.user;
    res.locals.username = req.user;
    res.locals.uploads = req.session.uploads;
    res.locals.follower = req.session.follower;
    res.locals.following = req.session.following;
    res.locals.profilepic = req.session.profilepic;
    req.session.reload(function(err) {
        // session updated
        con.query("select count(*) r from friends where added='"+username+"'", (err, results) => {
            if(err) {
                console.log(err);
            } else if(results.length > 0) {
                req.session.follower=results[0].r-1;
            }
        });
        con.query("select count(*) r from friends where username='"+username+"'", (err, results) => {
            if(err) {
                console.log(err);
            } else if(results.length > 0) {
                req.session.following=results[0].r-1;
            }
        });
        con.query("select count(*) r from uploads where username='"+username+"'", (err, results) => {
            if(err) {
                console.log(err);
            } else {
                req.session.uploads=results[0].r;
            }
        });
        q="select profilepic p from profiles where username='"+username+"'";
        con.query(q, (err,results) => {
            if(err) {
                console.log(err);
            } else {
                if(results.length>0)
                    req.session.profilepic=results[0].p;
                else
                    req.session.profilepic="/img/male-icon.png";
            }
        });
      });
	next();
}); 

app.use(authRoutes);
app.use(contentRoutes);

app.listen(3000, '0.0.0.0', () => {
    console.log('connected ' + 3000);
});