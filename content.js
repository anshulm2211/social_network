var express = require('express');
var router = express.Router();
const mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "db",
    multipleStatements: true
});

var trig,
    q;

router.get('/home', isLoggedin,(req, res) => {
    var username = req.user;
    con.query("select * from profiles where username='"+username+"'", (err, results) => {
        if(err) {
            console.log(err);
        } else  if(results.length>0) {
            q = "select url,title,p.username,p.profilepic,u.uploadid,curtime from uploads u,profiles p,friends f where f.username='"+username+"' and added=u.username and added=p.username order by curtime asc";
            var q1 = "select commentid,c.username,message,uploadid,profilepic,curtime from comments c,profiles p where c.username=p.username;"+q;
            con.query(q1, (err, results, fields) => {
                if(err) {
                    console.log(err);
                } else {
                    res.render("home", {           
                        results: results,
                        message: req.flash('message')
                    });
                }
            })
        } else {
            res.redirect('/profile');
        }
    }); 
});

router.post('/home/delete/:id', (req,res) => {
    q = "delete from uploads where uploadid = "+ req.params.id;
    con.query( q, (err,result) => {
        if(err) {
            console.log(err);
            req.flash('message',err.sqlMessage);
            res.redirect('/home');
        } else {
            req.flash('message','Post Successfully Deleted')
            res.redirect('/home');
        }
    })
});

router.get('/home/update/:id', (req,res) => {
    q = "select * from uploads where uploadid = "+ req.params.id;
    con.query( q, (err,results) => {
        if(err) {
            console.log(err);
            req.flash('message',err.sqlMessage);
            res.redirect('/home');
        } else {
            res.render('updateUpload', {
                results: results,   
                message: []
            });
        }
    })
});

router.post('/home/update/:id', (req,res) => {
    q= "update uploads set title='"+req.body.title+"',url='"+req.body.url+"' where uploadid="+req.params.id;
    console.log(q);
    con.query(q, (err, results) => {
        if(err) {
            console.log(err);
            req.flash('message',err.sqlMessage);
            res.redirect('/home');
        } else {
            req.flash('message','Post Successfully Updated');
            res.redirect('/home');
        }
    });
});

router.post('/home/comment/add/:id', (req, res) => {
    var username = req.user;
    q="insert into comments(username,message,uploadid)  values('"+username+"','"+req.body.comment+"','"+req.params.id+"')";
    // console.log(q);
    con.query(q, (err,results) => {
        if(err) {
            console.log(err);
            req.flash('message',err.sqlMessage);
            res.redirect('/home');
        } else {
            req.flash('message','Commented');
            res.redirect('/home');
        }
    })
});

router.post('/home/comment/delete/:id', (req, res) => {
    q="delete from comments where commentid='"+ req.params.id +"'";
    // console.log(q);
    con.query(q, (err,results) => {
        if(err) {
            console.log(err);
            req.flash('message',err.sqlMessage);
            res.redirect('/home');
        } else {
            req.flash('message','Comment Deleted');
            res.redirect('/home');
        }
    })
});

router.get('/upload', isLoggedin, (req,res) => {
        res.render('upload',{
            message: [],
        });
});
router.post('/upload', (req,res) => {
    var username = req.user;
    q = "insert into uploads(username,title,url) values('"+username+"','"+req.body.title+"','"+req.body.url+"')";
    // console.log(q);
    con.query(q, (err, results,fields) => {
        if(err) {
            console.log(err);
            req.flash('message',err.sqlMessage);
            res.redirect('/home');
        } else {
            // console.log(results);
            req.flash('message','Post Uploaded');
            res.redirect('/home');
        }
    });   
});

router.get('/friend', isLoggedin,  (req, res) => {
    var username = req.user;
    q = "select added,profilepic,friendid from friends f,profiles p where f.username = '" + username + "' and f.added=p.username";
    con.query(q, (err, results) => {
        if(err) {
            console.log(err);
            req.flash('message',err.sqlMessage);
            res.redirect('/home');
        } else {
            if(results.length > 0) {
                res.render('friend',{ 
                    message: req.flash('message'),
                    results: results
                });
            } else {
                res.redirect('/home');
            }
        }
    })
});

