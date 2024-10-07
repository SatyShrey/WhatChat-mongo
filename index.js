/* eslint-disable no-undef */

require("dotenv").config()
const express = require("express")
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
const mongoUrl = `mongodb+srv://sndsatya:QtAy7QbfwCnzUhvu@clustersnd.adfao0n.mongodb.net/`
const Port = 3001
const mongoClient = require('mongodb').MongoClient

//get users................................................
app.get('/users', (req, res) => {
    mongoClient.connect(mongoUrl).then(clientObject => {
        var database = clientObject.db('chatapp');
        database.collection('users').find({}).toArray().then(data => {
            res.send(data); res.end()
        })
    })
})

//get chats................................................
app.get('/chats/:id/:id2', (req, res) => {
    var p1 = req.params.id;
    var p2 = req.params.id2
    mongoClient.connect(mongoUrl).then(clientObject => {
        var database = clientObject.db('chatapp');
        database.collection('chats').find({ $or: [{ p1: p1, p2: p2 }, { p1: p2, p2: p1 }] }).toArray().then(data => {
            res.send(data); res.end()
        })
    })
})

//get group chats
app.get('/groupchats/:id', (req, res) => {
    mongoClient.connect(mongoUrl).then(clientObject => {
        var database = clientObject.db('chatapp');
        database.collection('groupchats').find({groupid:req.params.id}).toArray().then(data => {
            res.send(data); res.end()
        })
    })
})

///add group chats
app.post('/addgroupchat', (req, res) => {
    mongoClient.connect(mongoUrl).then(clientObject => {
        var database = clientObject.db('chatapp');
        database.collection('groupchats').insertOne(req.body);
        res.end();
    })
})

//post chats...........................
app.post('/addchat', (req, res) => {
    mongoClient.connect(mongoUrl).then(clientObject => {
        var database = clientObject.db('chatapp');
        database.collection('chats').insertOne(req.body);
        res.end();
    })
})

//signup
app.post('/signup', (req, res) => {
    mongoClient.connect(mongoUrl).then(clientObject => {
        var database = clientObject.db('chatapp');
        database.collection('users').insertOne(req.body);
    }).then((data)=>{res.send(data);res.end();})
})

//update User data////////////////////////////////////////////////////
app.patch('/updateuser/:id', (req, res) => {
    mongoClient.connect(mongoUrl).then(clientObject => {
        var database = clientObject.db('chatapp');
        database.collection('users').updateOne({id:req.params.id},{$set:req.body});
        res.end();
    })
})
////////////////////////////////////////////////////////////////////////
//login
app.get('/login/:id/:pw',(req,res)=>{
    mongoClient.connect(mongoUrl).then(clientObject => {
        var database = clientObject.db('chatapp');
        database.collection('users').find({email:req.params.id,pw:req.params.pw}).toArray().then(data => {
        res.send(data);res.end()
        })
    })
})


//Check user
app.get('/exist/:id/', (req, res) => {
    mongoClient.connect(mongoUrl).then(clientObject => {
        var database = clientObject.db('chatapp');
        database.collection('users').find({email:req.params.id}).toArray().then(data => {
          if(data.length>0){
            res.send("true");res.end
          }else{res.send("false");res.end;}
        })
    })
})

//check groups
app.get('/group/:id/', (req, res) => {
    mongoClient.connect(mongoUrl).then(clientObject => {
        var database = clientObject.db('chatapp');
        database.collection('users').find({group:req.params.id}).toArray().then(data => {
          if(data.length>0){
            res.send("true");res.end
          }else{res.send("false");res.end;}
        })
    })
})



app.listen(Port, () => { console.log(`Mongo server started:${Port}`) })