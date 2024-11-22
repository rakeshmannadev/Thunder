import UsersListSkeleton from "@/components/Skeleton/UsersListSkeleton";
import TooltipComponent from "@/components/Tooltip/TooltipComponent";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Ban, Crown, UserCog } from "lucide-react";
import { Link } from "react-router-dom";

const Members = () => {
  const isLoading = false;
  return (
    <div className="flex flex-col items-center gap-3 mt-2 hover:bg-zinc-600 rounded-md p-2 text-nowrap">
      {isLoading ? <UsersListSkeleton /> :
      <div className="flex items-center">
        <Link
          to={`/profile/423423`}
          className=" relative flex items-center gap-3"
        >
          <Avatar>
            <AvatarImage />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <div
            className={`absolute bottom-0 left-0 h-3 w-3 rounded-full ring-2 ring-zinc-900 bg-green-500 }`}
          />
          <p>Jone doe</p>
        </Link>
        <div className="flex gap-1 items-center">
          <TooltipComponent text="Kick user">
            <Button
              size="icon"
              variant="ghost"
              className="text-zinc-100 hover:text-white"
            >
              <Ban className="size-4" color="red" />
            </Button>
          </TooltipComponent>
          <TooltipComponent text="Modarator">
            <Button
              size="icon"
              variant="ghost"
              className="text-zinc-100 hover:text-white"
            >
              <UserCog className="size-4" />
            </Button>
          </TooltipComponent>
          <TooltipComponent text="Admin">
            <Button
              size="icon"
              variant="ghost"
              className="text-zinc-100 hover:text-white"
            >
              <Crown className="size-4" color="yellow" />
            </Button>
          </TooltipComponent>
        </div>
      </div>}
    </div>
  );
};

export default Members;
