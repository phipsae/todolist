import express from "express";
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import _ from 'lodash';

const app = express();
const port = 3000;

var status = "today";

var listName = "Today"
// var day = titleDay();

// main().catch(err => console.log(err));

await mongoose.connect('mongodb://127.0.0.1:27017/todolist');

const itemSchema = new mongoose.Schema ({
    name: String
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
name: "Welcome"
});

const item2 = new Item({
name: "Hit"
});

const item3 = new Item({
name: "Do"
});
  
const defaultItems = [item1, item2, item3];

var allItems = await Item.find();

const listSchema = new mongoose.Schema ({
    name: String,
    items: [itemSchema]
});

const List = mongoose.model("List", listSchema);

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    if (allItems.length === 0) {
        await Item.insertMany(defaultItems);
        console.log("ITEMS CREATED!!!!!");
        res.redirect("/");
    }else {
        // console.log("coming from /" + listName);
        allItems = await Item.find();
        res.render("index.ejs", { items: allItems, listName: listName });
    };
  });

app.get("/:customListName", async (req, res) => {
    const customListName = _.capitalize(req.params.customListName);
    const foundList = await List.findOne({ name: customListName}).exec();
    if (!foundList) {
        const list = new List({
            name: customListName,
            items: defaultItems
        });
        list.save();
        // console.log("/" + customListName)
        res.redirect("/" + customListName);
    } else {
        // console.log("Exists:" + foundList.name)
        res.render("index.ejs", { listName: foundList.name, items: foundList.items});
    }
});

app.post("/", async (req, res) => {
    const itemName = req.body.name
    const customListName = req.body.list;
    
    const item = new Item({ name: itemName });

    if (customListName === "Today") {
        item.save()
        res.redirect("/");
    } else {
        const foundList = await List.findOne({ name: customListName}).exec();
        foundList.items.push(item);
        foundList.save();
        console.log("other list")
        res.redirect("/" + customListName);
    };
});

app.post("/delete", async (req, res) => {
    const itemID = req.body.checkbox;
    const customListName = req.body.list;
    if (customListName === "Today") {
        await Item.deleteOne({ _id: itemID });
        res.redirect("/");
    } else {
        // const foundList = await List.findOne({ name: customListName}).exec();
        // console.log(itemID);
        // console.log(foundList.items);
        await List.findOneAndUpdate(
            {name: customListName},
            { $pull: {items: {_id: itemID }}}
        );
        //     { _id: itemID },
        //     { name: "huhu" }
        // );
        // foundList.save();
        // console.log(foundList.items);
        res.redirect("/" + customListName);
    }
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

function list(status) {
    if (status === "today") {
        return todayList;
    } else {
        return workList;
    }
}

// function titleDay() {
//     var date = new Date();
//     var weekday = date.toLocaleDateString(undefined, { weekday: 'long'});
//     var day = date.toLocaleDateString(undefined, {month: 'long', day: 'numeric'});
//     return (weekday + ", " + day);
// }
