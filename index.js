require("dotenv").config();
const express = require("express");
const bodyParser  = require("body-parser");
const app = express();
const cors = require("cors")

app.use(express.json({extended: false}))

app.use(cors({
    origin:"*" ,
    credentials: true,
    methods: "POST, GET, PUT, DELETE"
}))







app.use(bodyParser.json());;

const employeeRouter  = require("./api/employees/employee.router")
app.use("/api", employeeRouter)


const accountantRouter = require("./api/accountant/accountant.router")
app.use("/api", accountantRouter)

const fmRouter  = require("./api/financemanager/financemanager.router")
app.use("/api",fmRouter)

const requestRouter = require("./api/Requests/request.router")
app.use("/api", requestRouter)

const receivedRequestsRouter  = require("./api/Requests/SentRequests.router");
app.use("/api", receivedRequestsRouter)

const approveRequestRouter = require("./api/Requests/ApproveRejectRequests.router")
app.use("/api", approveRequestRouter)

const requestNotifications  = require("./api/Requests/RequestsNotification.router")
app.use("/api", requestNotifications)

const requestsHistory = require("./api/Requests/RequestsHistory.router")
app.use("/api", requestsHistory)

const sendMoney = require("./api/Mpesa-api/mpesa.router")
app.use("/api", sendMoney)

const receipt = require("./api/Receipts/Receipts.router")
app.use("/api", receipt)

app.listen(process.env.PORT || 3006, ()=>{
    console.log(`Server is perfectly running on ${process.env.PORT}`)
})
