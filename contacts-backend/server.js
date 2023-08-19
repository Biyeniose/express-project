const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();

connectDb();
const app = express();


const port = process.env.PORT;

app.use(express.json());
// we want to listen for api/contacts
// use .use() to define constant API url endpoint
// app.get();
// using the module.exports()
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use(errorHandler);


app.listen(port, () => {
    // returns a callback
    console.log(`Server running on Port ${port}`);

});
