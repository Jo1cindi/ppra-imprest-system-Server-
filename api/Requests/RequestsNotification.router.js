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
          `select request_id, amount_requested, status from requests where employee_id = ? and status = "approved" or status = "denied"`,
          [result[0].employee_id],
          (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send({
                  message: "Internal Database Error",
                });
              }
            if(results){
                return res.status(200).send(results)
            }
          }
        );
      }
    }
  );
});

module.exports = router
