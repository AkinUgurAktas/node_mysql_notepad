const express = require('express');
const app = express();
const logger = require('./middlewares/logger');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const SQL = require('mysql')
var session = require('express-session');


// creating a MYSQL connection object
var con = SQL.createConnection({
    host:'localhost',
    user:'akin',
    password:'admin1234',
    database:'akindb'
}
)
// calling the connect method on object
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });




var oneDay = 1000 * 60 * 60 * 24;

app.use(session({
    secret: "secret",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));



// app.use(logger)

    app.get('/',(req,res) => {
      //  console.log(req.session);
        console.log("/ GET");
        session=req.session;
        if(session.userid){
            res.send("Welcome User <a href=\'/logout'>click to logout</a>");
        }else
        res.sendFile('views/index.html',{root:__dirname})
    });

    app.get('/AKIN*UGUR*AKTAS', (req, res) => {
        res.send('SECRET PATH (SECRET PATH CREATED BY AKINUGURAKTAS 00:05-17.04.2022 ,FOLDER CREATED BY AKINUGURAKTAS IN 18:13-13.04.2022)')
      })
      app.get('/logout',(req,res) => {
        req.session.destroy();
        console.log('SESSION STOPPED !')
        res.redirect('/');
    });


app.use('/login',(req,res,next) =>
{
  
    console.log("/login MIDDLEWARE");
    next()
    

})
app.get('/login',(req,res) =>
{
    
   console.log("/login GET");
   if(session.userid)
   {
    res.send(`GET - LOGIN SUCCESFULLY , WELCOME ! <br> 
    <a href=\'/logout'>click to logout</a> <br> 
    <a href=\'/notes'>click to notes</a>`);
   }else
   {
       res.send(`UNAUTHORIZED ! <br><a href='/'> >>> GO TO " / " </a>`);
   }
   
    

})
    // POST REQUEST (sending form data) ONE /notes PATH ->
app.post('/login',urlencodedParser,(req,res) => 
    {

    console.log("/login POST");
        var numrow = 0;

        // logging the request data ->
        console.log("POST : ",req.body.username,"-",req.body.password);
        // select query of request data
            con.query(`SELECT * FROM users WHERE username = '${req.body.username}' AND userpass = '${req.body.password}'  `,(err,result,field)=>
        {
            console.log("LENGTH :",result.length);
            numrow = result.length;
            if(numrow > 0) // can fetch a row ? (is username and password is true)
            {
                
                session=req.session;
                // assigning values to session's data
                session.userid = result[0].USERID;
                session.username=req.body.username;
                session.userpassword=req.body.password;
                console.log("ID :",session.userid);
                res.send(`LOGIN SUCCESFULLY , WELCOME ! <br> 
                <a href=\'/logout'>click to logout</a> <br> 
                <a href=\'/notes'>click to notes</a>`);
            }
            else
            {
                res.send('Invalid username or password');
            }

        })
    })


    // GET REQUEST ON /notes PATH ->
app.get('/notes',(req,res) =>
{

    console.log("/notes GET");
   if(session.userid) // session control
   {
    // sending the html page 
    res.sendFile(__dirname+"/views/notes.html")
   }else
   {
       res.send(`UNAUTHORIZED ! <br><a href='/'> >>> GO TO " / " </a>`);
   }
   
    

})


    // POST REQUEST ON /notes PATH ->
app.post('/notes',urlencodedParser,(req,res) =>
{
    console.log("/notes POST");
    
   if(session.userid)
   {

    var header = req.body.header.trim()
    header = header.replace("'",'`') 
    header = header.replace('"','`')
    var content = req.body.content.trim()
    //  string manipulation on user's form POST data

      // test of query string  console.log(`INSERT INTO notes(USERID,NOTE_HEADER,NOTE_CONTENT,NOTE_DATE) values(${session.userid},'${header}','${content}' , now() )`)
        // query template and processing the data
      con.query(`INSERT INTO notes(USERID,NOTE_HEADER,NOTE_CONTENT,NOTE_DATE) values(${session.userid},'${header}','${content}' , now() )`,(err,results,fields)=>{
            if(err)
            {
                console.log("NOTE CREATE ERROR.")
                res.send("NOTE CREATE ERROR.")
                throw err;
            }
            res.send("NOTE SUCCESSFULLY CREATED.")
            console.log("NOTE SUCCESSFULLY CREATED.")
        })
        
            
        
        
       


        
    
   }else
   {
       res.send(`UNAUTHORIZED ! <br><a href='/'> >>> GO TO " / " </a>`);
   }
   
    

})

    
   // console.log("GET : ",req.query.username,req.query.password);
 
    

// listening the 4000 port on localhost...
app.listen(4000,()=>
{
    console.log('SUNUCU 4000 PORTU UZERINDE DINLENIYOR ...')

})