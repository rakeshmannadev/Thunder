import UsersListSkeleton from "@/components/Skeleton/UsersListSkeleton";
import TooltipComponent from "@/components/Tooltip/TooltipComponent";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useRoomStore from "@/store/useRoomStore";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { User } from "@/types";
import { Ban, Crown, UserCog } from "lucide-react";
import { Link } from "react-router-dom";

const Members = ({
  member,
  isLoading,
}: {
  member: User;
  isLoading: boolean;
}) => {
  const { activeUsers, kickMember } = useSocketStore();
  const { currentUser } = useUserStore();
  const { currentRoom } = useRoomStore();

  const isActive =
    Array.isArray(activeUsers) && activeUsers.includes(member._id.toString());
  return (
    <div className="flex flex-col items-center gap-3 mt-2 hover:bg-zinc-600 rounded-md p-2 text-nowrap">
      {isLoading ? (
        <UsersListSkeleton />
      ) : (
        <div className="flex items-center ">
          <Link
            to={`/profile/${member._id}`}
            className=" relative flex items-center gap-3"
          >
            <Avatar>
              <AvatarImage src={member.image} />
              <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div
              className={`absolute bottom-0 left-0 h-3 w-3 rounded-full ring-2  ${
                isActive ? "bg-green-500" : "ring-zinc-900"
              }   }`}
            />
            <p>{member.name}</p>
          </Link>
          <div className="flex gap-2 items-center px-2">
            {currentUser?._id === currentRoom?.admin &&
              member._id !== currentUser?._id && (
                <TooltipComponent text="Kick user">
                  <Button
                    onClick={() =>
                      kickMember(currentUser!._id, currentRoom!._id, member._id)
                    }
                    size="icon"
                    variant="ghost"
                    className="text-zinc-100 hover:text-white"
                  >
                    <Ban className="size-4" color="red" />
                  </Button>
                </TooltipComponent>
              )}
            {member.role === "modarator" && (
              <TooltipComponent text="Modarator">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-zinc-100 hover:text-white"
                >
                  <UserCog className="size-4" />
                </Button>
              </TooltipComponent>
            )}
            {member._id === currentRoom?.admin && (
              <TooltipComponent text="Admin">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-zinc-100 hover:text-white"
                >
                  <Crown className="size-4" color="yellow" />
                </Button>
              </TooltipComponent>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
