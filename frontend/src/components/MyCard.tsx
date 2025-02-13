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


  
function MyCard() {
  return (
    <div>
        <Card className="w-[400px] h-[450px]">
      <CardHeader>
        <CardTitle className="font-bold text-2xl ">Create or Join project</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5 p-5">
              <Label htmlFor="name" className="pb-5">Room Id</Label>
              <Input id="name" placeholder="xxx" />
            </div>
            <div className="flex flex-col space-y-1.5 p-5">
              <Label htmlFor="name" className="pb-5">Name</Label>
              <Input id="name" placeholder="Your Name" />
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
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  </div>
  )
}

export default MyCard