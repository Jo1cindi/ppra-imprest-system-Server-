const dbConnection = require("../../config/database");
const router = require("express").Router();
let async = require("async")

// //Mpesa
const Mpesa = require("mpesa-api").Mpesa;
require("dotenv").config();

const credentials = {
  clientKey: process.env.CLIENT_KEY,
  clientSecret: process.env.CLIENT_SECRET,
  initiatorPassword: process.env.INITIATOR_PASSWORD,
  securityCredential: process.env.SECURITY_CREDENTIALS,
  certificatePath: null,
};

// //environment
const environment = "sandbox";
//Create a new instance of the api
const mpesa = new Mpesa(credentials, environment);

router.post("/cb", (req,res)=>{
  console.log("---callback request")
  let response = req.body.Result
  res.status(200).json(response)
  if(response.ResultParameters){
    response.ResultParameters = response.ResultParameters.ResultParameter
  }
  if(response.ReferenceData){
    response.ReferenceData = response.ReferenceData.ReferenceItem
  }
  console.log(response)
} )
router.post("/send-money", (req, res) => {
  const employee_id = req.body.employee_id;

  dbConnection.query(
    `select phoneNumber from employees where employee_id = ?`,
    [employee_id],
    (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).send({
          message: "Internal Database Error",
        });
      }
      if (result) {
        mpesa
          .b2c({
            Initiator: "testapi",
            Amount: 10,
            PartyA: 600982,
            PartyB: result[0].phoneNumber,
            QueueTimeOutURL:
            "https://ba14-197-237-75-112.in.ngrok.io/api/record-transaction",
            ResultURL:
              "https://ba14-197-237-75-112.in.ngrok.io/api/cb",
            CommandID: "BusinessPayment",
          })
          .then((response) => {
            console.log({Result: response});
          })
          .catch((error) => {
            console.log(error);
          });
          return res.status(200).send(result)
      }
    }
  );
});
//callback


router.post(
  "/record-transaction",
  (req, res) => {
    const amount = req.body.amount;
    const reason = req.body.reason;
    const employeeId = req.body.employeeId;
    const requestId = req.body.requestId;
    const accountantId = req.body.accountantId
    const date = req.body.date;

    dbConnection.query(
      `insert  into fund_allocations(amount, reason, employee_id, request_id, accountant_id, date) values(?,?,?,?,?,?)`,
      [amount, reason, employeeId, requestId, accountantId, date],
      (error, result) => {
        if(error){
            console.log(error)
            return res.status(500).send({
                message: "Internal Database Error"
            })
        }
        if(result){
            console.log(result)
            res.status(200).send({
                message: "Data sent successfully"
            })
        }
      }
    );
  })


module.exports = router;
