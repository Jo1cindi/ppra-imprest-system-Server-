const dbConnection = require("../../config/database");
const router = require("express").Router();

router.post("/send-request", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const department = req.body.department;
  const date = req.body.date;
  const amount = req.body.amount;
  const reason = req.body.reasonForRequest;

  dbConnection.query(
    `select * from employees where email = ?`,
    [email],
    (error, result) => {
      if (error) {
        return res.status(400).send({
          message: "error",
        });
      }
      if (!result.length) {
        return res.status(401).send({
          message: "incorrect email address",
        });
      } else if (result.length > 0) {
        dbConnection.query(
          `insert into requests(request_date, amount_requested, reason, employee_id) values(?,?,?,?)`,
          [date, amount, reason, result[0].employee_id],
          (err, results) => {
            if (err) {
              console.log(err);
              return res.status(500).json({
                success: 0,
                message: "Database Connection Error",
              });
            }
            return res.status(200).send({
              success: 1,
              data: results,
            });
          }
        );
      }
    }
  );
});

//Get Request
router.post("/view-requests", (req, res) => {
  const email = req.body.email;

  dbConnection.query(
    `select * from employees where email = ?`,
    [email],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).send({
          message: "error",
        });
      }
      if (!result.length) {
        res.status(401).send({
          message: "employee does not exist",
        });
      } else if (result.length > 0) {
        dbConnection.query(
          "select reason, request_date, amount_requested from requests where employee_id = ?",
          [result[0].employee_id],
          (err, result) => {
            if (err) {
              console.log(err);
              res.status(400).send({
                message: "error",
              });
            }
            return res.status(200).send({
              data: result
            })
          }
        );
      }
    }
  );
});

module.exports = router;
