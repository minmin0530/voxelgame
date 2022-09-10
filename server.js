const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const http = require('http').Server(app);
const fs = require('fs');
const server = require('https').createServer({
  key: fs.readFileSync(__dirname + '/server_withpass.key'),
  cert: fs.readFileSync(__dirname + '/server.crt'),
  passphrase: 'primitive1A'
}, app)

const io = require('socket.io')(server);
const session = require('express-session');
const port = 443
const url = 'mongodb://localhost:27017';
const dbName = 'myMongo';
const connectOption = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 1000 * 60
    }
}));

function colorToText(mm) {
  let colorText = '#';
  let m1 = Math.floor(mm.r * 255 % 16);
  let m2 = Math.floor(mm.r * 255 / 16);
  if      (m1 == 10) { m1 = 'a'; }
  else if (m1 == 11) { m1 = 'b'; }
  else if (m1 == 12) { m1 = 'c'; }
  else if (m1 == 13) { m1 = 'd'; }
  else if (m1 == 14) { m1 = 'e'; }
  else if (m1 == 15) { m1 = 'f'; }
  if      (m2 == 10) { m2 = 'a'; }
  else if (m2 == 11) { m2 = 'b'; }
  else if (m2 == 12) { m2 = 'c'; }
  else if (m2 == 13) { m2 = 'd'; }
  else if (m2 == 14) { m2 = 'e'; }
  else if (m2 >= 15) { m2 = 'f'; }
  colorText += m2 + '' + m1;
  m1 = Math.floor(mm.g * 255 % 16);
  m2 = Math.floor(mm.g * 255 / 16);
  if      (m1 == 10) { m1 = 'a'; }
  else if (m1 == 11) { m1 = 'b'; }
  else if (m1 == 12) { m1 = 'c'; }
  else if (m1 == 13) { m1 = 'd'; }
  else if (m1 == 14) { m1 = 'e'; }
  else if (m1 == 15) { m1 = 'f'; }
  if      (m2 == 10) { m2 = 'a'; }
  else if (m2 == 11) { m2 = 'b'; }
  else if (m2 == 12) { m2 = 'c'; }
  else if (m2 == 13) { m2 = 'd'; }
  else if (m2 == 14) { m2 = 'e'; }
  else if (m2 >= 15) { m2 = 'f'; }
  colorText += m2 + '' + m1;
  m1 = Math.floor(mm.b * 255 % 16);
  m2 = Math.floor(mm.b * 255 / 16);
  if      (m1 == 10) { m1 = 'a'; }
  else if (m1 == 11) { m1 = 'b'; }
  else if (m1 == 12) { m1 = 'c'; }
  else if (m1 == 13) { m1 = 'd'; }
  else if (m1 == 14) { m1 = 'e'; }
  else if (m1 == 15) { m1 = 'f'; }
  if      (m2 == 10) { m2 = 'a'; }
  else if (m2 == 11) { m2 = 'b'; }
  else if (m2 == 12) { m2 = 'c'; }
  else if (m2 == 13) { m2 = 'd'; }
  else if (m2 == 14) { m2 = 'e'; }
  else if (m2 >= 15) { m2 = 'f'; }
  colorText += m2 + '' + m1;
  return colorText;
}


const transactionKururiDownload = async (data, req, res) => {
  let client;
  let login = false;
  try {
    client = await MongoClient.connect(url, connectOption);
    const db = client.db(dbName);
    const collection = db.collection('account');
      await collection.find({}).toArray( (err, docs) => {
        for (const doc of docs) {
          if (doc.mail == data.mail) {
            if (doc.password == data.password) {
              login = true;
              req.session.name = doc.name;
              res.sendFile(__dirname + "/html/index.html");
            }
          }
        }
        if (!login) {
          res.send("login error");
        }
      });
  } catch (error) {
    console.log(error);
  } finally {
//    client.close();
  }
};

