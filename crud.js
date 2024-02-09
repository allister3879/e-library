var con = require('./connection');

var express = require('express');
var app = express();

var bodyParser = require('body-parser');

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.get('/',function(req, res){
    res.sendFile(__dirname+'/form.html');
});

app.post('/', function(req, res){
    var name = req.body.name;
    var group = req.body.group;
    var email = req.body.email;
    
    con.connect(function(error){
        if(error)throw error;
        var sql = "INSERT INTO bookrequests(name, group_name, email) VALUES('"+name+"', '"+group+"', '"+email+"')";
        con.query(sql, function(error, result){
            if (error) throw error;
            var id = result.insertId;
            res.redirect('/success?id=' + id + '&name=' + name + '&group=' + group + '&email=' + email);
        });
    });

});

app.get('/success', function(req, res){
    var id = req.query.id;
    var name = req.query.name;
    var group = req.query.group;
    var email = req.query.email;

    res.render(__dirname + '/success', { id: id, name: name, group: group, email: email });

});

app.get('/delete-req', function(req, res){
    var id = req.query.id;
    var sql = "DELETE FROM bookrequests WHERE id=?";
    con.query(sql, [id], function(error, result){
        if(error) console.log(error);
        res.redirect('/');
    });
})

app.get('/update-req', function(req, res){
    var id = req.query.id;
    var name = req.query.name;
    var group = req.query.group;
    var email = req.query.email;

    var sql = "SELECT * FROM  bookrequests WHERE id=?";

    con.query(sql, [id], function(error, result){
        if(error) console.log(error);
        res.render(__dirname+"/updateForm", {id: id, name: name, group: group, email: email})
    });
})

app.post('/update-req', function(req, res){
    var id = req.query.id; 
    var name = req.query.name; 
    var group = req.query.group; 
    var email = req.query.email;

    var updatedName = req.body.name;
    var updatedGroup = req.body.group;
    var updatedEmail = req.body.email;

    var sql = "UPDATE bookrequests SET name=?, group_name=?, email=? WHERE id=?";

    con.query(sql, [updatedName, updatedGroup, updatedEmail, id], function(error, result){
        if(error) console.log(error);
        res.redirect('/success?id=' + id + '&name=' + updatedName + '&group=' + updatedGroup + '&email=' + updatedEmail);
    });
});


app.listen(7000)
