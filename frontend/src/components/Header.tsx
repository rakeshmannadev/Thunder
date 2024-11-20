import { SignedOut, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import SignInWithGoogleBtn from "./SignInWithGoogleBtn";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import useUserStore from "@/store/useUserStore";

const Header = () => {
  const { getCurrentUser, currentUser } = useUserStore();

  useEffect(() => {
    if (!currentUser) {
      getCurrentUser();
    }
  }, [getCurrentUser]);

  return (
    <header className="flex  justify-between items-center sticky top-0 w-full p-4 bg-zinc-900/75 backdrop-blur-md z-10 ">
      <div className="flex gap-2 items-center ">Thunder</div>

      <div className="flex items-center gap-4">
        {currentUser?.role === "admin" && (
          <Link
            to={"/admin"}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <LayoutDashboard className="size-4 mr-2" />
            <span className="hidden md:block">Admin Dashboard</span>
          </Link>
        )}

        <SignedOut>
          <SignInWithGoogleBtn />
        </SignedOut>

        <UserButton />
      </div>
    </header>
  );
};

export default Header;
