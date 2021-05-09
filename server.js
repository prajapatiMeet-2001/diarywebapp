var express = require('express');
var mongoose = require('mongoose');
var app = express();
app.use(express.static(__dirname + '/public'))
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
//STARTING SERVER & CONNECTING WITH MONGODB CLIENT
app.listen(3000,()=>console.log('Server Started'))
mongoose.connect('mongodb://localhost:27017/diaryDB', {useNewUrlParser: true, useUnifiedTopology: true});
//DB CONNECTION
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('DB connection established')
});
//DATABASE USERDATA SCHEMA
var userSchema = mongoose.Schema({
    userid: {type:String,required:true,unique : true},
    userName: {type:String,required:true},
    email: {type:String,required:true},
    created: {type:Date, default:Date.now},
});
var Users = mongoose.model('Users',userSchema)
//USERDATA GET/POST
app.post('/api/users/:id',addUser)
app.get('/api/users/:id',getUname)
app.put('/api/users/:id',updateUname)
//ADD USERDATA
function addUser(req,res) 
{
    var userData = req.body;
    console.log(userData);
    res.json(userData)
    Users.create(userData).then((data)=>
    {
        console.log(data);
    }).catch((err)=>
    {
        console.log(err);
    })
}
//RETRIEVE USERNAME
function getUname(req,res) 
{
    var uid = req.params.id;
    //console.log('getblogid',uid)
    Users.find({userid:uid}).then((data)=>
    {
        res.send(data)
    }).catch((err)=>
    {
        console.log(err);
    })
}
//Edit User Name
function updateUname(req,res) 
{
    var userData = req.body;
    console.log(userData)
    Users.updateOne({userid:userData.uid},userData).then((data)=>
    {
        res.json(data)
        console.log(data);
    }).catch((err)=>
    {
        console.log(err);
    })
}

//DATABASE DIARY SCHEMA
var diarySchema = mongoose.Schema({
    userid: {type:String,required:true,index: { unique: false, sparse: true }},
    title: {type:String,required:true},
    body: {type:String,required:true},
    dDate: {type:Date,required:true},
    created: {type:Date, default:Date.now},
});
var UserDiary = mongoose.model('UserDiary',diarySchema)
//DIARY GET/POST/PUT/DELETE
app.post('/api/diary/:id',addDiary)
app.get('/api/diary/:id',getDiary)
app.delete('/api/diary/:pth/:id',deleteDiary)
app.get('/api/diary/:pth/:id',getIndividual)
app.put('/api/diary/:pth/:id',editIndividual)
//ADD DIARY
function addDiary(req,res) 
{
    var diaryData = req.body;
    console.log(diaryData);
    res.json(diaryData)
    UserDiary.create(diaryData).then((data)=>
    {
        res.send(data)
    }).catch((err)=>
    {
        console.log(err);
    }) 
}
//GET DIARY
function getDiary(req,res) 
{
    var uid = req.params.id;
    console.log('getuserid',uid)
    UserDiary.find({userid:uid}).then((data)=>
    {
        console.log(data)
        res.send(data)
    }).catch((err)=>
    {
        console.log(err);
    })
}
//GET INDIVIDUAL DIARY
function getIndividual(req,res) 
{
    var diaryid = req.params.id;
    UserDiary.find({_id:diaryid}).then((data)=>
    {
        console.log(data)
        res.send(data)
    }).catch((err)=>
    {
        console.log(err);
    })
}
app.get('/api/date/:pth/:id',getDiarybydate)
function getDiarybydate(req,res) 
{
    var uid = req.params.pth;
    var dateF = req.params.id;
    var query = {userid:uid,dDate:dateF}
    console.log(query)
    UserDiary.find(query).then((data)=>
    {
        console.log(data)
        res.send(data)
    }).catch((err)=>
    {
        console.log(err);
    })
}
//EDIT INDIVIDUAL DIARY
function editIndividual(req,res) 
{
    var diaryData = req.body;
    UserDiary.updateOne({_id:diaryData._id},diaryData).then((data)=>
    {
        res.json(data)
        console.log(data);
    }).catch((err)=>
    {
        console.log(err);
    })
}
//DELETE INDIVIDUAL
function deleteDiary(req,res) {
    var diaryid = req.params.id;
    console.log('getdiaryid',diaryid)
    UserDiary.remove({_id:diaryid}).then((data)=>
    {
        res.json(data)
    }).catch((err)=>
    {
        console.log(err);
    })  
    
}