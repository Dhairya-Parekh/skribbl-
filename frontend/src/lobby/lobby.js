import React,{useState, useEffect} from 'react';
import { Redirect } from "react-router-dom";
import './lobby.scss';

function Userlist({ socket, roomname}) {
    const [userlist, setUserList] = useState([]);
    useEffect(()=>{
      socket.emit("updateusers",{roomname})
    },[socket, roomname])
    socket.on("userList",(data)=>{
      setUserList(data.users)
    })
    return(
      <div className="PlayerList">
        <h1>Players</h1>
        {userlist.map((i) => {
            return(
              <div>
                <h2>{i.username}</h2>
              </div>
            );
          })}
      </div>
    );
}


function Lobby({user,socket}){
    const [startGame,setStartGame] = useState(false)
    const [round, setRound] = useState(3)
    const [time, setTime] = useState(20)
    function Start_The_Game(){
        socket.emit("update_settings",{nor: round,timelimit: time})
        socket.emit("Start_Game_For_All")
    }
    function Change_Rounds(e){
        setRound(e.currentTarget.value)
    }
    function Change_Time(e){
        setTime(e.currentTarget.value)
    }    
    socket.on("Start_Game",()=>{
        setStartGame(true);
    })
    
    return(
        <div>
        {
            startGame?
            <div>
                <Redirect to={`/game/${user.room}/${user.username}`}/>
            </div>
            :
            <div>
                <div>
                    <Userlist
                        roomname={user.room}
                        socket={socket}
                    />
                </div>
                {
                    user.is_active?
                    <div className="settings">
                        <div>
                            <h3>
                                Rounds
                            </h3>
                            <div>
                            <input
                                defaultValue="3"
                                type="range"
                                min="2"
                                max="6"
                                onChange={Change_Rounds}
                                className="slider"
                            />
                           </div>
                        </div>
                        <div>
                            <h3>
                                Time
                            </h3>
                            <div>
                            <input 
                                defaultValue="20"
                                type="range"
                                min="10"
                                max="80"
                                onChange={Change_Time}
                                className="slider"
                            />
                            </div>
                        </div>
                        <button onClick={Start_The_Game}>Enter Room</button>
                    </div>
                    :
                    <div>
                        <h2>
                            Please Wait for the host to start the game
                        </h2>
                    </div>
                }
            </div>
        }
        </div>
    );
}

export default Lobby;