import "./scores.scss";
import { useState, useEffect } from "react";
function Scores({ socket, roomname, drawer }) {
  const [userlist, setUserList] = useState([]);
  useEffect(()=>{
    socket.emit("updateusers",{roomname})
  },[socket, roomname])
  socket.on("userList",(data)=>{
    setUserList(data.users)
  })
  return(
    <div className="scores">
      <h1>Scores</h1>
      {userlist.map((i) => {
          return(
            <div>
              {i.id===drawer.id?
              <h2>**</h2>
              :
              null
              }
              <h2>{i.username}</h2>
              <h3>{Number(i.score)}</h3>
            </div>
          );
        })}
    </div>
  );
}
export default Scores;