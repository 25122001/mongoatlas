
// node app.js  => to run the server
// http://localhost:8000/  => to access the server


const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const exhbs = require('express-handlebars');
const dbo = require('./db');
const BookModel = require('./models/bookModel');

dbo.getDatabase();  // only one time is intimated "database connected" for each request(CRUD) we doesnot need to intimate

app.engine('hbs',exhbs.engine({
    layoutsDir:'views/',
defaultLayout:"main",
extname:"hbs",
// ERROR :  it is not an "own property" of its parent ( if below line is not given it will not display any inputed values )
runtimeOptions : {
    allowProtoPropertiesByDefault : true,
    allowProtoMethodsByDefault : true
    
    
}

}))
app.set('view engine','hbs');
app.set('views','views');
app.use(bodyparser.urlencoded({extended:true}));

app.get('/',async (req,res)=>{
    let books = await BookModel.find({})

    let message = '';
    let edit_id, edit_book;

    if(req.query.edit_id){
        edit_id = req.query.edit_id;
        edit_book = await BookModel.findOne({_id : edit_id })
    }

    if (req.query.delete_id) {
        await BookModel.deleteOne({_id : req.query.delete_id })
        return res.redirect('/?status=3');
    }
    
    switch (req.query.status) {
        case '1':
            message = 'Inserted Succesfully!';
            break;

        case '2':
            message = 'Updated Succesfully!';
            break;

        case '3':
            message = 'Deleted Succesfully!';
            break;
    
        default:
            break;
    }


    res.render('main',{message,books,edit_id,edit_book})
})

app.post('/store_book',async (req,res)=>{
  
    const book = new BookModel({ title: req.body.title, author: req.body.author  });
    book.save();
    return res.redirect('/?status=1');
})

app.post('/update_book/:edit_id',async (req,res)=>{
    
   
    let edit_id = req.params.edit_id;

    await BookModel.findOneAndUpdate({_id : edit_id} ,{ title: req.body.title, author: req.body.author  } )    
    return res.redirect('/?status=2');
})

app.listen(8000,()=>{console.log('Listening to 8000 port');})
