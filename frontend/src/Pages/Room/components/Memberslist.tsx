import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect } from "react";
import Members from "./Members";
import useRoomStore from "@/store/useRoomStore";

const Memberslist = ({ children,roomId }: { children: React.ReactNode,roomId:string }) => {
const {fetchRoomMembers,members,isLoading} = useRoomStore()
  useEffect(()=>{
    fetchRoomMembers(roomId);
    
  },[roomId])

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-72">
        <ScrollArea className="w-full h-fit">
          {members && members.map((member)=>(
            <Members key={member._id} member={member} isLoading={isLoading}  />

          ))}
          
         
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default Memberslist;
