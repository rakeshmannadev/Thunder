import { useSignIn } from "@clerk/clerk-react";
import { Button } from "./ui/button";

const SignInWithGoogleBtn = () => {
  const { signIn, isLoaded } = useSignIn();

  if (!isLoaded) return null;

  const handleSignInWithGoogle = () => {
    signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/auth-callback",
    });
  };
  return (
    <Button
      onClick={handleSignInWithGoogle}
      variant={"secondary"}
      className="w-full text-white border-zinc-200 h-10"
    >
      <img src="/google.png" alt="google-img" className="w-5" />
      <span className="hidden md:inline">Continue with Google</span>
    </Button>
  );
};

export default SignInWithGoogleBtn;
