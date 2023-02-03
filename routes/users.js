const path = require('path');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const transporter = require('./../utils/sendMail');
const express = require('express'),
  router = express.Router();

const { sendMailFunc } = require('../utils/sendMail');


const db = require('./../database');
const { Console } = require('console');

router.get('/customerRegistration', (req, res) => {
    return res.sendFile(path.join(__dirname, "./../views/customerRegister.html"));
})

router.get('/adminRegistration', (req, res) => {
    return res.sendFile(path.join(__dirname, "./../views/adminRegister.html"));
})

router.get('/login', (req, res) => {
    return res.sendFile(path.join(__dirname, "./../views/login.html"));
})


router.post("/custRegister", (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    role
  } = req.body;

  if (!email || !first_name || !last_name || !password) {
    return res.status(422).json({ error: "please fill all field" });
  } else {
    db.query(
      "SELECT email FROM users WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) {
          return console.log(err);
        }
        if (result.length > 0) {
          return res.status(422).json({ error: "Email id already exist" });
        } else {
          let hashedpassword = await bcrypt.hash(password, 9);
          db.query(
            "INSERT INTO users (first_name, last_name, email, password, role ) values (?,?,?,?,?)",
            [first_name, last_name, email, hashedpassword, role],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                const mailOptions = {
                  from: process.env.MAIL_USERNAME,
                  to: email,
                  subject: "confirm your email.",
                  html: `<div></div><h2>confirm your email address</h2><a href="http://localhost:5000/users/verify?token=${hashedpassword}">http://localhost:5000/users/verify?token=${hashedpassword}</a></div>`,
                };
                transporter.sendMail(mailOptions, function (err, res) {
                  if (err) {
                    console.error("there was an error: ", err);
                  } else {
                    console.log("here is the res: ", res);
                  }
                });

                return res
                  .status(200)
                  .json({ msg: "Verify your email address !!" });
              }
            }
          );
        }
      }
    );
  }
});

router.get("/verify", (req, res) => {
  let verificationToken = req.query?.token;
  if (verificationToken) {
    db.query(
      "UPDATE users SET isEmailVerified=1 WHERE password=?;",
      [verificationToken],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          return res.status(200).json({ msg: "email address verified!!" });
        }
      }
    );
  }
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "please fill all fields" });
  } else {
    db.query(
      "SELECT email FROM users WHERE email = ?",
      [email],
      (err, result) => {
        if (err) {
          return console.log(err);
        } else {
          if (result.length <= 0) {
            return res
              .status(422)
              .json({ emailerror: "Invalid username or password" });
          } else {
            db.query(
              "SELECT * FROM users WHERE email = ?",
              [email],
              (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  if (result[0].isEmailVerified === 0)
                    res.status(401).json({
                      msg: "please verify you email address from inbox",
                    });
                  else if (result[0].role === 0)
                    res
                      .status(401)
                      .json({ msg: "Customer is not allowed to login from here" });
                  else {
                    bcrypt
                      .compare(password, result[0].password)
                      .then((doMatch) => {
                        if (doMatch) {
                          const token = jwt.sign(
                            { is_admin: result[0].role },
                            JWT_SECREAT_KEY
                          );
                          const { role, first_name, last_name, email } =
                            result[0];

                          res.status(200).json({
                            token,
                            user: { role, first_name, last_name, email },
                          });
                        } else {
                          return res
                            .status(422)
                            .json({ error: "Invalid Username or Password" });
                        }
                      });
                  }
                }
              }
            );
          }
        }
      }
    );
  }
});

module.exports = router;
