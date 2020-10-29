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

router.get('/', (req, res) => {
    var uniqueToken = req.body.uniqueToken;
    var deviceOS = req.body.deviceOS;
    if (uniqueToken !== undefined && deviceOS !== undefined) {
        con.query(`SELECT * FROM deviceManager WHERE deviceToken = ?`, [uniqueToken], (err, result) => {
            if (err) return res.send(`An error has occured`);
            if (result.length === 1) {
                con.query("SELECT * FROM users WHERE username = ?", [result[0].username], (err, user) => {
                    if (err)
                        res.send("An error has occured");
                    else if (user.length > 0)
                    {
                        con.query("SELECT * FROM images WHERE username = ? LIMIT 1", [result[0].username], (err, results) => {
                            if (err)
                                res.send("An error has occured");
                            res.send({user, results});
                        })
                    }
                    else
                    {
                        res.send("No user found");
                    }
                })
            }else if (result.length > 1)
            {
                return res.send('The user logged in to more than one account');
            }else{
                return res.send('The user is not linked to an account');
            }
        });
    }
})

module.exports = router;