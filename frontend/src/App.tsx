import  io  from 'socket.io-client'
import './App.css'
import { ThemeProvider } from "@/components/theme-provider"
import { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react'
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "./components/magicui/terminal";
 

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
  const [code,setCode] = useState(" // start code here ...  ")
  const [copySuccess,setCopySuccess] = useState("")
  const [users,setUsers] = useState([]);
  const [typing,setTyping] = useState("")
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [output, setOutput] = useState("")
  const [version, ] = useState("*")

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
  
  socket.on("codeResponse",(response)=>{
    setOutput(response.run.output)
  })

  return ()=>{
    socket.off("userJoined")
    socket.off("codeUpdate")
    socket.off("userTyping")
    socket.off("languageUpdate")
    socket.off("codeResponse")
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
  socket.emit("leaveRoom")
  setJoined(false);
  setRoomId("");
  setUserName("");
  setCode(" // start code here ... ");
  setLanguage("javascript")

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

const runCode = ()=>{
  socket.emit("compileCode",{code,roomId,language,version})
}

  if(!joined)
  {
    return (
    //   <div className='flex justify-center mt-40'>
    //         <ThemeProvider  defaultTheme="dark" storageKey="vite-ui-theme">
    //             <UserNotJoined/>
    //       </ThemeProvider>
    // </div>
<div className="flex min-h-screen items-center justify-center px-4">
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <div className="flex flex-col items-center space-y-6">
      <Terminal>
        <TypingAnimation>&gt; Welcome to DevsCanvas</TypingAnimation>
      </Terminal>

      <Card className="w-[400px] max-w-[400px] h-[350px]">
        <CardHeader>
          <CardTitle className="font-bold text-2xl text-center">Create or Join Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="roomId" className="pb-2">Room ID</Label>
              <Input id="roomId" placeholder="---" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="userName" className="pb-2">Name</Label>
              <Input id="userName" placeholder="Your Name" value={userName} onChange={(e) => setUserName(e.target.value)} />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <Button className="w-full" onClick={joinRoom}>Join Room</Button>
        </CardFooter>
      </Card>
    </div>
  </ThemeProvider>
</div>

      )
  }

  return(  
    
    <div className="mx-14 w-screen h-screen lg:flex-row">
    {/* Editor Section */}
    {/* <div className='w-screen h-screen'> */}
    <Editor
      className="flex-1  -mt-8 mx-2 "
      width={"100%"}
      height={"60%"}
      defaultLanguage={language}
      language={language}
      value={code}
      onChange={handleCodeChange}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
      }}
      loading
    />

    {/* </div> */}
      <div className='flex'>
                <Button className='bg-slate-50 mx-4' onClick={runCode}>Execute</Button>
                <div className='border-solid  border-gray-100'>
                <textarea className='text-white  bg-black h-[300px] w-screen ' value={output} readOnly placeholder='Output will appear here >>>' />
                </div>
      </div>
  
    {/* Sidebar */}
    <div className={`${isSidebarOpen ? "block" : "hidden"} xl:block`}>
      <SidebarProvider>
        <Sidebar className="w-[300px] bg-gray-800 text-white h-screen">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>DevsCanvas</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <div className="mt-8 flex flex-col">
                    <p className="px-4">Room Code: {roomId}</p>
                    <Button className="mx-16 m-4" onClick={copyRoomId}>
                      Copy Id
                    </Button>
                    {copySuccess && (
                      <span className="text-green-400">{copySuccess}</span>
                    )}
                  </div>
                  <hr className="h-px my-8 bg-gray-700 border-0" />
                  <div className="p-2">
                    <p className="text-xl pb-4">Users in Room</p>
                    <ul className="text-lg p-4">
                      {users.map((user, index) => (
                        <li key={index}>{user}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p>{typing}</p>
                  </div>
                  <hr className="h-px my-8 bg-gray-700 border-0" />
                  <div className="flex justify-center">
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
                  <hr className="h-px my-8 bg-gray-700 border-0" />
                  <Button className="mx-16 mt-4" onClick={leaveRoom}>
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
