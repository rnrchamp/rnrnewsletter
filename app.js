//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request= require("request");
const https= require("https");

const app = express();

app.use(express.static("public")); // helps to call static files with this one line
app.use(bodyParser.urlencoded({extended:true}));// telling app to use body parcer to read body

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/",function(req,res){ //targeting the home route
        const Firstname= req.body.Fname;
        const Lastname = req.body.Lname;
        const Email= req.body.Email;
        console.log(Firstname +" " +Lastname +" and my email is "+ Email);

        const data={
          members:[
            {
              email_address:Email,
              status:"subscribed",
              merge_fields:{
                FNAME:Firstname,
                LNAME:Lastname
              }
            }
          ]
        }

const jsonData= JSON.stringify(data); //helpss to convert data to string that is json format

const url= "https://us19.api.mailchimp.com/3.0/lists/dbfd4023ad";

const options={
method:"POST",
auth:"raju:2acf4f6683ec0bf5d0a2d6c7cbc54584-us19"
}
const request=https.request(url,options,function(response){

  if(response.statusCode==200){
    res.sendFile(__dirname + "/success.html");
  }else if(response.error_code=="ERROR_CONTACT_EXISTS"){
    res.send("<h1>Sorry you already exist</h1>");
  }else{
    res.sendFile(__dirname + "/failour.html");
  }
  response.on("data",function(data){
    JSON.parse(data);
  })
})

request.write(jsonData);
request.end();
});

app.listen(process.env.PORT || 3000, function(){
console.log("you are at 3000 port");
});

app.post("/failour",function(req,res){
  res.redirect("/")
})
