const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const _ = require("lodash");

mongoose.set('useFindAndModify', false);

app.set("view engine", "ejs"); //ejs inclusion default function
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); //for using static files

mongoose.connect("mongodb+srv://admin-sagar:Test123@cluster0.ws93l.mongodb.net/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
  name: "Welcome to your todoList!"
});

const item2 = new Item ({
  name: "Hit the + button to add a new item."
});

const item3 = new Item ({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

// for home directory
app.get("/", function (req, res) {
  Item.find({}, function(err, foundItems){
    if (foundItems.length === 0){
      Item.insertMany(defaultItems, function(err){
        if (err){
          console.log(err);
        }else{
          console.log("Sucessfully saved default items to DB.");
        }
      });
      res.redirect("/");
    } else{
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });
  if (listName === "Today"){
    item.save();
  res.redirect("/");
  }else{
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
  
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if(listName === "Today"){
    Item.findByIdAndRemove(checkedItemId, function(err){
      if(!err){
        console.log("Sucessfully deleted checked item.");
        res.redirect("/");
      }
    });
  } else{
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if(!err){
        res.redirect("/"+listName);
      }
    });
  }
});

// for work directory
app.get("/:customListName", function (req, res) {
const customListName = _.capitalize(req.params.customListName);
List.findOne({name: customListName}, function(err, foundList){
  if(!err){
    if(!foundList){
      //Create a new list
      const list = new List({
        name: customListName,
        items: defaultItems
        })
      list.save();
      res.redirect("/"+ customListName);
    } else{
     //Show an existing list
     res.render("list",{ listTitle: customListName, newListItems: foundList.items });
    }
  }
});

});


//Server starting at 3000.
const port = 3000;
app.listen(process.env.PORT || port ,function () {
  console.log("Server started at port 3000.");
});
