const dbConnection = require("../../config/database");
const router = require("express").Router();

//view total spent in a year and month
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

//petty cash records
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

//Setting initial balance
router.post("/set-initial-amount", (req, res) => {
  const initialAmount = req.body.initialAmount;
  const month = req.body.month;
  const year = req.body.year;
  const accountantId = req.body.accountantId;

  dbConnection.query(
    `insert into pettycashfund(initialamount, month, year, accountant_id) values (?,?,?,?,?)`,
    [initialAmount, month, year, accountantId],
    (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).send({
          message: "Internal database error",
        });
      }

      if (result) {
        return res.status(200).send({
          message: "Data updated successfully",
        });
      }
    }
  );
});

//Loading the petty cash monthly balance
router.post("/load-balance", (req, res) => {
  const month = req.body.month;
  const year = req.body.year;

  dbConnection.query(
    `select balance from pettycashfund where month = ? and year = ?`,
    [month, year],
    (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({
              message: "Internal database error",
            });
          }
    
          if (result) {
            return res.status(200).send({
              balance: result[0].balance
            });
          }
    }
  );
});

module.exports = router;