router.post('/friends/delete/:id', (req,res) => {
    con.query('delete from friends where friendid = ?', req.params.id, (err, results) => {
        if(err) {
            console.log(err);
            req.flash('message',err.sqlMessage);
            res.redirect('/home');
        } else {
            req.flash('message','Unfollowed');
            res.redirect('/friend');
        }
    })
});

router.post('/friends/add/:id', (req,res) => {
    var username = req.user;
    q="insert into friends(username,added) values('"+username+"','"+req.params.id+"')";
    con.query(q, (err, results) => {
        if(err) {
            console.log(err);
            req.flash('message',err.sqlMessage);
            res.redirect('/home');
        } else {
            req.flash('message','Followed');
            res.redirect('/friend');
        }
    })
});

router.post('/addFriend', (req, res) => {
    var username = req.user;
    if(username !== req.body.search) {
        con.query('select profilepic,username from profiles where username = ?', req.body.search, (err, results) => {
            if(err) {
                console.log(err);
                req.flash('message',err.sqlMessage);
                res.redirect('/home');
            } else {
                if(results.length > 0) {
                    res.render('addFriend',{           
                        results: results,
                        message: []
                    });
                } else {
                    req.flash('message','Friend Not Found');
                    res.redirect('/home');
                }
            }
        })
    } else {
        req.flash('message',"You can't search yourself!");
        res.redirect('/home');
    }
});

router.get('/follower', isLoggedin, (req,res) => {
    var username = req.user;
    q="select profilepic,added,f.username from friends f,profiles p where added='"+username+"' and f.username=p.username";
    // console.log(q);
    con.query(q, (err,results) => {
        if(err) {
            console.log(err);
        } else {
            // console.log(results);
            res.render('follower',{
                results: results,
                message: []
            });
        }
    });
});

router.get('/profile', isLoggedin, (req,res) => {
    var username=req.user;
    q = "select *,DATE_FORMAT(dateborn, '%d/%m/%Y') d from profiles where username = ?";
    con.query(q, username, (err, results, fields) => {
        if(err) {
            console.log(err);
            req.flash('message',err.sqlMessage);
            res.redirect('/home');
        } else {
            if(results.length > 0) {
                res.render('profile', {
                    results: results,              
                    message: req.flash('message')
                });        
            } else {
                req.flash('message','Create Your Profile');
                res.redirect('/profile/create');
            }
        }
    })
});

router.get('/profile/create', isLoggedin, (req,res) => {
    res.render('createProfile', {
        message: req.flash('message')
    });
});

router.get('/profile/update', isLoggedin,  (req,res) => {
    var username = req.user;
    q = "select *,DATE_FORMAT(dateborn, '%d/%m/%Y') d from profiles where username = ?";
    con.query(q, username, (err, results, fields) => {
        if(err) {
            console.log(err);
            req.flash('message',err.sqlMessage);
            res.redirect('/home');
        } else {
            if(results.length > 0) {
                res.render('updateProfile', {
                    results: results,
                    message: []
                });        
            } else {
                req.flash('message',[]);
                res.redirect('/profile');
            }
        }
    })
    
});

router.post('/profile/edit', (req, res) => {
    var username = req.user;
    var details = {  
        username: username,
        fullname: req.body.fullname,
        profilepic: req.body.profilepic,
        phone: req.body.phone,
        address: req.body.address,
        gender: req.body.gender,
        placeborn: req.body.placeborn,
        dateborn: req.body.dateborn,
        job: req.body.job,
        institution: req.body.institution,
    }
    q="select timestampdiff(year,'"+ req.body.dateborn+ "',current_timestamp) d";
    con.query(q,(err,results) => {
        if(err) {
            console.log(err);
        } else {          
            trig = {
                username: username,
                age: results[0].d
            }
            con.query('insert into age set ?',trig,(err,results) => {
                if(err) {
                    console.log(err);
                    if(err.sqlState === '45000') {
                        con.query("delete from register where username='"+username+"'", (err,results) => {
                            if(err) {
                                console.log(err);
                            } else {
                                req.flash('message','Your Account is Deleted Because Your age is less then 18');
                                res.redirect('/register');
                            }
                        });
                    }
                } else {
                    con.query('insert into profiles set ?', details, (err, results, fields) => {
                        if(err) {
                            req.flash('message',err.sqlMessage);
                            res.redirect('/home');
                        } else {
                            req.flash('message','Profile Created');
                            res.redirect('/profile');
                        }
                    });
                }
            });
        }
    });   
});

