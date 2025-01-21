import "./App.css"
import React, { useState } from 'react'
import io from 'socket.io-client'


const socket = io("http://192.168.1.74:8080");


const App = () => {
  const[isJoined,setIsJoined] = useState(false);
  const[roomId,setRoomId] = useState("")
  const[username, setUsername] = useState("")

  if(!isJoined){
    return <div className=" join-container flex justify-center   items-center h-screen pt-9 pb-9">
      <div className="join-form ">
          <h1 className="font-semibold text-xl">Enter the room code you want to join</h1>
          <input
          className="pt-3 pb-3 shadow-lg text-center"
            type="text"
            placeholder="Room Id"
            value={roomId}
            onChange={(e)=> setRoomId(e.target.value)}/>
            <h1 className="mt-3 font-semibold text-lg">Enter your username</h1>
          <input
            className="pt-3 pb-3 shadow-lg text-center"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e)=> setUsername(e.target.value)}/>
            <div>
            <button type="button" className=" text-lg mt-5 w-full mt-4text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg  px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Join</button>
            </div>
            
      </div>
    </div>
  }

  return(
  <div className="flex justify-center pt-9 pb-9">
    User Joined
  </div>
  )
  
}

export default App