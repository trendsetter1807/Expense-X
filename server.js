const express=require('express');
const cors=require('cors');
const morgan=require('morgan');
const dotenv=require('dotenv');
// const colors=require('colors');
const connectDb=require("./config/connectDb");

dotenv.config();
connectDb();
const app=express();

app.use(morgan('dev'))
app.use(express.json())
app.use(cors())

//user routes
app.use("/api/v1/users", require("./routes/userRoute"));

//transaction routes
app.use("/api/v1/transactions", require("./routes/transactionRoute"));

// app.get('/', (req,res)=>{
//     res.send("<h1>Heelo Pratik</h1>")
// })

const PORT=8080

app.listen(PORT,()=>{
    console.log(`Server Running on Port ${PORT}`);
})
