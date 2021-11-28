const express = require("express");
const app = express();
const socket = require("socket.io");
const color = require("colors");
const cors = require("cors");
const { get_Current_User, user_Disconnect, join_User, get_all_users, get_Active_User, update_active_user, update_score, update_drawer_score, isroomempty, isgameover} = require("./dummyuser");

app.use(express());

const port = 8000;

app.use(cors());

var server = app.listen(
  process.env.PORT || port,
  console.log(
    `Server is running on the port no: ${(port)} `
      .green
  )
);

const io = socket(server);

//initializing the socket io connection 
io.on("connection", (socket) => {
  
  socket.on("joinRoom", ({ username, roomname }) => {
    var p_user=null;
    if(isroomempty(roomname)){
      p_user = join_User(socket.id, username, roomname, true, 1);}
    else{
     p_user = join_User(socket.id, username, roomname, false, 0);}
      
    socket.join(p_user.room);
    socket.emit("message", {
      userId: p_user.id,
      username: p_user.username,
      text: `Welcome ${p_user.username}`,
    });
  
    //displays a joined room message to all other room users except that particular user
    socket.broadcast.to(p_user.room).emit("message", {
      userId: p_user.id,
      username: p_user.username,
      text: `${p_user.username} has joined the chat`,
        });
  
      //socket.emit("updateusers");
  });
  

  

  socket.on("chat", (text) => {
    //gets the room user and the message sent
    const p_user = get_Current_User(socket.id);
    io.to(p_user.room).emit("message", {
      userId: p_user.id,
      username: p_user.username,
      text: text,
    });
  });

  socket.on("disconnect", () => {
    //the user is deleted from array of users and a left room message displayed
    const p_user = user_Disconnect(socket.id);
    if (p_user) {
      io.to(p_user.room).emit("message", {
        userId: p_user.id,
        username: p_user.username,
        text: `${p_user.username} has left the room`,
      });
      io.to(p_user.room).emit("updateusers",{roomname:p_user.room});
    }
  });

  socket.on("updateusers", (room) => {
    const p_user_arr = get_all_users(room.roomname);
    io.to(p_user_arr[0].room).emit("userList",{users: p_user_arr});
  });

  socket.on("get_current_drawer", (roomname) => {
    const p_user = get_Active_User(roomname);
    socket.emit("received_active_user", {
      current_user: p_user,
    });
  });

  socket.on("get_current_user", () => {
    const p_user = get_Current_User(socket.id);
    socket.emit("received_current_user", {
      current_user: p_user,
    });
  });

  socket.on("draw", (draw_data) => {
    const p_user = get_Current_User(socket.id);
    io.to(p_user.room).emit("do_drawing", {
      draw_data: draw_data,
    });
  });

  socket.on("start_timer",(room)=>{
    io.to(room).emit("Timer_On");
  })

  socket.on("time_over",(room)=>{
    console.log("Received the time over in room",room);
    io.to(room).emit("Stop_Timer");
    update_drawer_score(room);
    const curr_draw = update_active_user(room);
    io.to(room).emit("Sub_Round_Khatam",{curr_draw:curr_draw});
    console.log("Sub Round Finally khatam emitted new_user",curr_draw);
  })

  socket.on("Start_Game_For_All",()=>{
    const p_user = get_Current_User(socket.id);
    io.to(p_user.room).emit("Start_Game");
  })
  socket.on("isgameover",(data) => {
    var x = isgameover(data,socket.id);
    const p_user = get_Current_User(socket.id);
    if(x){
      io.to(p_user.room).emit("GameOver");
    }

  })
  
  socket.on("word_has_changed",(s)=>{
    const p_user = get_Current_User(socket.id);
    io.to(p_user.room).emit("Received_new_word", {
      word: s,
    });
  })

  socket.on("Gussed_Correctly",()=>{
    const p_user = get_Current_User(socket.id);
    console.log("Guss correct event is catched");
    io.to(p_user.room).emit("Stop_Timer");
    //socket.emit("get_current_time")
    console.log("Yup Here I am with current time:",30)
    var is_end = update_score(socket.id,30)
    console.log("Yup Here I am with current isEnd:",is_end)
    if(is_end){

      console.log("Is_end_ke andar hu",p_user.room)
      update_drawer_score(p_user.room);
      const curr_draw = update_active_user(p_user.room);
      io.to(p_user.room).emit("Sub_Round_Khatam",{curr_draw:curr_draw});
      console.log("Sub Round khatam emitted new_user",curr_draw);
      console.log("Yes the time is up from g_c")
    }
  })

  // socket.on("Receive_current_time",(data)=>{
  //   console.log("Yup Here I am with current time:",data)
  //   var is_end = update_score(socket.id,data)
  //   console.log("Yup Here I am with current isEnd:",is_end)
  //   if(is_end){
  //     const p_user = get_Current_User(socket.id);
  //     socket.emit("time_over",p_user.room);
  //     console.log("Yes the time is up")
  //   }
  // })

  //------------------------------------------------------//
  socket.on("update_active_user",(room) => {
    const user = update_active_user(room);
    console.log(user);
    io.to(room).emit("active_user_updated",{user:user});
  })

  // //------------------------------------------------------//
  // //-----------------------------------------------------//
  // socket.on("updateScore",(user,dscore) => {
  //   console.log("Huiuiuiuiui User me received ",user)
  //   const is_end = update_score(user,dscore);
  //   const curr_draw = get_Active_User(user.room);
  //   if(is_end){
  //     io.to(user.room).emit("Sub_Round_Over",{curr_draw:curr_draw});
  //   }
  // })
  // //-----------------------------------------------------//
  // //-----------------------------------------------------//
  // //-----------------------------------------------------//
  // //----------------------------------------------------//

  // // socket.on("time_over",(room)=>{
  // //   const curr_draw = get_Active_User(room);
  // //   update_drawer(room);
  // //   io.to(room).emit("Sub_Round_Over",{curr_draw:curr_draw});
  // // })
  // //----------------------------------------------------//
  // //----------------------------------------------------//
  // socket.on("reset_timer",(room)=>{
  //   io.to(room).emit("Reset_Timer");
  // })
  // //----------------------------------------------------//
  // //---------------------------------------------------//
  // socket.on("update_chatting_rights",(room)=>{
  //   io.to(room).emit("u_c_r");
  // })
  // //---------------------------------------------------//
  // //---------------------------------------------------//
  // /*socket.on("time_now",(data)=>{
  //   console.log("***********recieved time at server*********",data.time);
  //   io.to(data.room).emit("Time_Now",{time:data.time});
  // })*/
  // //----------------------------------------------------//
});

const path = require('path');
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'chatfrontend/build')));
// Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'chatfrontend/build', 'index.html'));
  });
}
const whitelist = ['http://localhost:3000', 'http://localhost:8000','https://fourskribblrs.herokuapp.com/']
const corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("Origin acceptable")
      callback(null, true)
    } else {
      console.log("Origin rejected")
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions))

