import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import Members from "./Members";

const Memberslist = ({ children }: { children: React.ReactNode }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-72">
        <ScrollArea className="w-full h-[calc(100vh-280px)]">
          <Members />
          <Members />
          <Members />
          <Members />
          <Members />
          <Members />
          <Members />
          <Members />
          <Members />
          <Members />
         
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default Memberslist;
