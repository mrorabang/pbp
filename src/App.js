import { Route, Routes } from "react-router-dom";
import StartPage from "./components/StartPage";
import FinalPage from "./components/FinalPage";
import GroupCall from "./components/GroupCall";
import { ToastContainer } from "react-toastify";
import FullLayout from "./layout/FullLayout";

function App() {
  return (
    <>
      <Routes>
        {/* Các route bọc trong FullLayout */}
        <Route
          path="/"
          element={
            <FullLayout>
              <StartPage />
            </FullLayout>
          }
        />
        <Route
          path="/pbp"
          element={
            <FullLayout>
              <StartPage />
            </FullLayout>
          }
        />
        <Route
          path="/export-pdf"
          element={
            <FullLayout>
              <FinalPage />
            </FullLayout>
          }
        />

        {/* Route KHÔNG bọc layout → không có chat widget */}
        <Route path="/group-call" element={<GroupCall />} />
      </Routes>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}

export default App;
