import express from "express";
import cors from 'cors';
import mysql, { createConnection } from 'mysql'
import fileUpload from 'express-fileupload';
import session from "express-session";
import pkg from 'body-parser'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const { urlencoded } = pkg;
app.use(fileUpload());
app.use(express.json());
app.use(urlencoded({ extended: true }));

const db = createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ecom'
});

db.connect((err) => {

  console.log('Mysql Connected with App...');
});

app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true,
}));

app.use(session({
  key: "userid",
  secret: "secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 60 * 600 * 24
  },
}))
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const search = 'select * from user_db where email=? and password=?';
  db.query(search, [email, password], (error, result) => {
    if (result.length > 0) {
      req.session.user = result;
      console.log(req.session.user);
      res.send(result);
    }
    else {
      res.send({ message: "User Not Found" })
    }
  })
})

app.get('/login', (req, res) => {
  if (req.session.user) {
    res.send({ loggedin: true, user: req.session.user })
  }
  else {
    res.send({ loggedin: false })
  }
})


app.post('/adduser', (req, res) => {
  const { username, email, password, type, timecreated } = req.body;
  const insertQuery = "insert into user_db (username,email,password,type,timecreated) values(?,?,?,?,?)";
  db.query(insertQuery, [username, email, password, type, timecreated], (err, result) => {
    if (err) {
      console.log(err);
    }
  })
})


app.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('userid');
  // Used to delete cookie from applications
  res.redirect('/login');
})


app.post('/addcategory', (req, res) => {
  const { categoryname } = req.body;
  const add = "Insert into category_db (categoryname) values(?)";
  db.query(add, [categoryname], (err, result) => {
    if (err) console.log(err);
    res.send(result);
  })
})

app.get('/showcategory', (req, res) => {
  const show = 'select * from category_db';
  db.query(show, (err, result) => {
    res.send(result);
  })
})

app.post('/addproduct', (req, res) => {
  // console.log(req.body);
  const { productname, category, description, price, saleprice, image_path, quantity } = req.body;
  // console.log(image_path);
  const add = 'insert into product_db (productname,category,description,price,saleprice,image_path,quantity) values(?,?,?,?,?,?,?)';
  db.query(add, [productname, category, description, price, saleprice, image_path, quantity], (err, result) => {
    if (err) console.log(err);
    res.send(result);
  })
})










app.put('/updatequantity/:id/:quantity', (req, res) => {
  const { id, quantity } = req.params;
  console.log(quantity);
  console.log(id);
  const sql = 'UPDATE product_db SET quantity=? where id=? ';
  db.query(sql, [quantity, id], (err, result) => {
    if (err) console.log(err);
    res.send(result);
  })
})


app.get('/showproduct', (req, res) => {
  const show = 'SELECT product_db.id, product_db.productname, category_db.categoryname, product_db.image_path, product_db.description, product_db.price, product_db.saleprice, product_db.quantity FROM product_db INNER JOIN category_db ON product_db.category = category_db.id;';
  db.query(show, (err, result) => {
    res.send(result);
  })
})

app.get('/showuser', (req, res) => {
  const show = 'select * from user_db';
  db.query(show, (err, result) => {
    res.send(result);
  })
})

app.delete('/deleteuser/:id', (req, res) => {
  const { id } = req.params;
  const del = 'delete from user_db where id=?';
  db.query(del, id, (err, result) => {
    if (err) console.log(err);
  })
})

app.delete('/deletecategory/:id', (req, res) => {
  const { id } = req.params;
  const del = 'delete from category_db where id=?';
  db.query(del, id, (err, result) => {
    if (err) console.log(err);
  })
})

app.delete('/deleteproduct/:id', (req, res) => {
  const { id } = req.params;
  const del = 'delete from product_db where id=?';
  db.query(del, id, (err, result) => {
    if (err) console.log(err);
  })
})

app.delete('/deleteproductcart/:id', (req, res) => {
  const { id } = req.params;
  const del = 'delete from cart_db where id=?';
  db.query(del, id, (err, result) => {
    if (err) console.log(err);
  })
})

