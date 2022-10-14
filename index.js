require("dotenv").config();
const express = require("express");
const bodyParser  = require("body-parser");
const app = express();


app.use(express.json({extended: false}))
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})




app.use(bodyParser.json());;

const employeeRouter  = require("./api/employees/employee.router")
app.use("/api", employeeRouter)


const accountantRouter = require("./api/accountant/accountant.router")
app.use("/api", accountantRouter)

const fmRouter  = require("./api/financemanager/financemanager.router")
app.use("/api",fmRouter)

const requestRouter = require("./api/Requests/request.router")
app.use("/api", requestRouter)

const receivedRequestsRouter  = require("./api/Requests/SentRequests.router")
app.use("/api", receivedRequestsRouter)

app.listen(process.env.PORT || 3006, ()=>{
    console.log(`Server is perfectly running on ${process.env.PORT}`)
})
