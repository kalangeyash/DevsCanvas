import  io  from 'socket.io-client'
import './App.css'
// import MyCard from './components/MyCard'
import { ThemeProvider } from "@/components/theme-provider"
import { useState } from 'react';
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
  // SidebarFooter,
  SidebarGroup,
  // SidebarHeader,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SidebarProvider } from "@/components/ui/sidebar"




const socket = io(`http://localhost:5080`);
function App() {

  const [joined,setJoined] = useState(true)
  const [roomId, setRoomId] = useState("")
  const[userName,setUserName] = useState("")

  const joinRoom = () =>{
    if (roomId && userName) {
      socket.emit("join", { roomId, userName });
      setJoined(true);
    }
  }
  


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
              {/* <Label htmlFor="framework">Framework</Label>
              */}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-1.5 ">
        {/* <Button variant="outline">Cancel</Button> */}
        <Button onClick={joinRoom}>Join Room</Button>
      </CardFooter>
    </Card>
  </ThemeProvider>
</div>
      )
  }
  const copyRoomId = () =>{
     
  }
  const leaveRoom = () =>{

  }
  return(  
    
      <div className='bg-slate-950 w-screen'>
        
        <div>
        <SidebarProvider>
      <Sidebar className="w-[350px]">
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
            </div>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            <div className='p-2'>
              <p className='text-xl pb-4'>Users in Room</p>
              <ul className='text-lg p-4'>
                <li>YASH</li>
                <li>Aditya</li>
                <li>KAMNA</li>
              </ul>
            </div>
            <div>
              <p>
                User typing...
              </p>
            </div>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            <div className='px-20'>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent >
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
              </SelectContent>
            </Select>
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
      <div className='bg-violet-950'>

        dghj
        </div>  
      </div>
)
}

export default App
