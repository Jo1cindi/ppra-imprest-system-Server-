const dbConnection = require("../../config/database");
const router = require("express").Router();

router.get("/received-requests", (req, res) => {
  dbConnection.query(
    `select request_id, amount_requested, reason, request_date , employee_id from requests where status = ''`,
    (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).send({
          message: "Database Error",
        });
      }
      if (results.length > 0) {
        res.status(200).send(results);
      }
    }
  );
});

router.post("/approve-request", (req, res) => {
  const approved = req.body.approved;
  dbConnection.query(
    `select request_id from requests where status = ''`,
    (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).send({
          message: "Database Error",
        });
      }
    }
  );
});

module.exports = router;
