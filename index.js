import express from "express";
import bodyParser from "body-parser";
import $ from "jquery";
import { title } from "process";

const app = express();
const port = 3000;

var status = "today";

var workList = [];
var todayList = [];
var day = titleDay();


app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    
    res.render("index.ejs", { workItems: list(status), status: status, day: day });
  });

app.post("/", (req, res) => {
    
    console.log(req.body);
    if (req.body.status) {
        status = req.body.status;
    }

    console.log("STATUS: " + status);
    if (req.body.NewItem) {
        list(status).push(req.body.NewItem);
    }
    res.render("index.ejs", { workItems: list(status), status: status, day: day});
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

function titleDay() {
    var date = new Date();
    var weekday = date.toLocaleDateString(undefined, { weekday: 'long'});
    var day = date.toLocaleDateString(undefined, {month: 'long', day: 'numeric'});
    return (weekday + ", " + day);
}
