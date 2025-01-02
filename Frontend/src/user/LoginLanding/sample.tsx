import { useEffect } from "react"
import socket from '../../socketConnection'


export function Sample2(){
    useEffect(() => {
        console.log(socket.id)
        socket.on('receive_request', (data) => {
            console.log('New request received:');
            alert('hiiii');
        });
        return () => {
            socket.off('receive_request');
        };
    }, []);

    return (
        <div className="w-[500px] h-[500px] bg-red-300">
            <button onClick={()=>socket.emit('request_send',{id:socket.id,bg:'jskfjk',reciever:'vndhQa_LuDKRBEPeAAAB'})}>click me</button>
        </div>
        
    )
}