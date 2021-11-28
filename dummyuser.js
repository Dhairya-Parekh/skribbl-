const c_users = [];

// joins the user to the specific chatroom
function join_User(id, username, room, is_active, round_count) {
  var scores = 0
  var score = 0
  const p_user = { id, username, room, is_active, scores, score};
  c_users.push(p_user);
  console.log(c_users, "users");
  return p_user;
}

// Gets a particular user id to return the current user
function get_Current_User(id) {
  return c_users.find((p_user) => p_user.id === id);
}

// called when the user leaves the chat and its user object deleted from array
function user_Disconnect(id) {
  const index = c_users.findIndex((p_user) => p_user.id === id);
  if (index !== -1) {
    return c_users.splice(index, 1)[0];
  }
}

function get_all_users(room) {
  return c_users.filter((p_user) => p_user.room === room);
}

function get_Active_User(room) {
  return c_users.find((p_user) => p_user.is_active === true && p_user.room === room);
}

//--------------------------------------------------------------------//
function update_active_user(room) {
  var new_arr = c_users.filter((p_user) => p_user.room === room);
  var ind = new_arr.findIndex((p_user)=> p_user.is_active === true);
  var current_id = new_arr[ind].id;
  var next_user_id = new_arr[(ind+1)%new_arr.length].id;
  c_users.find((p_user) => p_user.id === current_id).is_active = false;
  c_users.find((p_user) => p_user.id === next_user_id).is_active = true;
  c_users.find((p_user) => p_user.id === next_user_id).round_count += 1;
  return  c_users.find((p_user) => p_user.id === next_user_id);
}

function update_score(id,time){
  console.log("Lmao Lmao received", id, time)
  c_users.find((p_user) => p_user.id === id).score = 250 - 3*time;
  c_users.find((p_user) => p_user.id === id).scores += 250 - 3*time;
  const user = c_users.find((p_user) => p_user.id === id)
  var new_arr = c_users.filter((p_user) => p_user.room === user.room && !user.is_active );
  console.log("The full array is", c_users)
  console.log("The New_Arr is",new_arr)
  var is_end = true;
  for(var i=0;i<new_arr.length;i++){
    if(new_arr[i].score === 0){
      is_end = false;
      break;
    }
  }
  return is_end;
}

function update_drawer_score(room){
  var new_arr = c_users.filter((p_user) => p_user.room === room && !p_user.is_active );
  var score_drawer = 0;
  for(var i=0;i<new_arr.length;i++){
    score_drawer+=new_arr[i].score;
    c_users.find((p_user) => p_user.id === new_arr[i].id).score = 0;
  }
  score_drawer/=new_arr.length;
  c_users.find((p_user) => p_user.is_active && p_user.room === room).scores+=score_drawer;
}
//--------------------------------------------------------------------//
//-------------------------------------------------------------------//
// function update_score(user,dscore){
//   console.log("Hemlo, User I received************",user)
//   console.log("ALso the cusers array is",c_users)
//   c_users.find((p_user) => p_user.id === user.id).score = dscore; 
//   c_users.find((p_user) => p_user.id === user.id).scores += dscore;

//   var new_arr = c_users.filter((p_user) => p_user.room === user.room && !p_user.is_active );
//   var is_end = true;
//   var score_drawer = 0;
//   for(var i=0;i<new_arr.length;i++){
//     score_drawer+=new_arr[i].score;
//     if(new_arr[i].score === 0){
//       is_end = false;
//       break;
//     }
//   }
//   score_drawer/=new_arr.length;
//   if(is_end){
//     console.log("---- aasaan woord aaya  ---------");
//     console.log("----new array",new_arr);
//     for(var i=0;i<new_arr.length;i++){
//       c_users.find((p_user) => p_user.id === new_arr[i].id).score = 0;
//   }
//   c_users.find((p_user) => p_user.is_active && p_user.room === user.room).scores+=score_drawer;
// }
// return is_end;
// }

//-------------------------------------------------------------------//

//-------------------------------------------------------------------//

//-------------------------------------------------------------------//
module.exports = {
  join_User,
  get_Current_User,
  user_Disconnect,
  get_all_users,
  get_Active_User,
  update_active_user,
  update_score,
  update_drawer_score
};