import "./chat.scss";
import React, { useState, useEffect, useRef } from "react";

function Chat({ user,drawer,socket,currentword }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [can_chat, setcan_chat] = useState(true);
  const messagesEndRef = useRef(null);
  useEffect(() => {
    socket.on("message", (data) => {
      let temp = messages;
      temp.push({
        userId: data.userId,
        username: data.username,
        text: data.text,
      });
      setMessages([...temp]);
    });
  }, [socket, messages]);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);
  const sendData = () => {
    if (text !== "" && user.id !== drawer.id && can_chat) {
      if(currentword === text){
        socket.emit("chat",`${user.username} guessed correctly!!!`);
        setcan_chat(false);
        socket.emit("Gussed_Correctly")
      }
      else{
        socket.emit("chat",text);
      }
      setText("");
    }
  };
  
  return(
    <div className="chat">
      <div className="user-name">
      <ceter>
        <h2>
            {currentword}
        </h2>
      </ceter>
      </div>
      <div className="chat-message">
        {messages.map((i) => {
          if (i.username === user.username) {
            return (
              <div className="message mess-right">
                <p>{i.text}</p>
                <span>{i.username}</span>
              </div>
            );
          } else {
            return (
              <div className="message">
                <p>{i.text} </p>
                <span>{i.username}</span>
              </div>
            );
          }
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="send">
        <input
          placeholder="Type your answer here"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendData();
            }
          }}
        ></input>
        <button onClick={sendData}>Send</button>
      </div>
        </div>
  );
}
export default Chat;


// function Chat({ user,drawer,socket,currentword }) {
//   const [text, setText] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [can_chat, setcan_chat] = useState(true);
//   const [time,settime] = useState(0);
//   console.log("---XXXX----chatcall",currentword);
//   useEffect(() => {
//     socket.on("message", (data) => {

//       let temp = messages;
//       temp.push({
//         userId: data.userId,
//         username: data.username,
//         text: data.text,
//       });
//       setMessages([...temp]);
//     });
//   }, [socket, messages]);
// /*
// useEffect(() =>{
//   console.log(time);
//   socket.on("Time_Now",({data}) =>{
//     settime(data.time);})
  
// }, [setcan_chat,messages]);
// */
//   socket.on("u_c_r",()=>{
//     setcan_chat(true);
//   })
  
//   const sendData = () => {
//     if (text !== "" && user.id !== drawer.id && can_chat) {
//       if(currentword === text){
//         socket.emit("chat",`${user.username} guessed correctly!!!`);
//         setcan_chat(false);
//         console.log("--------mai jo bhej raha--------",user,"----------------------");
//         socket.emit("updateScore",user,250);
        
//       }
//       else{
//         socket.emit("chat",currentword);//?????????????????????????????????????????????????????????????????//Why send currentword. Send text instead
//       }
//       setText("");
//     }
//   };
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(scrollToBottom, [messages]);

//   console.log(messages, "mess");

//   return(
//     <div className="chat">
//       <div className="user-name">
//       <ceter>
//         <h2>
//             {currentword}
//         </h2>
//       </ceter>
//       </div>
//       <div className="chat-message">
//         {messages.map((i) => {
//           if (i.username === user.username) {
//             return (
//               <div className="message mess-right">
//                 <p>{i.text}</p>
//                 <span>{i.username}</span>
//               </div>
//             );
//           } else {
//             return (
//               <div className="message">
//                 <p>{i.text} </p>
//                 <span>{i.username}</span>
//               </div>
//             );
//           }
//         })}
//         <div ref={messagesEndRef} />
//       </div>
//       <div className="send">
//         <input
//           placeholder="Type your answer here"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           onKeyPress={(e) => {
//             if (e.key === "Enter") {
//               sendData();
//             }
//           }}
//         ></input>
//         <button onClick={sendData}>Send</button>
//       </div>
//         </div>
//   );
// }
// export default Chat;