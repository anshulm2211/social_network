var express = require('express');
var router = express.Router();
const mysql = require('mysql');
var passport = require('passport');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "db",
    multipleStatements: true
});



router.get("/", (req,res) => {
    res.render('landing');
});


router.get('/login', (req,res) => {
    // username=null;
    profilepic="/img/male-icon.png";
    res.render("login",{ message: req.flash('message') });
});


router.post('/login',passport.authenticate('local-login',{ 
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
})  
);

router.get('/register', (req, res) => {
    q="select feedback,f.username,curdate,profilepic from feedback f,profiles p where f.username=p.username order by curdate desc";
    // console.log(q);
    con.query(q, (err,results) => {
        if(err) {
            console.log(err);
        } else {
            res.render('register', {
                results: results,
                message: req.flash('message')
            });
        }
    })    
});

router.post('/register' , (req,res) => {
    var users={
        "email": req.body.email,
        "username": req.body.username,
        "password": req.body.password
    }
    con.query('INSERT INTO register SET ?', users, function (error, results, fields) {
      if (error) {
        console.log("error ocurred ",error);
        req.flash('message',error.sqlMessage);
        res.redirect('/register');
      }else{
        q="insert into friends(username,added) values('"+req.body.username+"','"+req.body.username+"')";
        con.query(q, (err,results) => {
            if(err) {
                console.log(err);
            } else {
                console.log(results);
            }
        });
        req.flash('message','Successfully Register!');
        res.redirect("/login");
      }
    });
});

module.exports = router;