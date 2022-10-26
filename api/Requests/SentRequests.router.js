const dbConnection = require("../../config/database");
const router = require("express").Router();

router.get("/received-requests", (req, res) => {
  dbConnection.query(
    `select request_id, request_date, employee_id  from requests where status = ''`,
    (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).send({
          message: "Database Error",
        });
      }
      if (results.length > 0) {
        return res.status(200).send(results);
      }
    }
  );
});

router.post("/get-request-details", (req, res) => {
  const request_id = req.body.requestId;
  const employee_id = req.body.employeeId;
  dbConnection.query(
    `select amount_requested, reason from requests where request_id = ?`,
    [request_id],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send({
          message: "Database Error",
        });
      }
      if (results.length > 0) {
        dbConnection.query(
          `select firstName, lastName, department from employees  where employee_id= ?`,
          [employee_id],
          (error, result) => {
            if (error) {
              console.log(error);
              res.status(500).send({
                message: "Database Error",
              });
            }
            if(result.length > 0){
              res.status(200).send({
                firstName: result[0].firstName,
                lastName: result[0].lastName,
                department: result[0].department,
                amount: results[0].amount_requested,
                reason: results[0].reason
              })
            }
          }
        );
      }
    }
  );
});



module.exports = router;
