import './game.scss';
import React,{useEffect, useState} from 'react';
import Scores from './scores/scores';
import Canvas from './canvas/canvas';
import Chat from './chat/chat';
import Words from './words/words';
import Timer from './timer/timer';

function Game({user,socket,settings}){
    const [currentword,setcurrentword] = useState("");
    const [current_drawer,setcurrent_drawer] = useState(null);
    function update_curr_word(word){
        setcurrentword(word);
    }
    //---------------------------------------------------------//
    useEffect(()=>{      
        socket.emit("get_current_drawer",user.room);
        socket.on("received_active_user",(data)=>{
            setcurrent_drawer(data.current_user);
        });
    },[user,socket]);

    socket.on("Sub_Round_Khatam",(data)=>{
        console.log("Request to re-render",data);
        update_curr_word("Kaddu")
        setcurrent_drawer(data.curr_draw);
    })
    //----------------------------------------------------------//
    console.log("Game_is_rendered with cd:", current_drawer )
    return(  
        <div>
            {
                current_drawer!==null?
                <div>
                    <div className='Game'>
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
                                <Words
                                    user={user}
                                    drawer={current_drawer}
                                    socket={socket}
                                    update_curr_word={update_curr_word}
                                    show_popup={true}
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
                        </div> 
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


/* 
Rounds ke implementation ke liye hai 
/*---------------------------------------------------------//
useEffect(() =>{
    if(settings.nor < current_drawer.round_count){
        setround_ender(true);
    }
},[current_drawer]);

const [round_ender,setround_ender] = useState(false);
//---------------------------------------------------------*/ 
//----------------------------------------------------------// 
    // socket.on("active_user_updated",(data) =>{
    //     setcurrent_drawer(data.user);
    //     //setpopup(true);
    // })
    // socket.on("Sub_Round_Over",(data)=>{
    //     sub_round_over(data.curr_draw);
    // })
    // function sub_round_over(x){
    //     socket.emit("update_chatting_rights",user.room);
    //     if(user.id === x.id){
    //         socket.emit("update_active_user",user.room);
    //     }
    // }    
    //-----------------------------------------------------------//