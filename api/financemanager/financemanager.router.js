const dbConnection = require("../../config/database")
const router = require("express").Router();


router.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const password = req.body.password;

  dbConnection.query(
    `insert into finance_manager(firstName, lastName, email, phoneNumber, password) values(?,?,?,?,?)`,
    [firstName, lastName, email, phoneNumber, password],
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
        data: result
    })
    }
  );
});

module.exports = router;
