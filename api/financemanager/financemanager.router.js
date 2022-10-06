const dbConnection = require("../../config/database");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/financemanager-signup", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const password = req.body.password;

  dbConnection.query(
    `select * from finance_manager where email = ? and phoneNumber = ?`,
    [email, phoneNumber],
    (err, result) => {
      if (result.length) {
        res.status(409).send({
          message: "this user exists",
        });
      } else {
        bcrypt.hash(password, 10).then((encryptedPassword) => {
          dbConnection.query(
            `insert into finance_manager(firstName, lastName, email, phoneNumber, password) values(?,?,?,?,?)`,
            [firstName, lastName, email, phoneNumber, encryptedPassword],
            (err, result) => {
              if (err) {
                console.log(err);
                return res.status(500).json({
                  success: 0,
                  message: "Database Connection Error",
                });
              }
              return res.status(200).json({
                success: 1,
                data: result,
              });
            }
          );
        });
      }
    }
  );
});

router.post("/financemanager-login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //checking for email
  dbConnection.query(
    `select * from finance_manager where email = ?`,
    [email],
    (err, result) => {
      if (err) {
        return res.status(400).send({
          message: "error",
        });
      }
      if (!result.length) {
        return res.status(401).send({
          message: "ëmail or password is incorrect",
        });
      } else if (result.length > 0) {
        const compare = bcrypt.compareSync(password, result[0].password);
        if (compare) {
          // const jwtExpirySeconds = 300
          const token = jwt.sign(
            { id: result[0].financemanager_id.toString() },
            `${process.env.JWT_SECRET_KEY}`,
            { expiresIn: "2h" }
          );
          dbConnection.query(
            `update finance_manager set lastLogin = now() where financemanager_id = ?`,
            result[0].financemanager_id
          );
          return res.status(200).send({
            message: "Log in successful!",
            token,
            firstName: result[0].firstName,
            lastName: result[0].lastName,
            email: result[0].email
          });
        } else {
          return res.status(401).send({
            message: "ëmail or password is incorrect",
          })
        }
      }
    }
  );
});

//Reset password
router.put("/financemanager-reset", (req, res)=>{
  const email = req.body.email
  const newPassword = req.body.password;
  bcrypt.hash(newPassword, 10).then((encryptedPassword)=>{
   dbConnection.query(`update finance_manager set password = ? where email = ?`,[encryptedPassword, email], 
   (err, result)=>{
     if(err){
      res.status(500).send({
        message: "error"
      });
     }
     if(result){
      res.status(200).send({
        message: "password updated successfully"
      });
     }
   });
  });
});

module.exports = router;
