import './game.scss';
import React,{useEffect, useState} from 'react';
import Scores from './scores/scores';
import Canvas from './canvas/canvas';
import Chat from './chat/chat';
import Words from './words/words';
import Timer from './timer/timer';
const worddict = require('./words/words.json');

function Game({user,socket,settings}){
    //-------------------------Words--------------------------//
    const [currentword,setcurrentword] = useState("Kaddu");
    const [popup,setpopup] = useState(true);
    const [current_drawer,setcurrent_drawer] = useState(null);
    const [round_ender,setround_ender] = useState(false);


/*    //---------------------------------------------------------//
    useEffect(() =>{
        if(settings.nor < current_drawer.round_count){
            setround_ender(true);
        }
    },[current_drawer]);*/
    //---------------------------------------------------------//
    function generate_random_word(){
        return worddict.english[parseInt(Math.random()*worddict.english.length)];
    }
    var s1=generate_random_word();
    var s2=generate_random_word();
    var s3=generate_random_word();
    function set_random_word(s){
        setcurrentword(s);
        setpopup(false);
        socket.emit("start_timer",user.room);
    }
    //---------------------------------------------------------//
    
    useEffect(()=>{      
        socket.emit("get_current_drawer",user.room);
        socket.on("received_active_user",(data)=>{
            setcurrent_drawer(data.current_user);
        });
    },[user,socket]);
    //-----------------------------------------------------------// 
    socket.on("active_user_updated",(data) =>{
        setcurrent_drawer(data.user);
        setpopup(true);
    })    

    socket.on("Sub_Round_Over",(data)=>{
        sub_round_over(data.curr_draw);
    })

    function sub_round_over(x){
        socket.emit("update_chatting_rights",user.room);
        if(user.id === x.id){
            socket.emit("update_active_user",user.room);
        }    
    }    
    //-----------------------------------------------------------//
    console.log("return mein kya aaya ",user);
    return(  
        <div>
            {
                current_drawer!==null?
                <div>
                    <div className='Game'>
                      {round_ender ? 
                      <div>
                          <Scores/>
                      </div>
                      :
                      <div>
                          <div>
                            <Timer
                                user={user}
                                socket={socket}
                                drawer={current_drawer}
                                timelimit={settings.timelimit}
                            />
                        </div>
                        <div className='left'>
                            <Scores
                                roomname={user.room}
                                socket={socket}
                                drawer={current_drawer}
                            />
                        </div>
                        <div>
                            <div>
                                {popup && user.id === current_drawer.id?
                                    <div>
                                        <button onClick={()=>set_random_word(s1)}>{s1}</button>
                                        <button onClick={()=>set_random_word(s2)}>{s2}</button>
                                        <button onClick={()=>set_random_word(s3)}>{s3}</button>
                                    </div>
                                    :null
                                }
                            </div>
                            <div>
                                <button onClick={()=>sub_round_over()}>Next Round</button>
                            </div>
                            <div>
                                <Words
                                    user={user}
                                    drawer={current_drawer}
                                    currentword={currentword}
                                    />
                            </div>
                            <div>
                                <Canvas
                                    user={user}
                                    socket={socket}
                                    drawer={current_drawer}
                                />
                            </div>
                        </div>
                        <div className='right'>
                            <Chat
                                user={user} 
                                drawer={current_drawer}
                                socket={socket}
                                currentword={currentword}
                            /> 
                        </div></div>}  
                    </div>
                </div>
                :
                <div>
                    <h2>
                        Loading...2
                    </h2>
                </div>
            }
        </div>    
    );
}

export default Game;


/* */