import { SignedIn, SignedOut, SignInButton, SignOutButton, useAuth } from "@clerk/clerk-react";


const Header = () => {
    const isAdmin = false;
    const {userId} = useAuth()
    
    console.log(userId)
  return (
    <header className="flex justify-between w-full p-4 bg-zinc-800/75 backdrop-blur-md ">

        <div className="size-4 ">
            Thunder
        </div>

        <div>
            {
                isAdmin ?(
                    'Dashboard'
                ):(
                    <>
                   
                    <SignedOut>
                        <SignInButton>SignIn</SignInButton>
                    </SignedOut>

                    <SignedIn>
                        <SignOutButton>SignOut</SignOutButton>
                    </SignedIn> 
                    </>
                )
            }
        </div>
    </header>
  )
}

export default Header
