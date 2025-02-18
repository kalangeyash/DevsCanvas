import  io  from 'socket.io-client'
import './App.css'
// import MyCard from './components/MyCard'
import { ThemeProvider } from "@/components/theme-provider"
import { useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"



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
  
  return(  
    
      <SidebarProvider>
      <AppSidebar />
    </SidebarProvider>  
  
)
}

export default App
