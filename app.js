const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const app = express()

mongoose.connect('mongodb://localhost:27017/todolistDB').then(() => {
    console.log('DATABASE CONNECTION SUCCESSFUL');
})
mongoose.connection.on('error', err => {
    console.log(`DATABASE CONNECTION ERROR: ${err.message}`)
})

const itemsSchema = new mongoose.Schema(
    {
        name: {
            type: String
        }
    }
)

const Item = mongoose.model('Item', itemsSchema)

const item = new Item(
    {
        name: "Welcome to you todo list"
    }
)
const item2 = new Item(
    {
        name: "Hit the + button to add a new item"
    }
)
const item3 = new Item(
    {
        name: "<--- hit this to delete an item"
    }
)

const defaultItems = [item, item2, item3];

const listSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        items: [itemsSchema]
    }
)

const List = mongoose.model('List', listSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(morgan("dev"))

app.get('/', (_req, res) => {
    Item.find({}, (err, itemLog) => {
        if (itemLog.length === 0){
            Item.insertMany(defaultItems, err => {
                if (err) {
                    console.log(`Failed to insert the items ${err}`);
                }else {
                    console.log('Success inserting items')
                }
            })
            res.redirect('/')
        }else {
            res.render("list", {listTitle: "Today", listItems: itemLog});
        }
    });

})

app.get('/:custom', (req, res) => {
    const customName = req.params.custom;
    List.findOne({name: customName}, (err, suc) => {
        if (err){
                console.log(`DOES NOT EXIST: ${err}`)
            }else if(!suc){
            const list = new List({
                name: customName,
                items: defaultItems
            });
            list.save()
            res.redirect('/' + customName)
        }else {
                res.render("list", {listTitle: suc.name, listItems: suc.items})
            }

    })
})

app.post('/',(req, res) => {
    const itemName = req.body.newItem;
    const listName = req.body.btList;

    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        item.save().then(() => {
            console.log('SUCCESSFULLY SAVED')
        })
        res.redirect('/')
    }else {
        List.findOne({name: listName}, (err, suc) => {
            if(err){
                console.log('THERE IS AN ERROR')
            }else {
                suc.items.push(item);
                suc.save();
                res.redirect('/' + listName)
            }
        })
    }
})

app.post('/delete', (req, res) => {
    const checkedId = req.body.checkbox;
    Item.findByIdAndRemove(checkedId, (err) => {
        if (err) {
            console.log(`FAILED TO DELETE: ${err}`)
        }else {
            console.log('SUCCESSFULLY DELETED')
            res.redirect('/')
        }
    })
})

const port = 3000

app.listen(port, () => {
    console.log(`Running: http://localhost:${port}/`)
})