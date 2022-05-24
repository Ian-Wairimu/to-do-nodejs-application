const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
let items = [];
let workItems = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(morgan("dev"))

app.get('/', (req, res) => {
   let today = new Date();
   let currentDay = today.getDay();
   let day = "";
    if(currentDay === 6 || currentDay === 0) {
    day = "Weekend";
    }else {
        day = "Weekday";
    }
    res.render("list", {listTitle: day, listItems: items});
})

app.post('/',(req, res) => {
    let item = req.body.newItem;
    console.log(item)
    if(req.body.list === "Work"){
        workItems.push(item)
        res.redirect('/work')
    }else {
        items.push(item)
        res.redirect('/')
    }

})
app.get('/work', (req, res) => {
    res.render("list", {listTitle: "Work List", listItems: items})
})
app.listen(3000, () => {
    console.log('serve is up and running')
})