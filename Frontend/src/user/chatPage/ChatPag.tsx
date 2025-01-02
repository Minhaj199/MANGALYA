import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Image, Menu, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { request } from '@/utils/axiosUtils';
import { handleAlert } from '@/utils/alert/sweeAlert';
import socket from '@/socketConnection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import InputEmoji from 'react-input-emoji'
import { EmogiComponent } from './emojiComponent';


const ChatInterface = () => {
  const [messages, setMessages] = useState<{_id:string,text:string,senderId:string,createdAt:string}[]>([]);
  const [input, setInput] = useState('');
  const [chatId,setChatId]=useState('')
  const [recieverData,setRecieverData]=useState<{name:string,image:string}>()
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [emogi,setEmogi]=useState(false)
  const messageBox=useRef<HTMLDivElement>(null)
  const location=useLocation()
  const ref=useRef(0)
  const [onlineStatus,setOnlineStatus]=useState(false)
  useEffect(()=>{
    
    const fetch=async()=>{
      if(chatId){
       
        const messagesResponse:{senderId:string,text:string,createdAt:string,_id:string}[]=await request({url:`/user/getMessages/${chatId}`})
        // console.log(messages)
        setMessages(messagesResponse)
      }
    }
    fetch()
  },[chatId])
  useEffect(()=>{
    socket.emit('register_user',{userId:localStorage.getItem('userToken')})
    
    const receiveMessage=(data:{_id:string,text:string,createdAt:string,senderId:string})=>{
      setMessages(el=>[...el,data])
    }
    socket.on('recieveMessage',receiveMessage)
  
    socket.emit('userJoined',{reciverId:location.state.id,senderId:localStorage.getItem('userToken')})
    const isUserOnelin=(data:{onlineStatus:boolean})=>{
      if(data.onlineStatus){
        setOnlineStatus(true)
      }else{
        setOnlineStatus(false)
      }
    }
    socket.on('userIsOnline',isUserOnelin)

  return ()=>{
 
    socket.off('recieveMessage',receiveMessage)
    socket.off('userIsOnline',isUserOnelin)
  }
  },[])
  useEffect(()=>{
      const fetch=async()=>{
        try {
          const userData:{name:string,photo:string}=await request({url:`/user/userForChat/${location.state.id}`})
         
          console.log(userData)  
          if(userData){
              setRecieverData({image:userData.photo,name:userData.name})
            } 
          const response:{chatRoomData:{_id:string},allMessages:string[]}=await request({url:`/user/getChats`,data:{id:location.state.id},method:'post'})
         
          if(response.chatRoomData){

            console.log(response.chatRoomData._id)
            setChatId(response.chatRoomData._id)
           
          }
        } catch (error) {
          
        }
        
      }
    if(location.state.id&&ref.current===0){
      ref.current++
      fetch()
    }
    
  },[])
  useEffect(()=>{
    console.log(messages)
    if(messageBox.current){
      messageBox.current.scrollTop=messageBox.current.scrollHeight
    }
   
  },[messages])
  const formatTime = (timestamp:Date) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };
User  
  const handleSubmit = async(e:React.FocusEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, {
        _id:'',
        text: input, 
        senderId: location.state.id,
        createdAt: new Date().toISOString()
      }]);
      try {
        const response:{status:boolean,messsage:string}=await request({url:'/user/createChats',data:{senderIdString:location.state.id,chatId:chatId,text:input},method:'post'})
        if(response.messsage) throw new Error(response.messsage||'erro on Chat')
      } catch (error:any) {
        handleAlert('error',error.message)
      }
      socket.emit('sendMessage',{recieverId:location.state.id,text:input,createdAt: new Date().toISOString(),_id:'',})
      setInput('');
    }
  };
  const navigate=useNavigate()
  

  const handleBack=()=>{
    // socket.emit('exitedFromChatRoom','')
    navigate('/match')
  }
  return (
    <div className="flex flex-col  h-screen max-w-4xl  bg-gradient-to-b from-gray-50 to-white shadow-xl ">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4  flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button onClick={handleBack} className="text-white hover:bg-blue-500/50 p-2 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <img src={recieverData?.image} alt="Profile" className="w-14 h-14 rounded-full border-2 border-white shadow-md"/>
          <div>
            <h2 className="text-white font-semibold text-lg">{recieverData?.name}</h2>
            {onlineStatus&&<span className="text-blue-100 text-sm flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              online
            </span>}
          </div>
        </div>
              </div>
      
              <div
  style={{ scrollBehavior: 'smooth' }}
  ref={messageBox}
  className="flex-1 overflow-y-auto p-4 space-y-4 "
>

  {messages.map((message, index) => (
    <div
      key={index}
      className={`flex items-start justify-end space-x-2 animate-fadeIn ${
        message.senderId === location.state.id
          ? '' 
          : 'flex-row-reverse space-x-reverse justify-end'      }`}
    >
     
      <div className="flex flex-col">
        <span
          className={`text-xs mb-1 ${
            message.senderId === location.state.id
              ? 'text-right' 
              : 'text-left' 
          } text-gray-500`}
        >
          {message.senderId === location.state.id ? 'You' : recieverData?.name}
        </span>

        <div
          className={`relative max-w-xs md:max-w-md p-3 rounded-2xl shadow-sm break-words ${
            message.senderId === location.state.id
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-none' // Outgoing style
              : 'bg-white border text-gray-800 rounded-tl-none' // Incoming style
          }`}
        >
          {message.text}
          <span className="block text-xs mt-1 opacity-75">
            {formatTime(new Date(message.createdAt))}
          </span>
        </div>
      </div>
    </div>
  ))}
  {/* Keeps the latest message in view */}
  <div ref={messagesEndRef} />
</div>

      <div className="p-4 bg-white border-t border-gray-100 shadow-lg">
        <form onSubmit={handleSubmit}  className="flex gap-3">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() =>fileInputRef.current?fileInputRef.current.click():undefined}
            className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
          >
            <Image size={20} />
          </button>
          <div className='w-full relative'>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className=""
          />
          <FontAwesomeIcon onClick={()=>setEmogi(el=>!el)} size='2xl' icon={faFaceSmile} className='text-[#000000] absolute right-4 top-3' />
          {emogi&& <div className='w-52 h-52 bg-green-400 absolute -top-40 right-0'>
                      
                      <EmogiComponent/>
                        </div>}
          </div>
          <button
            type="submit"
            className="px-4  bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <Send size={18} type='submit' className="transform rotate-45" />

          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;