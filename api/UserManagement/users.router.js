const dbConnection = require("../../config/database");
const router = require("express").Router();

//Getting user credentials
router.post("/user-data", (req, res) => {
  const email = req.body.email;

  dbConnection.query(
    `select firstName, lastName from employees where email = ?`,
    [email],
    (error, employee) => {
      if (error) {
        console.log(error);
        return res.status(500).send({
          message: "Internal Database Error",
        });
      }
      if (employee.length > 0) {
        res.status(200).send({
          firstName: employee[0].firstName,
          lastName: employee[0].lastName,
        });
      } else {
        dbConnection.query(
          `select firstName, lastName from accountant where email = ?`,
          [email],
          (error, accountant) => {
            if (error) {
              console.log(error);
              return res.status(500).send({
                message: "Internal Database Error",
              });
            }
            if (accountant.length > 0) {
              res.status(200).send({
                firstName: accountant[0].firstName,
                lastName: accountant[0].lastName,
              });
            } else {
              dbConnection.query(
                `select firstName, lastName from finance_manager where email = ?`,
                [email],
                (error, financeManager) => {
                  if (error) {
                    console.log(error);
                    return res.status(500).send({
                      message: "Internal Database Error",
                    });
                  }
                  if (financeManager.length > 0) {
                    res.status(200).send({
                      firstName: financeManager[0].firstName,
                      lastName: financeManager[0].lastName,
                    });
                  } else {
                    dbConnection.query(
                      `select firstName, lastName from admin where email = ?`,
                      [email],
                      (error, admin) => {
                        if (error) {
                          console.log(error);
                          return res.status(500).send({
                            message: "Internal Database Error",
                          });
                        }
                        if (admin.length > 0) {
                          res.status(200).send({
                            firstName: admin[0].firstName,
                            lastName: admin[0].lastName,
                          });
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

//Displaying Users
//Employees
router.get("/all-employees", (req, res) => {
  dbConnection.query(
    `select firstName, lastName, email, department from  employees`,
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
});

//Accountant
router.get("/all-accountants", (req, res) => {
  dbConnection.query(
    `select firstName, lastName, email from  accountant`,
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
});

//Finance Manager
router.get("/financeManager", (req, res) => {
  dbConnection.query(
    `select firstName, lastName, email from  finance_manager`,
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
});

//Remove User
router.post("/remove-user", (req, res) => {
  const email = req.body.email;

  dbConnection.query(
    `select * from accountant where email = ?`,
    [email],
    (error, accountant) => {
      if (error) {
        console.log(error);
        return res.status(500).send({
          message: "Internal Database Error",
        });
      }
      if (accountant.length > 0) {
        dbConnection.query(
          `delete from accountant where accountant_id  = ?`,
          [accountant[0].accountant_id],
          (error, results) => {
            if (error) {
              console.log(error);
              return res.status(500).send({
                message: "Internal Database Error",
              });
            }
            if(results){
              return res.status(200).send({
                message: "Deleted Successfully"
              })
            }
          }
        );
      }else{
        dbConnection.query(`select * from finance_manager where email = ?`, [email], (error, financeManager)=>{
          if (error) {
            console.log(error);
            return res.status(500).send({
              message: "Internal Database Error",
            });
          }
          if(financeManager.length > 0){
            dbConnection.query(
              `delete from finance_manager where financemanager_id  = ?`,
              [financeManager[0].financemanager_id],
              (error, results) => {
                if (error) {
                  console.log(error);
                  return res.status(500).send({
                    message: "Internal Database Error",
                  });
                }
                if(results){
                  return res.status(200).send({
                    message: "Deleted Successfully"
                  })
                }
              }
            );
          }else{
            dbConnection.query(`select * from employees where email = ?`, [email], (error, employee)=>{
              if (error) {
                console.log(error);
                return res.status(500).send({
                  message: "Internal Database Error",
                });
              }
              if(employee.length > 0){
                dbConnection.query(
                  `delete from employees where employee_id  = ?`,
                  [employee[0].employee_id],
                  (error, results) => {
                    if (error) {
                      console.log(error);
                      return res.status(500).send({
                        message: "Internal Database Error",
                      });
                    }
                    if(results){
                      return res.status(200).send({
                        message: "Deleted Successfully"
                      })
                    }
                  }
                );
              }
            })
          }
        })
      }
    }
  );
});

module.exports = router;
