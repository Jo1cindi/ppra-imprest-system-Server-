const dbConnection = require("../../config/database");
const router = require("express").Router();

router.post("/total-spent", (req, res) => {
  const month = req.body.month;
  const year = req.body.year;
  dbConnection.query(
    `select sum(amount) from fund_allocations where month = ?`,
    [month],
    (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).send({
          message: "Internal database error",
        });
      }
      if (results) {
        dbConnection.query(
          `select sum(amount) from fund_allocations where year = ?`,
          [year],
          (error, result) => {
            if (error) {
              console.log(error);
              return res.status(500).send({
                message: "Internal database error",
              });
            }
            if (result) {
              return res.status(200).send([results, result]);
            }
          }
        );
      }
    }
  );
});

router.post("/petty-cash-record", (req, res) => {
  const month = req.body.month;
  const year = req.body.year;

  dbConnection.query(
    `select date, reason, amount from fund_allocations where month = ? and year =?`,
    [month, year],
    (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).send({
          message: "Internal database error",
        });
      }
      if (results) {
        return res.status(200).send(results);
      }
    }
  );
});

module.exports = router;
