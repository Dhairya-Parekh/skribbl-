import React,{ useState } from 'react';
const worddict = require('./words.json');

function Words({user, socket ,drawer,update_curr_word}){    
    const [popup,setpopup] = useState("");
    function generate_random_word(){
        return worddict.english[parseInt(Math.random()*worddict.english.length)];
    }
    var s1=generate_random_word();
    var s2=generate_random_word();
    var s3=generate_random_word();
    function set_random_word(s){
        update_curr_word(s);
        setpopup(s);
        socket.emit("start_timer",user.room);
    }
    socket.on("Received_new_word",(data)=>{
        set_random_word(data.word);
    })
    return(
    <div>
        {!popup && user.id === drawer.id?
            <div>
                <button onClick={()=>{
                    set_random_word(s1) 
                    socket.emit("word_has_changed",s1);
                }}>{s1}</button>
                <button onClick={()=>{
                    set_random_word(s2) 
                    socket.emit("word_has_changed",s2);
                }}>{s2}</button>
                <button onClick={()=>{
                    set_random_word(s3) 
                    socket.emit("word_has_changed",s3);
                }}>{s3}</button>
            </div>
            :
            null
        }
    </div>
    );
}

export default Words;