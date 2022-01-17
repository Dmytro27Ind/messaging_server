const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();

const userScheme = new Schema({
    id: String,
    name: String,
    email: String,
    photo: String,
}, {versionKey: false});

const messagesScheme = new Schema({
    id: String,
    with_id: String,
    messages: [{
        id: String,
        message: String
    }]
}, {versionKey: false});

const locationScheme = new Schema({
    id: String,
    location: String
}, {versionKey: false});

const User = mongoose.model("user", userScheme);
const Messages = mongoose.model("messages", messagesScheme);
const Location = mongoose.model("location", locationScheme)

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

app.get("/api/location/:id", function(request, response){
    const id = request.params.id;
    Location.findOne({id: id}, function(error, location){
        if(error)
            return console.log(error);
        response.send(location);
    });
});

app.get("/api/users/email/:email", function(request, response){
    const email = request.params.email;
    User.findOne({email: email}, function(error, user){
        if(error)
            return console.log(error);
        response.send(user);
    });
});

app.get("/api/messages/:id", function(request, response){
    const id = request.params.id;
    Messages.find({id: id}, function(error, messages){
        if(error)
            return console.log(error);
        // console.log(messages[0].with_id)
        // console.log(messages[1].with_id)
        response.send(messages);
    });
});

app.get("/api/messages/:id/:with_id", function(request, response){
    const id = request.params.id;
    const with_id = request.params.with_id
    Messages.findOne({id: id, with_id: with_id}, function(error, messages){
        if(error)
            return console.log(error);
        if(messages != null)
            response.send(messages);
        else{
            Messages.findOne({id: with_id, with_id: id}, function(error, messages){
                if(error)
                    return console.log(error);
                response.send(messages);
            });
        }
    });
});

app.get("/api/users", function(request, response){
    User.find({}, function(error, users){
        if(error)
            return console.log(error);
        response.send(users)
    });
});

app.get("/api/location", function(request, response){
    Location.find({}, function(error, location){
        if(error)
            return console.log(error);
        response.send(location)
    });
});

app.get("/api/messages", function(request, response){
    Messages.find({}, function(error, messages){
        if(error)
            return console.log(error);
        response.send(messages)
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

app.post("/api/location", jsonParser, function (request, response) {
    if(!request.body)
        return response.sendStatus(400);

    const userId = request.body.id;
    const userLocation = request.body.location;

    const location = new Location({id: userId, location: userLocation});

    location.save(function(error){
        if(error)
            return console.log(error);
        response.send(location);
    });
});

app.post("/api/messages", jsonParser, function (request, response) {
    if(!request.body)
        return response.sendStatus(400);

    const userId = request.body.id;
    const withId = request.body.with_id;
    const userMessage = request.body.messages;

    Messages.findOne({id: userId, with_id: withId}, function(error, messages){
        if(error)
            return console.log(error);
        if(messages == null) {
            const message = new Messages({id: userId, with_id: withId, messages: userMessage});
            message.save(function (error) {
                if (error)
                    return console.log(error);
                response.send(message);
            });
        } else{
            let mes = []
            for(let m of messages.messages)
                mes.push({id: m.id, message: m.message})
            mes.push(userMessage[0])
            const updateMessages = new Messages({id: userId, with_id: withId, messages: mes});

            Messages.findOneAndDelete({id: userId, with_id: withId}, function(error, messages){
                if(error)
                    return console.log(error);
            });
            updateMessages.save(function (error) {
                if (error)
                    return console.log(error);
                response.send(updateMessages);
            });
        }
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