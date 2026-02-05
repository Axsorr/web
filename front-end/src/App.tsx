import { Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Recovery from "./pages/Recovery";
import Questions from "./pages/Questions";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/recovery" element={<Recovery />} />
      <Route path="/questions" element={<Questions />} />
    </Routes>
  );
}