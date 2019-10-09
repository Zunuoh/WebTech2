let express = require('express');
const path = require('path');
let app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

 let mongoose = require('mongoose');
 let bodyparser = require('body-parser');
 app.use(bodyparser.urlencoded({
     extended : true
 }));
// url: 'mongodb://localhost/mongo-proj'



// connecting to the db
let url = 'mongodb://localhost:27017/hallRegistration';
mongoose.connect(url, {useNewUrlParserc:true}, ( err)=>{
    if (err){
        console.log('Error connecting to db' +err)
    }
    else{
        console.log('Db connected successfully');
    }
})

// creating the schema
let newSchema = new mongoose.Schema({
   name: String,
   id: String,
   gender: String,
   pin: String,
   level: String,
   age: String,
});

let secSchema = new mongoose.Schema({
    hallName: String,
    room: String
});

// modelling the schema 
let Student = mongoose.model('hall', newSchema);
let Residence = mongoose.model('residence', secSchema);

app.get("/", (req,res) => {
    res.render('index', {
        viewTitle : "Welcome"
    });
});

// app.post("/save", (req, res) => {
//   let jnelson = req.body.jnelson;
//   let vhall = req.body.vhall;

//   let hallData = {jnelson : jnelson, }
// })

app.get("/register", (req, res) => {
    res.render("reg")
});

app.get("/signin", (req, res) =>{
    res.render("signin")
})

app.get("/save", (req, res)=>{
    res.render("save")
})

app.post("/register", (req, res)=>{
    // console.log(req.body);
    let student = new Student();
    student.name = req.body.regName;
    student.id = req.body.regID;
    student.gender = req.body.regGender;
    student.pin = req.body.regPIN;
    student.level = req.body.regLevel;
    student.age = req.body.regAge;
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(student.password, salt, function(err))
    })
    student.save((err, docs) =>{
        if(err)throw err;
        res.redirect("/save");
    });
 
});

app.post("/save", (res,req) =>{
    // console.log(req.body);
    let residence = new Residence();
    residence.hallName = req.body.hallSelc;
    residence.room = req.body.roomSel;
    // residence.save((err, docs) =>{
    //     if(err)throw err;
    //     res.redirect("/reg")
    // });
    res.send(req.body);
    
});

app.post("/signin", async(res,req)=>{
    try{
        const student = await Student.findOne({name:req.body.regID});
        bcrpt.compare(req.body.regPIN, student.regPIN, (err, isMatch)=>{
            if(isMatch){
                res.redirect("/reg")
            }
            else{
                res.send("okay");
            }
        }); 
    } catch(err){
        console.log("lost");
    }
})







app.listen(4000, (err) => {
    if(err){
    console.log("server error");
    }else{
        console.log("server up");
    }
});