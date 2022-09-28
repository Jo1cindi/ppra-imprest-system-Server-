const dbConnection = require("../config/database");

const addEmployee = (res, req) =>{
    const firstName = req.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const password = req.body.password;
  
    dbConnection.query(
      `insert into employees(firstName, lastName, email, phoneNumber, password) values(?,?,?,?,?)`,
      [firstName, lastName, email, phoneNumber, password],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: 0,
            message: "Database Connection Error",
          });
        }
        return res.json({
          success: 1,
          data: result
      })
      }
    );
}

module.exports = addEmployee;