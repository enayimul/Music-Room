var express = require('express');
var bodyParser = require('body-parser');
var db = require('../database');
const {conInit, con } = require('../config/connection');
var validator = require('validator');
var bcrypt = require('bcrypt-nodejs');
var router = require('../mobile-routes/settings');

router = express.Router();

router.use(bodyParser.urlencoded({
    extended: 'true'
}));

router.get('/username', (req, res) => {
    var username = req.body.username;
    var id = req.body.id;
    console.log("this is username: " + username);
    if (validator.isEmpty(username) == false && validator.isAlpha(username)) {
        con.query(`SELECT * FROM users WHERE username = ? LIMIT 1`, [username], (err, results) => {
            if (err) return res.send("An error has occured");
            if (results.length !== 0) {
                if (results[0].id == id){
                    con.query(`UPDATE users SET username = ? WHERE id = ? `, [username, id], (err, db) => {
                        if (err) return res.send("An error has occured");
                        return res.send("Username has been successfully updated");
                    })
                }else {
                    return res.send("Username already exists");
                }
            }else {
                con.query(`UPDATE users SET username = ? WHERE id = ? `, [username, id], (err, db) => {
                    if (err) return res.send("An error has occured");
                    return res.send("Username has been successfully updated");
                })
            }
        })
    }else
        return res.send("Username field is empty");
});

router.get('/email', (req, res) => {
    var email = req.body.email;
    var id = req.body.id;
    console.log("this is email: " + email);
    if(validator.isEmpty(email) == false && validator.isEmail(email)) {
        con.query(`SELECT * FROM users WHERE email = ? LIMIT 1`, [email], (err, results) => {
            if (err) return res.send("An error has occured");
            if (results.length !== 0) {
                if (results[0].id == id){
                    con.query(`UPDATE users SET email = ? WHERE id = ? `, [email, id], (err, db) => {
                        if (err) return res.send("An error has occured");
                        return res.send("Email has been successfully updated");
                    })
                }else {
                    return res.send("Email already exists");
                }
            }else {
                con.query(`UPDATE users SET email = ? WHERE id = ? `, [email, id], (err, db) => {
                    if (err) return res.send("An error has occured");
                    return res.send("Email has been successfully updated");
                })
            }
        })
    }else
        return res.send("Email field is empty");
});

router.get('/password', (req, res) => {
    if (bcrypt.compareSync(req.body.oldPassword, req.body.sessPass) === true)
    {
        con.query(`UPDATE users SET password = ? WHERE id = ?`, [req.body.password, req.body.id], (err, db) => {
            if (err) return res.send("An error has occured");
            return res.send("Password has been successfully updated");
        });
    }
    else
    {
        res.send("Old password does not match.");
    }
    
})

router.get('/profilePic', (req, res) => {
    let photo = req.body.image;
    let username = req.body.username;
    let id = req.body.id;
    let update = req.body.update;
    const sql = `UPDATE images SET imagePath = ? WHERE username = ?`;
            
    con.query(sql, [photo, username], (err, result) => {
        if (err) return res.send("An error has occured");
        req.session.photo = photo;
        console.log(result.affectedRows + " record(s) updated");
        return res.send("Profile Picture has been successfully updated");
    });
})

router.post('/profilePic', (req, res) => {
    let photo = req.body.image;
    let username = req.body.username;
    let id = req.body.id;
    let update = req.body.update;
    const sql = `INSERT INTO images(imagePath, username) VALUES (?, ?)`;
            
    con.query(sql, [photo, username], (err, result) => {
        if (err) return res.send("An error has occured");
        req.session.photo = photo;
        console.log('1 Document inserted');
        return res.send("Profile Picture has been successfully updated");
    });
})

module.exports = router;