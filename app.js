const exp = require('constants');
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

io.on("connection", (socket) => {
  socket.on("send-location", (data)=>{
    io.emit("receive-location", {id: socket.id, ...data});
  });
  socket.on("disconnect", () => {
    io.emit("user-disconnected", {id: socket.id});
  });
});

app.get('/', (req, res) => {
  res.render('index');
}); 

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});