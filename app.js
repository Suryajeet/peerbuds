var express = require('express');
var app = express();
var fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

app.listen(8090);
console.log('listening on port 8090');

/*  description :: api path to get all the questions
    query :: pagesize(optional)
*/
app.get('/',function requestListener(req,res) {
  fs.readFile('xml/Posts.xml', 'utf8', function(err,fileData){
    var questions = ["<h1>Questions</h1>"];
    parser.parseString(fileData.substring(0, fileData.length), function (err, result) {
      jsonR = result.posts.row;
      
      var ps = req.query.pagesize || jsonR.length;
      
      for(var i=0; i<ps; i++){
        questions.push(jsonR[i]['$']['Body']);
      }

      res.send(questions.toString());

    });

  });

});

/*  description :: api path to get all the related users to a given userId
    query :: userId(mandatory)
*/
app.get('/user',function requestListener(req,res) {
  var dataCount = 0, users = [], posts= [];
  var userId = req.query.userId;
  if(!userId){
    res.send('<h2>Please send userId as query</h2>');
  }
  fs.readFile('xml/Posts.xml', 'utf8', function(err,fileData){
    parser.parseString(fileData.substring(0, fileData.length), function (err, result) {
      jsonR = result.posts.row;
      for(var i=0; i<jsonR.length; i++){
        var userData = jsonR[i]['$'];
        if(userId == userData['OwnerUserId']){
          posts.push(userData['OwnerUserId']);
        } else if(userId == userData['LastEditorUserId']){
          posts.push(userData['LastEditorUserId']);
        }
      }
      getComments();
    });
  });

  function getComments(){
    fs.readFile('xml/Comments.xml', 'utf8', function(err,fileData){
      parser.parseString(fileData.substring(0, fileData.length), function (err, result) {
        jsonR = result.comments.row;
        for(var i=0; i<jsonR.length; i++){
          var userData = jsonR[i]['$'];
          for(var j=0; j<posts.length; j++){
            if(posts[i] == userData['PostId']){
              users.push(userData['UserId']);
            }
          }
        }
        getUserData();
      });
    });
  }

  function getUserData(){
    fs.readFile('xml/Users.xml', 'utf8', function(err,fileData){
      var usersArray = ["<h1>Users</h1>"];
      parser.parseString(fileData.substring(0, fileData.length), function (err, result) {
        jsonR = result.users.row;
        for(var i=0; i<jsonR.length; i++){
          var userData = jsonR[i]['$'];
          for(var j=0; j<users.length; j++){
            if(users[j] == userData['Id']){
              console.log(users[j], userData);
              usersArray.push(userData['DisplayName']);
              usersArray.push(userData['AboutMe']);
            }
          }
        }
        console.log(users, usersArray);
        res.send(usersArray.toString());
      });
    });
  }
  

});