//REQUIRE OR IMPORT ALL THE MODULES HERE ONLY
const express = require("express");
require('dotenv').config({ quiet: true });

const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");

//SET INSTANCES HERE ONLY
const app = express();



//VARIABLE DECLARATION HERE ONLY
const PORT = process.env.PORT || 4888;


// I WANT TO RUN A MIDDLEWARE
app.use(express.json());

app.use(function(req,res,next){
  console.log("THIS IS GLOBAL APP MIDDLWARE");
  next()
})

//WE WILLL MAKE ROUTES

//END POINTS : USER

app.get("/",(req,res)=>{
  res.send({message:"THIS IS DASHBOARD"})
})

app.use("/api/user",userRouter)


async function dbConnect() {
  await mongoose.connect(process.env.CONNECTION_URI).then(() => {
    console.log("DB CONNECTED");
  });
}

dbConnect().then(() => {
  app.listen(PORT, () => {
    console.log("Server running on port: ", PORT);
  });
});