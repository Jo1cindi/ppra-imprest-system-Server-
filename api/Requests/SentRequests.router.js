const dbConnection = require("../../config/database");
const router = require("express").Router();

router.get("/received-requests", (req, res)=>{
    dbConnection.query(`select employee_id from requests where request_id = (select max(request_id) from requests)`,
     (error, results)=>{
        if(error){
            console.log(error)
            return res.status(500).send({
                message: "Database Error"
            })
        }
        if(results.length > 0){
            dbConnection.query(`select firstName, lastName, department from employees where employee_id = ?`, [results[0].employee_id],
             (error, result)=>{
                if(error){
                    console.log(error)
                    res.status(500).send({
                        message: "Database Error"
                    })
                }
                if(result){
                    res.status(200).send({
                        firstName: result[0].firstName,
                        lastName: result[0].lastName,
                        department: result[0].department
                    })
                }
             }
            )
        }
     }
    )

})

module.exports = router