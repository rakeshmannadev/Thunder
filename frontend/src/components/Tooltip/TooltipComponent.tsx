import { TooltipContent,Tooltip, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import React from 'react'

const TooltipComponent = ({children,text}:{children:React.ReactNode,text:string}) => {
  return (
    <TooltipProvider>
    <Tooltip >
      <TooltipTrigger asChild>
       {children}
      </TooltipTrigger>
      <TooltipContent>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
  )
}

export default TooltipComponent