const dbConnection = require("../../config/database");
const router = require("express").Router();

router.put("/approve-request", (req, res) => {
  const approved = req.body.approved;
  const requestId = req.body.requestId;
  dbConnection.query(
    `update requests set status = ? where request_id = ?`,
    [approved, requestId],
    (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).send({
          message: "Database Error",
        });
      }
      if (results) {
        return res.status(200).send({
          message: "Request approved",
        });
      }
    }
  );
});

router.put("/deny-request", (req, res) => {
  const denied = req.body.denied;
  const requestId = req.body.requestId;

  dbConnection.query(
    `update requests set status = ? where request_id = ?`,
    [denied, requestId],
    (error, results) => {
        if(error){
            console.log(error)
            return res.status(500).send({
                message: "Database Error"
            })
        }
        if(results){
            return res.status(500).send({
                message: "Request Denied"
            })
        }
    }
  );
});

module.exports = router;
