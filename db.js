const mongoose = require("mongoose");

const connection = mongoose.connect(
  "mongodb+srv://chetan:chauhan@cluster0.xx5g40u.mongodb.net/kanban?retryWrites=true&w=majority"
);
if (connection) {
  console.log("connected to db");
} else {
  console.log("not connected");
}
module.exports = {
  connection,
};
