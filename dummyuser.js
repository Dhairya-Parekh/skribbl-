const c_users = [];

// joins the user to the specific chatroom
function join_User(id, username, room, is_active) {
  var scores = 0
  const p_user = { id, username, room, is_active, scores };
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

function get_all_users() {
  return c_users;
}

// Get active user
function get_Active_User(room) {
  console.log("received the room: ",room);
  console.log("Inside get_active_user: ",c_users.find((p_user) => p_user.is_active === true && p_user.room === room));
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

}
//--------------------------------------------------------------------//


module.exports = {
  join_User,
  get_Current_User,
  user_Disconnect,
  get_all_users,
  get_Active_User,
  update_active_user
};