import { Link } from "react-router-dom";
import { LayoutDashboard, LogOut, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import useUserStore from "@/store/useUserStore";
import Searchbar from "./Searchbar";
import TooltipComponent from "./Tooltip/TooltipComponent";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import useAuthStore from "@/store/useAuthStore";

const Header = () => {
  const { currentUser } = useUserStore();
  const { logout } = useAuthStore();

  return (
    <header className="flex  justify-between items-center gap-4 sticky top-0 w-full p-4 bg-zinc-900/75 backdrop-blur-md z-10 ">
      <Link
        to={"/"}
        className="hidden md:flex  gap-2 items-center justify-center  "
      >
        <img src="/Thunder_logo.png" alt="logo" className="w-12 " />
        <span className="font-bold text-zinc-300 mb-2">Thunder</span>
      </Link>
      <div className="flex justify-between md:justify-end items-center gap-3 w-full">
        <Searchbar />
        {currentUser?.role === "admin" && (
          <Link
            to={"/admin"}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <LayoutDashboard className="size-4 mr-2" />
            <span className="hidden md:block">Admin Dashboard</span>
          </Link>
        )}
      </div>
      <div className="w-fit">
        {!currentUser && (
          <TooltipComponent text="Login">
            <Link
              to={"/auth"}
              className={cn(
                buttonVariants({
                  variant: "outline",
                  className: `w-fit md:w-full p-4  justify-center md:justify-start text-white rounded-md hover:bg-zinc-800 
                  }`,
                })
              )}
            >
              <span>Login</span>
            </Link>
          </TooltipComponent>
        )}
        {currentUser && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer size-8">
                <AvatarImage src={currentUser.image} />
                <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit">
              <DropdownMenuLabel>
                <h4 className="font-medium leading-none">{currentUser.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {currentUser.email}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User />
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="size-2" />
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => logout()}
                >
                  <LogOut />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Header;
