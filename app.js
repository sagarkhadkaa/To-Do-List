const express = require("express");
const bodyParser = require("body-parser");

const app = express();
var items = ["Buy Food", "Cook Food", "Eat Food"];
let workItems = [];

app.set("view engine", "ejs"); //ejs inclusion default function
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); //for using static files

// for home directory
app.get("/", function (req, res) {
  let today = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  let day = today.toLocaleDateString("en-US", options);
  res.render("list", { listTitle: day, newListItems: items });
});

app.post("/", function (req, res) {
  let item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

// for work directory
app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.post("/work", function (req, res) {
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});

// for aboutus directory
app.get("/about", function (req, res) {
  res.render("about");
});
//Server starting at 3000.
app.listen(3000, function () {
  console.log("Server started at port 3000.");
});
