var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//connect to the database
mongoose.connect('mongodb+srv://<user>:<password>@cluster0.fkjja.mongodb.net/<database>?retryWrites=true&w=majority')

//create a scheme - this is like a blueprint for the data
var todoSchema = new mongoose.Schema({
  item: String
})

var Todo = mongoose.model('Todo', todoSchema);
// var itemOne = Todo({item: 'buy flowers for michelle'}).save(function(err){
//   if (err) throw err;
//   console.log('item saved');
// })

//var data = [{item: 'finish tutorial 34'},{item: 'company michelle'},{item: 'visit ID'}];
var urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports = function(app){

app.get('/todo',function(req,res){
  //get data from mongodb and pass it to view
  Todo.find({}, function(err,data){
    if (err) throw err;
    res.render('todo', {todos:data});
  })
});

//this is the handler when ajax request from jquery is made
app.post('/todo',urlencodedParser, function(req,res){
  //get data from the view and add it to mongodb
  var newTodo = Todo(req.body).save(function(err,data){
    if (err) throw err;
    res.json(data);
  });
});

app.delete('/todo/:item',function(req,res){
  //delete requested item from mongodb
  Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err,data){
    if (err) throw err;
    res.json(data);
  });
  // data = data.filter(function(todo){
  //   return todo.item.replace(/ /g, '-') !== req.params.item;
  // });
  // res.json(data);
});

};
