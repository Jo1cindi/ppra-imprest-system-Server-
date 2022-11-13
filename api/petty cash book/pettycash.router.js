const dbConnection = require("../../config/database");
const router = require("express").Router();

//Setting initial balance
router.post("/set-initial-amount", (req, res) => {
  const initialAmount = req.body.initialAmount;
  const month = req.body.month;
  const year = req.body.year;
  const accountantId = req.body.accountantId;

  dbConnection.query(
    `select initialamount from pettycashfund where month = ? and year = ?`,
    [month, year],
    (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).send({
          message: "Internal Database Error",
        });
      }
      if (result.length > 0) {
        return res.status(409).send({
          message: "Intial Amount for this month already set",
        });
      } else {
        dbConnection.query(
          `insert into pettycashfund(initialamount, month, year, accountant_id) values (?,?,?,?)`,
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
      }
    }
  );
});

//Loading  petty cash records
router.post("/petty-cash-records", (req, res) => {
  const month = req.body.month;
  const year = req.body.year;

  dbConnection.query(
    `select initialamount from pettycashfund where month = ? and year = ?`,
    [month, year],
    (error, initialAmount) => {
      if (error) {
        console.log(error);
        return res.status(500).send({
          message: "Internal  Database Error",
        });
      }
      if (initialAmount) {
        dbConnection.query(
          `select ( select sum(amount) from fund_allocations where month = ? and year = ? ) as totalInAMonth`,
          [month, year],
          (error, totalAmountAllocated) => {
            if (error) {
              console.log(error);
              return res.status(500).send({
                message: "Internal  Database Error",
              });
            }
            if (totalAmountAllocated) {
              dbConnection.query(
                `select(select sum(amount) from fund_allocations where year = ${year}) as totalInAYear`,
                (error, totalInAYear) => {
                  if (error) {
                    console.log(error);
                    return res.status(500).send({
                      message: "Internal Database Error",
                    });
                  }
                  if (totalAmountAllocated) {
                    dbConnection.query(
                      `select(select initialamount from pettycashfund where month = ${month} and year = ${year}) - (select sum(amount) from fund_allocations where month = ${month} and year = ${year}) as balance`,
                      (error, balance) => {
                        if (error) {
                          console.log(error);
                          return res.status(500).send({
                            message: "Internal  Database Error",
                          });
                        }
                        if (balance) {
                          dbConnection.query(
                            `update pettycashfund set balance = ? where month = ${month} and year = ${year}`,
                            [balance[0].balance],
                            (error, result) => {
                              if (error) {
                                console.log(error);
                                return res.status(500).send({
                                  message: "Internal  Database Error",
                                });
                              }
                              if (result) {
                                return res.status(200).send([
                                  {
                                    initialAmount:
                                      initialAmount[0].initialamount,
                                    totalAmountAllocated:
                                      totalAmountAllocated[0].totalInAMonth,
                                    totalInAYear: totalInAYear[0].totalInAYear,
                                    balance: balance[0].balance,
                                  },
                                ]);
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

//Loading Fund Allocations
router.post("/load-fund-allocations", (req, res) => {
  const month = req.body.month;
  const year = req.body.year;

  dbConnection.query(
    `select amount, reason, date from fund_allocations where month = ${month} and year = ${year}`,
    (error, result) => {
      if(error){
        console.log(error)
        return res.status(500).send({
          message: "Internal Database Error"
        })
      }
      if(result){
        return res.status(200).send(result)
      }
    }
  );
});


//Getting balance
router.post("/get-balance", (req, res)=>{
  const month = req.body.month
  const year = req.body.year

  dbConnection.query(`select balance from pettycashfund where month = ${month} and year=${year}`, (error, result)=>{
    if(error){
      res.status(500).send({
        message: "Internal Database Error"
      })
    }
    if(result){
      res.status(200).send({
        balance: result[0].balance
      })
    }
  })
})

module.exports = router;
