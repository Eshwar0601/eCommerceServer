const express = require("express");
const app = express();
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;

// connect to DB
connectDB();

// define routes and API
app.use("/api/users", require("./routes/userApi"));
app.use("/api/products", require("./routes/productsApi"));

app.get("/", (req, res) => {
    res.send("My app is up");
});

app.listen(PORT, () => {
    console.log(`server is listenning at port ${PORT}`);
});