app.post('/addorder',(req,res)=>{
  const pid=req.body.pid;
  const username=req.session.user[0].username;
  console.log(username);
  const tracking =0;
  const orderid=req.body.orderid+username+Date.now();
  const trackingid=req.body.trackingid;
  const mode=req.body.mode[0];
  const address=req.body.address[0];
  const add='Insert into order_db (pid,username,orderid,address,tracking,trackingid,mode ) values (?,?,?,?,?,?,? )';
  const quan='Update product_db set quantity=quantity-1 where id=? '
  db.query(add,[pid,username,orderid,address,tracking,trackingid,mode],(err,result)=>{
    if(err)console.log(err);
    else{
      db.query(quan,[pid],(err,resu)=>{
        if(err)console.log(err);
      })
    }
  })
})


app.get('/showorders',(req,res)=>{
  const show='SELECT order_db.id, product_db.productname, order_db.orderid, order_db.address, order_db.tracking,order_db.trackingid FROM order_db INNER JOIN product_db ON product_db.id = order_db.pid where order_db.username=?' ;
  const username=req.session.user[0].username;
  db.query(show,[username],(err,result)=>{
    if(err)console.log(err);

    res.send(result)
  })
})


app.get('/showallorders',(req,res)=>{
  const show='SELECT order_db.id,order_db.pid,order_db.username ,product_db.productname, order_db.orderid, order_db.address, order_db.tracking,order_db.trackingid,order_db.mode FROM order_db INNER JOIN product_db ON product_db.id = order_db.pid ' ;
  db.query(show,(err,result)=>{
    if(err)console.log(err);

    res.send(result)
  })
})

app.get('/decline/:orderid',(req,res)=>{
  const{orderid}=req.params;
  const accept='update order_db set tracking=2 where orderid=?';
  db.query(accept,[orderid],(err,result)=>{
    if(err)console.log(err);
  })
})

app.get('/delivered/:orderid',(req,res)=>{
  const{orderid}=req.params;
  const accept='update order_db set tracking=3 where orderid=?';
  db.query(accept,[orderid],(err,result)=>{
    if(err)console.log(err);
  })
})

app.get('/settrackingid/:orderid/:trackingid',(req,res)=>{

  const { orderid, trackingid } = req.params;
  console.log(orderid);
  console.log(trackingid);
  const accept='update order_db set tracking=1 ,trackingid=? where orderid=?';
  db.query(accept,[trackingid,orderid],(err,result)=>{
    if(err)console.log(err);
  })
})



app.post('/addtocart/:pid',(req,res)=>{
  const username=req.session.user[0].username;

  const pid=req.params.pid;
  console.log(pid);
  const add='Insert into cart_db (username,pid) values (?,?)';
  db.query(add,[username,pid],(err,result)=>{
    if(err)console.log(err);
  })
})


app.get('/showcart',(req,res)=>{
  const username=req.session.user[0].username;
  const show='SELECT cart_db.id, product_db.productname ,product_db.saleprice FROM product_db INNER JOIN cart_db ON product_db.id = cart_db.pid where cart_db.username=? ';
  db.query(show,[username],(err,result)=>{
    if(err)console.log(err);
    console.log(result);
    res.send(result);
  })
  
})

app.get('/showtotal',(req,res)=>{
  const username=req.session.user[0].username;
  const calculate=' select sum(product_db.saleprice) as sum  FROM product_db INNER JOIN cart_db ON product_db.id = cart_db.pid where cart_db.username=? '
  db.query(calculate,[username],(err,result)=>{
    if(err)console.log(err);
    console.log(result);
    res.send(result);
  })
})


app.delete('/deleteproduct/:id',(req,res)=>{
  const {id}=req.params;
  const del='delete from cart_db where id=?';
  db.query(del,[id],(err,result)=>{
    if(err)console.log(err);
  })
})







app.listen(8080, () => {
  console.log("Server is running on port 8080");
})