const transactionKururiInsert = async (data, res) => {
  let client;
  const color = {
    r: Math.random(),
    g: Math.random(),
    b: Math.random()
  }
  data = Object.assign(data, {date: new Date(), color: colorToText(color) });
  try {
    client = await MongoClient.connect(url, connectOption);
    const db = client.db(dbName);
    const collection = db.collection('account');
    //await collection.updateOne({mail:data.mail, password:data.password, name:data.name, date:data.date}, {$set:data}, true );
    await collection.insertOne(data);
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

const insertRoom = async (data, res) => {
  let client;
//  data = Object.assign(data, {create_date: new Date() });
  try {
    client = await MongoClient.connect(url, connectOption);
    const db = client.db(dbName);
    const collection = db.collection('room');
    await collection.insertOne(data);
    await res.json({result: data});
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};
const getRoom = async (res) => {
  let client;
  try {
    client = await MongoClient.connect(url, connectOption);
    const db = client.db(dbName);
    const collection = db.collection('room');
      await collection.find({}).toArray( (err, docs) => {
        res.json({rooms: docs});
      });
  } catch (error) {
    console.log(error);
  } finally {
//    client.close();
  }
};
const getGameData = async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(url, connectOption);
    const db = client.db(dbName);
    const collection = db.collection('account');
      await collection.find({name: req.session.name}).toArray( (err, docs) => {
        console.log(docs);
        res.json({playerid: docs[0]._id, playername: req.session.name, roomid: req.session.roomid, time: req.session.time, color: docs[0].color});
      });
  } catch (error) {
    console.log(error);
  } finally {
//    client.close();
  }
};
const updateRoomMember = async (data) => {
  let client;
  try {
    client = await MongoClient.connect(url, connectOption);
    const db = client.db(dbName);
    const collection = db.collection('room');
    await collection.updateOne({_id: ObjectId(data.roomid) }, {$push : {memberid: data.playerid, membercolor: data.color, membername: data.playername} }, {upsert: true} );
    const roomData = await collection.findOne({_id: ObjectId(data.roomid) });
    io.to(data.roomid).emit("updateRoomData", roomData);
  } catch (error) {
    console.log(error);
  } finally {
//    client.close();
  }
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/create_room', (req, res) => {
  insertRoom(req.body, res)
})
app.get('/get_room', (req, res) => {
  getRoom(res);
})
app.get('/', (req, res) => {
  if (req.session.name) {
    res.sendFile(__dirname + '/html/index.html')
  } else {
    res.sendFile(__dirname + '/html/login.html')
  }
})
app.get('/gametime', (req, res) => {
  getGameData(req, res)
//  res.json({time: req.session.time});
})
app.post('/game', (req, res) => {
  req.session.time = req.body.time;
  req.session.roomid = req.body.roomid;
  res.sendFile(__dirname + '/html/game.html')
})
app.get('/room_list.js', (req, res) => {
  res.sendFile(__dirname + "/src/room_list.js")
})
app.get('/game.js', (req, res) => {
  res.sendFile(__dirname + '/src/game.js')
})
app.get('/three.min.js', (req, res) => {
  res.sendFile(__dirname + '/lib/three.min.js')
})
app.get('/style.css', (req, res) => {
  res.sendFile(__dirname + '/css/style.css')
})

app.get('/username', (req, res) => {
  res.json({name: req.session.name});
});
app.get('/signup', (req, res) => {
  res.sendFile(__dirname + "/html/signup.html");
});

app.post('/signup', async (req, res) => {
  let client;
  let exist = false;
  try {
    client = await MongoClient.connect(url, connectOption);
    const db = client.db(dbName);
    const collection = db.collection('account');
      await collection.find({}).toArray( (err, docs) => {
        console.log(docs);
        for (const doc of docs) {
          if (doc.mail == req.body.mail){
            console.log(req.body.mail);
            exist = true;
          }
        }

        let user = {mail:"", name:"", password:""};

        if (!exist && req.body.mail != "" && req.body.password != "") {
          user["mail"] = req.body.mail;
          user["password"] = req.body.password;
          user["name"] = req.body.displayname; //user.mail.substr(0, user.mail.indexOf("@"));
          transactionKururiInsert(user, res);

          res.sendFile(__dirname + "/html/signuped.html");
        } else {
          res.sendFile(__dirname + "/html/signuperror.html");
        }
      });
  } catch (error) {
    console.log(error);
  } finally {
//    client.close();
  }
});


app.post('/', (req, res) => {

  let user = {
    mail:"", name:"", password:""
  };

  user["mail"] = req.body.mail;
  user["password"] = req.body.password;
//  user["name"] = req.body.displayname; //user.mail.substr(0, user.mail.indexOf("@"));
  transactionKururiDownload(user, req, res);

});


io.on('connection', socket => {

  socket.on('getUserId', data => {
    console.log(data);
    socket.join(data.roomid);
    updateRoomMember(data);
  });
  socket.on('pushUpKey', data => {
    console.log(data.roomid);
    io.to(data.roomid).emit('pushUpKey', data);
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})