import { Card, CardContent } from "@/components/ui/card";
import {Loader} from 'lucide-react';

const AuthCallbackPage = () => {
  return (
    <div className="flex h-screen w-full justify-center items-center">

      <Card>
        <CardContent>
          <div className="flex gap-3 items-center justify-center h-20 p-3 ">
            <Loader className="animate-spin size-7 text-blue-500"/>
          logging you in...
          </div>
          
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthCallbackPage
