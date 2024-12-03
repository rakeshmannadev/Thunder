import { SignedOut, useAuth, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import SignInWithGoogleBtn from "./SignInWithGoogleBtn";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import useUserStore from "@/store/useUserStore";
import Searchbar from "./Searchbar";

const Header = () => {
  const { getCurrentUser, currentUser } = useUserStore();
  const { userId } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      getCurrentUser();
    }
  }, [getCurrentUser]);

  return (
    <header className="flex  justify-between items-center gap-2 sticky top-0 w-full p-4 bg-zinc-900/75 backdrop-blur-md z-10 ">
      <Link
        to={"/"}
        className="hidden md:flex  gap-2 items-center justify-center  "
      >
        <img src="/Thunder_logo.png" alt="logo" className="w-12 " />
        <span className="font-bold text-zinc-300 mb-2">Thunder</span>
      </Link>
      <div className="flex justify-between md:justify-end items-center gap-3 w-full">
        <Searchbar />
        {userId && currentUser?.role === "admin" && (
          <Link
            to={"/admin"}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <LayoutDashboard className="size-4 mr-2" />
            <span className="hidden md:block">Admin Dashboard</span>
          </Link>
        )}
      </div>
      <SignedOut>
        <SignInWithGoogleBtn />
      </SignedOut>

      <UserButton />
    </header>
  );
};

export default Header;
