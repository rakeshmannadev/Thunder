import { SignedOut, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import SignInWithGoogleBtn from "./SignInWithGoogleBtn";

const Header = () => {
  const isAdmin = false;

  return (
    <header className="flex justify-between items-center sticky top-0 w-full p-4 bg-zinc-900/75 backdrop-blur-md z-10 ">
      <div className="flex gap-2 items-center ">Thunder</div>

      <div className="flex items-center gap-4">
        {isAdmin ? (
          <Link to={"/admin"}>
            <LayoutDashboard />
            Admin Dashboard
          </Link>
        ) : (
          <>
            <SignedOut>
              <SignInWithGoogleBtn />
            </SignedOut>

            <UserButton />
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
