const dbConnection = require("../../config/database");
const router = require("express").Router();

router.get("/approve-reject-requests-history", (req,res)=>{
    dbConnection.query(`select request_id, status from requests where status = "approved" or status = "denied"`, (error, results)=>{
        if(error){
            console.log(error)
            return res.status(500).send({
                message: "Internal Database Error"
            })
        }
        if(results){
            res.status(200).send(results)
        }
    })
})



module.exports = router