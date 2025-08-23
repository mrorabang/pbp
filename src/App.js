import { Route, Routes } from "react-router-dom";
import StartPage from "./components/StartPage";
import FinalPage from "./components/FinalPage";
import GroupCall from "./components/GroupCall";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/pbp" element={<StartPage />} />
        <Route path="/group-call" element={<GroupCall />} />
        <Route path="/export-pdf" element={<FinalPage />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} />

    </>


  );
}

export default App;
