
import socket from './socketConnection'

const socketContext=useContext(null)

export const SocketProvider=({children})=>{
  
    useEffect(()=>{
        const userId=localStorage.getItem('userToken')
        if(userId){
            socket.emit('register_user',{userId:userId})
        }
        return ()=>{
            socket.close()
        }
    },[])
    return <
}