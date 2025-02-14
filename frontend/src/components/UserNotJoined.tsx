import {
    AnimatedSpan,
    Terminal,
    TypingAnimation,
  } from "./magicui/terminal";
   

function UserNotJoined() {
  return (
    <div>            
      <Terminal className='h-[350px] w-screen'> 
          <TypingAnimation>&gt; Welcome to DevsCanvas</TypingAnimation>
     
          <AnimatedSpan delay={1500} className="text-green-500 pt-5">
            <span> Preflight checks. ✔</span>
          </AnimatedSpan>
     
          <AnimatedSpan delay={2000} className="text-green-500 pt-3">
            <span> Verifying Internet. ✔</span>
          </AnimatedSpan>
     
          <AnimatedSpan delay={2500} className="text-green-500  pt-3">
            <span> Validating Browser. ✔</span>
          </AnimatedSpan>
     
          <AnimatedSpan delay={5000} className="text-red-500  pt-3">
            <span> User is not Joined .❌</span>
          </AnimatedSpan>
          <AnimatedSpan delay={5000} className="text-red-500  pt-3">
            <span> Try again Later . </span>
          </AnimatedSpan>
     
          
        </Terminal></div>
  )
}

export default UserNotJoined