// jshint esversion: 6
// Newsletter - Signup

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
const sport = process.env.PORT || 3000;

app.use(express.static("public")); // Using Express to use external files
app.use(bodyParser.urlencoded({extended: true})); // Using Body Parser to parse user inputs

app.get('/', (req, res) => {
    
    res.sendFile(__dirname + "/signup.html");

})

app.post('/', (req, res) => {
    
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const userEmail = req.body.email;

    const data = {
        members: [{
            email_address: userEmail,
            status: "subscribed",
            merge_fields: {
                FNAME: fName,
                LNAME: lName,
            }
        }]
    }

    const jsonData = JSON.stringify(data); // Turn data into a JSON
    const url = "https://us21.api.mailchimp.com/3.0/lists/ca91d0fbd3";
    const options = {
        method: "POST",
        auth: "Nacho:92a534056e7ae0bbaf78f7d9da8d5eba-us21",
    }    

    const request = https.request(url, options, function (response) {
                        response.on("data", function (data) {
                            console.log(JSON.parse(data));
                        })

                        var status = response.statusCode;

                        if (status === 200) {
                            res.sendFile(__dirname + "/success.html")
                        } else {
                            res.sendFile(__dirname + "/failure.html")
                        }
                    })
                    
    request.write(jsonData);
    request.end();

})

app.post('/failure', (req, res) => {
    
    res.redirect("/"); // This line triggers the app.get from line #15 and renders signup.html on the web browser
    
})

app.post('/success', (req, res) => {
    
    res.redirect("/");
    
})

app.listen(sport, () => {
    
    console.log("Example app listening on port " + sport);
  
})