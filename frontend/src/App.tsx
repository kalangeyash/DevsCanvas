import  io  from 'socket.io-client'
import './App.css'
import { ThemeProvider } from "@/components/theme-provider"
import { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar"

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SidebarProvider } from "@/components/ui/sidebar"

const socket = io(`http://localhost:5080`);
function App() {

  const [joined,setJoined] = useState(false)
  const [roomId, setRoomId] = useState("");
  const[userName,setUserName] = useState("")
  const [language,setLanguage] = useState("javascript")
  const [code,setCode] = useState("")
  const [copySuccess,setCopySuccess] = useState("")
  const [users,setUsers] = useState([]);
  const [typing,setTyping] = useState("")
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

useEffect(()=>{
  socket.on("userJoined",(users)=>{
    setUsers(users)
  })
  
  socket.on("codeUpdate",(newCode) =>{
    setCode(newCode);
  })
  socket.on("userTyping", (user: string) => {
    if (!user) return;
  
    setTyping(`${user} is typing...`);
  
    // Clear previous timeout before setting a new one
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
  
    typingTimeout.current = setTimeout(() => {
      setTyping("");
    }, 1000);
  })

  socket.on("languageUpdate",(newLanguage)=>{
    setLanguage(newLanguage)
  })

  return ()=>{
    socket.off("userJoined")
    socket.off("codeUpdate")
    socket.off("userTyping")
    socket.off("languageUpdate")
  }
},[])

useEffect(()=>{
  const handleBeforeunload = ()=>{
    socket.emit("leaveRoom");

    window.addEventListener("beforeunload" ,handleBeforeunload)
  }
},[])

  const joinRoom = () =>{
    if (roomId && userName) {
      socket.emit("join", { roomId, userName });
      setJoined(true);
    }
  }
  const copyRoomId = () =>{
    navigator.clipboard.writeText(roomId)
    setCopySuccess("Copied!")
    setTimeout(()=>{
     setCopySuccess(" ")
    },2000)
 }
 const leaveRoom = () =>{

 }
 const handleCodeChange = (newCode = "")=>{
   setCode(newCode)
   socket.emit("codeChange",{roomId,code:newCode})
   socket.emit("typing",{roomId,userName})
 }
//  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>)=>{
//   const newLanguage = e.target.value
//   setLanguage(newLanguage)
//   socket.emit("languageChange",{roomId,language:newLanguage})
//  }
const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const newLanguage = e.target.value;
  setLanguage(newLanguage);

  if (!roomId) {
    console.error("roomId is undefined, cannot emit event.");
    return;
  }

  if (!socket.connected) {
    console.error("Socket is not connected!");
    return;
  }

  console.log("Emitting languageChange event:", { roomId, language: newLanguage });

  socket.emit("languageChange", { roomId, language: newLanguage });
};


  if(!joined)
  {
    return (
    //   <div className='flex justify-center mt-40'>
    //         <ThemeProvider  defaultTheme="dark" storageKey="vite-ui-theme">
    //             <UserNotJoined/>
    //       </ThemeProvider>
    // </div>
    <div className='flex justify-center mt-40'>
    <ThemeProvider  defaultTheme="dark" storageKey="vite-ui-theme">
    <Card className="w-[400px] h-[450px]">
      <CardHeader>
        <CardTitle className="font-bold text-2xl ">Create or Join project</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5 p-2">
              <Label htmlFor="name" className="pb-5">Room Id</Label>
              <Input  id="name" placeholder="---" value={roomId} onChange={(e) =>{
                setRoomId(e.target.value)
              }} />
            </div>
            <div className="flex flex-col space-y-1.5 p-2">
              <Label htmlFor="name" className="pb-5">Name</Label>
              <Input id="name" placeholder="Your Name" value={userName} onChange={(e) =>{
                setUserName(e.target.value)
              }}/>
            </div>
            <div className="flex flex-col space-y-1.5">
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-1.5 ">
        
        <Button onClick={joinRoom}>Join Room</Button>
      </CardFooter>
    </Card>
  </ThemeProvider>
</div>
      )
  }

  return(  
    
      <div className='h-max '>
        <Editor className='w-max h-screen -mt-8 mx-1.5' width={1460} height={"100%"} defaultLanguage={language} language={language} value={code} onChange={handleCodeChange} theme='vs-dark' options={{
          minimap :{enabled : false},
          fontSize : 14 ,
        }} loading/>

        <div> 
        <SidebarProvider>
      <Sidebar className="w-[300px]">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>DevsCanvas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
            <div className='mt-8 flex flex-col '>
              <p className='px-4'>Room Code : {roomId} </p> 
              <Button className='mx-16 m-4' onClick={copyRoomId} >
                Copy Id
              </Button>
              {copySuccess &&<span className='text-green-400'>{copySuccess}</span>}
            </div>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            <div className='p-2'>
              <p className='text-xl pb-4'>Users in Room</p>
              <ul className='text-lg p-4'>
                  {/* <li>YASH</li>
                  <li>Aditya</li>
                  <li>KAMNA</li> */}
                  {
                    users.map((user,index)=>(
                      <li key={index}>
                        {user}
                      </li>
                    ))
                  }
              </ul>
            </div>
            <div>
              <p>
                {typing}
              </p>
            </div>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            <div className='flex justify-center'> 
              <select 
        className="w-[180px] p-2 border rounded-md bg-gray-500" 
        value={language} 
        onChange={handleLanguageChange}
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="cpp">C++</option>
      </select>
            </div>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            <Button className='mx-16 mt-4' onClick={leaveRoom} >
                Leave Room
              </Button>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent> 
    </Sidebar>
    </SidebarProvider>
      </div>  
      </div>
)
}

export default App