router.post('/profile/update', (req, res) => {
    var username = req.user;
    var  details = {  
        fullname: req.body.fullname,
        profilepic: req.body.profilepic,
        phone: req.body.phone,
        address: req.body.address,
        gender: req.body.gender,
        placeborn: req.body.placeborn,
        dateborn: req.body.dateborn,
        job: req.body.job,
        institution: req.body.institution
    }
    q= "update profiles set ? where username='"+username+"'";
    con.query(q, details, (err, results, fields) => {
        if(err) {
            req.flash('message',err.sqlMessage);
            res.redirect('/home');
        } else {
            // res.send("successful");
            req.flash('message','Updated Profile');
            res.redirect('/profile');
        }
    })   
});

router.post('/account/delete' , (req,res) => {
    con.query("delete from register where username='"+req.user+"'", (err,results) => {
        if(err) {
            req.flash('message',err,sqlMessage);
        } else {
            req.flash('message','Account Deleted');
            res.redirect('/register');
        }
    })
});

router.get('/todo', isLoggedin, (req,res) => {
    var username = req.user;
    con.query('select * from todo where username = ?', username, (err, results, fields) => {
        if(err) {
            console.log(err);
            req.flash('message','Login to Access');
            res.redirect('/login');
            // res.send(err);
        } else {
            if(results.length > 0) {
                res.render('todo', {
                    results: results,              
                    message: req.flash('message')
                });
                // console.log(results);
            } else {
                res.redirect('/createTodo');
            }
        }
    })
    // res.render('todo', {username: username});
});

router.post('/todo', (req,res) => {
    var username = req.user;
    q="insert into todo(username,message) values('"+username+"','"+req.body.message+"')";
    con.query(q, (err, results, fields) => {
        if(err) {
            req.flash('message',err.sqlMessage);
            res.redirect('/home');
            console.log(err);
        } else {
            // res.send("successful");
            req.flash('message','To-Do Created');
            res.redirect('/todo');
        }
    })   
});

router.get('/createTodo', isLoggedin,(req,res) => {
        res.render('createTodo', {
          
            message: req.flash('message')
        });
});

router.post('/todo/:id', (req, res) => {
    var id = req.params.id;
    // res.send('hello');
    q="delete from todo where id="+id; 
    // console.log(q+' id '+id);
    con.query( q, (err, results,) => {
        if(err) {
            req.flash('message',err.sqlMessage);
            res.redirect('/home');
        } else {
            req.flash('message','To-Do Deleted');
            res.redirect('/todo');
        }
    })
});

router.get('/feedback', isLoggedin, (req,res) => {
        res.render('feedback', {
            message: []
        });
});

router.post('/feedback', (req, res) => {
    var username = req.user;
    q="insert into feedback(username,feedback) values('"+username+"','"+req.body.feedback+"')";
    // console.log(q);
    con.query(q, (err, results) => {
        if(err) {
            console.log(err);
            req.flash('message','Login to Access');
            res.redirect('/login');
        } else {
            req.flash('message','Feedback Submitted Successfully');
            res.redirect('/home');
        }
    })
});

router.get('/database', isLoggedin, (req, res) => {
        res.render('database', {
            message: req.flash('message')
        });
});

router.post('/database/output', (req,res) => {
    q=req.body.query;
    con.query(q, (err,results) => {
        if(err) {
            console.log(err);
            req.flash('message',err.sqlMessage);
            res.redirect('/database');
        } else if(results.length>0){
            res.render('output', {
                results: results,        
                message: req.flash('message',results)  
            });
        } else {
            req.flash('message',JSON.stringify(results));
            res.redirect('/database');
        }
    })
});

router.post('/database/sp/output', (req,res) => {
    q="call "+req.body.table+"()";
    con.query(q, (err,results) => {
        if(err) {
            console.log(err);
            req.flash('message',err.sqlMessage);
            res.redirect('/database');
        } else {
            // console.log(JSON.stringify(results[0]));
            res.render('output', {
                results: results[0],            
                message: []
           });
        }
    })
});

router.get('/database/output', (req,res) => {
        res.render('output', {
            message: []     
        });
});

router.get('/logout', (req,res) => {
    req.logout();
    res.redirect('/login');
});

function isLoggedin(req,res,next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/logout');
}

module.exports = router;