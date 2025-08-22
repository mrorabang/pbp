import { Route, Routes } from "react-router-dom";
import StartPage from "./components/StartPage";
import FinalPage from "./components/FinalPage";
import VideoCallLayout from "./layout/VideoCallLayout";

function App() {
  return (
    <VideoCallLayout>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/pbp" element={<StartPage />} />
        <Route path="/export-pdf" element={<FinalPage />} />
      </Routes>
    </VideoCallLayout>
  );
}

export default App;
