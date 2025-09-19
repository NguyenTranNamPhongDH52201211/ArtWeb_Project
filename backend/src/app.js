const express = require('express');
const app = express();
const port = 3000;

// import mysql connection
const db = require('./connect'); // file connect.js bạn tạo trước đó

// test route
app.get('/', (req, res) => {
  res.send('Server đã chạy thành công 🚀');
});

 

// start server
app.listen(port, () => {
  console.log(`Server chạy tại http://localhost:${port}`);
});