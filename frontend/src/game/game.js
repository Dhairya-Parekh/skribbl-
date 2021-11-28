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
    const [go,setgo] = useState(false);
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
        socket.emit("chat",`The word was '${currentword}'`);
        update_curr_word("");
        setcurrent_drawer(data.curr_draw);
        if(user.id === current_drawer.id){
        socket.emit("isgameover",(settings.nor));}
    })
    socket.on("GameOver",()=>{
        setgo(true);
    })
    //----------------------------------------------------------//
    console.log("Game_is_rendered with cd:", current_drawer )
    return(  
       <div>
           {go ? <div>
               <h2>Game</h2>
           </div> 
           : <div>
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
       </div>} 
     </div>
        
    );
}

export default Game;

   
