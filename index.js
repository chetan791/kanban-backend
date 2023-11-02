const express = require("express");
var cors = require("cors");
const { connection } = require("./db");
const { Board_router } = require("./Routes/Board");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/board", Board_router);
app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(8080, () => {
  console.log("running on 8080");
});
