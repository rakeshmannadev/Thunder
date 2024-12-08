import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAuthStore from "@/store/useAuthStore";
import { useState } from "react";

const AuthPage = () => {
  const { signup, login } = useAuthStore();
  const [isSignup, setSignup] = useState(false);
  const [authData, setAuthData] = useState({
    email: "",
    name: "",
    password: "",
    gender: "male",
  });

  const handleSubmit = () => {
    if (isSignup) {
      signup(authData);
    } else {
      login(authData);
    }
  };
  return (
    <>
      <Header />
      <div className="w-full min-h-screen flex items-center justify-center">
        <Card className="w-[300px] sm:w-[450px]">
          <CardHeader>
            <CardTitle>
              {isSignup ? "Create an account" : "Login to your account"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="email">Email</label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="johndoe@example.com"
                    onChange={(e) =>
                      setAuthData({ ...authData, email: e.target.value })
                    }
                  />
                </div>
                {isSignup && (
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="name">Name</label>
                    <Input
                      id="name"
                      placeholder="Name"
                      onChange={(e) =>
                        setAuthData({ ...authData, name: e.target.value })
                      }
                    />
                  </div>
                )}
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="name">Password</label>
                  <Input
                    type="password"
                    id="password"
                    placeholder="Password"
                    onChange={(e) =>
                      setAuthData({ ...authData, password: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="Gender">Gender</label>
                  <Select
                    onValueChange={(value) =>
                      setAuthData({ ...authData, gender: value })
                    }
                  >
                    <SelectTrigger id="Gender">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </CardContent>

          <CardFooter className="min-w-full flex flex-col gap-2">
            <Button className="w-full" onClick={handleSubmit}>
              {isSignup ? "Create account" : "Login"}
            </Button>

            {isSignup ? (
              <p>
                Already have an account?{" "}
                <span
                  className="hover:underline hover:cursor-pointer"
                  onClick={() => setSignup(false)}
                >
                  login{" "}
                </span>
              </p>
            ) : (
              <p>
                Don't have an account?{" "}
                <span
                  className="hover:underline hover:cursor-pointer"
                  onClick={() => setSignup(true)}
                >
                  signup{" "}
                </span>
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default AuthPage;
