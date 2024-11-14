import { Route, Routes } from "react-router-dom"
import AuthCallbackPage from "./Pages/Auth/AuthCallbackPage"
import HomePage from "./Pages/Home/HomePage"


function App() {


  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/authCallback" element={<AuthCallbackPage/>}/>
    </Routes>
    </>
  )
}

export default App
