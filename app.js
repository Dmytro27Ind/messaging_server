const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();

const userScheme = new Schema({id: String, name: String, email: String, photo: String,
    chats: {
        type: [{
            with_id: String,
            messages: [String]
        }],
        required: false
    }

}, {versionKey: false});

const User = mongoose.model("user", userScheme);

const PORT = process.env.PORT || 3000

//app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb+srv://admin:admin27@messagin.fptku.mongodb.net/usersdb?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true }, function(error){
    if(error)
        return console.log(error);

    app.listen(PORT, function(){
        console.log("The server is waiting for a connection ...");
    });
});

app.get("/api/users/:id", function(request, response){
    const id = request.params.id;
    User.findOne({id: id}, function(error, user){
        if(error)
            return console.log(error);
        response.send(user);
    });
});

app.get("/api/users", function(request, response){
    User.find({}, function(error, users){
        if(error)
            return console.log(error);
        response.send(users)
    });
});

app.post("/api/users", jsonParser, function (request, response) {
    if(!request.body)
        return response.sendStatus(400);

    const userId = request.body.id;
    const userName = request.body.name;
    const userEmail = request.body.email;
    const userPhoto = request.body.photo;

    const user = new User({id: userId, name: userName, email: userEmail, photo: userPhoto});

    user.save(function(error){
        if(error)
            return console.log(error);
        response.send(user);
    });
});

app.put("/api/users", jsonParser, function(request, response){
    if(!request.body)
        return response.sendStatus(400);

    const id = request.body.id;
    const userName = request.body.name;
    const userEmail = request.body.email;
    const userPhoto = request.body.photo;
    const newUser = {id: id, email: userEmail, name: userName, photo: userPhoto};

    User.findOneAndUpdate({id: id}, newUser, {new: true}, function(error, user){
        if(error)
            return console.log(error);
        response.send(user);
    });
});

app.delete("/api/users/:id", function(request, response){
    const id = request.params.id;

    User.findOneAndDelete({id: id}, function(error, user){
        if(error)
            return console.log(error);
        response.send(user);
    });
});