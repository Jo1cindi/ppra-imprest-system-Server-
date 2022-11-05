const dbConnection = require("../../config/database");
const router = require("express").Router();

//Loading receipts
router.post("/load-receipts", (req, res) => {
  const email = req.body.email;

  dbConnection.query(
    `select employee_id, firstName, lastName, department from employees where email = ?`,
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
          `select request_id, amount_requested, reason, request_date from requests where employee_id = ? and allocation_status = "allocated"`,
          [result[0].employee_id],
          (error, results) => {
            if (error) {
              console.log(error);
              return res.status(500).send({
                message: "Internal Database Error",
              });
            }
            if(results){
                return res.status(200).send([result, results]); 
            }
          }
        );
      }
    }
  );
});

router.post("/get-receipt-details", (req, res) => {
  const employeeId = req.body.employeeId;
  const requestId = req.body.requestId;


  dbConnection.query(
    `select accountant_id, date from fund_allocations where employee_id = ? and request_id = ?`,
    [employeeId, requestId],
    (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).send({
          message: "Internal Database Error",
        });
      }
      if (result) {
        dbConnection.query(
          `select firstName, lastName from accountant where accountant_id =?`,
          [result[0].accountant_id],
          (error, results) => {
            if (error) {
              console.log(error);
              return res.status.send({
                message: "Internal Database Error",
              });
            }
            if (results) {
              return res.status(200).send([results, [result[0].date]]);
            }
          }
        );
      }
    }
  );
});
module.exports = router;
