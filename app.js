//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/workerDB", {
  useNewUrlParser: true
});
const workerSchema = {
  name: String,
  content: String
};
const Worker = mongoose.model("Worker", workerSchema);

// Requests targeting all workers

app.route("/workers").get(function(req, res) {
    Worker.find(function(err, foundWorkers) {
      if (!err) {
        res.send(foundWorkers);
      } else {
        res.send(err);
      }
    });
  })
  .post(function(req, res) {
    const newWorker = new Worker({
      name: req.body.name,
      content: req.body.content
    });
    newWorker.save(function(err) {
      if (!err) {
        res.send("Successfully added a new worker details");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function(req, res) {
    Worker.deleteMany(function(err) {
      if (!err) {
        res.send("successfully deleted all workers details");
      } else {
        res.send(err);
      }
    });
  });

// Requests targeting a specific workers

app.route("/workers/:workerName")
.get(function(req,res){
  Worker.findOne({name:req.params.workerName},function(err,foundWorker){
    if(foundWorker){
      res.send(foundWorker)
    }else{
      res.send("No Worker Found");
    }
  });
})
.put(function(req,res){
  Worker.update(
    {name:req.params.workerName},
    {name:req.body.name,content:req.body.content},
    {overwrite:true},
    function(err){
      if(!err){
        res.send("Successfully updated worker details");
      }
    }
  );
})
.patch(function(req,res){
  Worker.update(
    {name:req.params.workerName},
    {$set:req.body},
    function(err){
      if(!err){
      res.send("Succesfully updated the worker details");
    }else{
      res.send(err);
    }
  });
})
.delete(function(req,res){
  Worker.deleteOne(
    {name:req.params.workerName},
    function(err){
      if(!err){
        res.send("Successfully deleted the corresponding worker details");
      }
      else{
        res.send(err);
      }
    }
  );
});
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
