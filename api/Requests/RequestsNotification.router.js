const dbConnection = require("../../config/database");
const router = require("express").Router();

//Load Requests Notification
router.post("/load-notifications", (req, res) => {
  const email = req.body.email;
  dbConnection.query(
    `select employee_id from employees where email = ?`,
    [email],
    (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).send({
          message: "Internal Database Error",
        });
      }
      if (result) {
        dbConnection.query(
          `select request_id, amount_requested, status from requests where employee_id = ? and status Is Not Null and status <> '' and notificationStatus Is Null`,
          [result[0].employee_id],
          (error, results) => {
            if (error) {
              console.log(error);
              return res.status(500).send({
                message: "Internal Database Error",
              });
            }
            if (results) {
              return res.status(200).send(results);
            }
          }
        );
      }
    }
  );
});

router.post("/view-notification", (req, res) => {
  const requestId = req.body.requestId;
  const viewed = req.body.viewed;

  dbConnection.query(
    `update requests set notificationStatus = ? where request_id = ?`,
    [viewed, requestId],
    (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).send({
          message: "Internal Database Error",
        });
      }
      if (result) {
        return res.status(200).send({
          message: "Notification Status successfully updated",
        });
      }
    }
  );
});

router.post("/viewed-notifications", (req, res) => {
  const email = req.body.email;

  dbConnection.query(
    `select employee_id from employees where email = ?`,
    [email],
    (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).send({
          message: "Internal Database Error",
        });
      }
      if (results) {
        dbConnection.query(
          `select amount_requested, status from requests where employee_id = ? and notificationStatus = "viewed"`,
          [results[0].employee_id],
          (error, result) => {
            if (error) {
              console.log(error);
              return res.status(500).send({
                message: "Internal Database Error",
              });
            }
            if (result) {
              return res.status(200).send(result);
            }
          }
        );
      }
    }
  );
});

//Accountant Notifications
router.get("/accountant-notifications", (req, res) => {
  dbConnection.query(
    `select employee_id, request_id , amount_requested, request_date, reason, status from requests where status = "approved"`,
    (error, results) => {
      if (error) {
        console.log(error);
        return res.status(200).send({
          message: "Internal database error",
        });
      }
      if (results) {
        return res.status(200).send(results);
      }
    }
  );
});

//Request details
router.post("/approved-request-details", (req, res) => {
  const employeeId = req.body.employeeId;

  dbConnection.query(
    `select firstName, lastName, email, department from employees where employee_id = ?`,
    employeeId,
    (error, result) => {
      if(error){
        console.log(error)
        res.status(500).send({
         message: "Internal Database Error"
        })
      }
      if(result){
        return res.status(200).send({
          firstName : result[0].firstName,
          lastName: result[0].lastName,
          department: result[0].department
        })
      }
    }
  );
});
module.exports = router;
