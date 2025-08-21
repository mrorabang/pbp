import logo from './logo.svg';
import './App.css';
import StartPage from "./components/StartPage";
import {Route, Routes} from "react-router-dom";
import FinalPage from "./components/FinalPage";

function App() {
  return (
    <div className="App">
      <Routes>
          <Route path="/" element={<StartPage/>}/>
          <Route path="/export-pdf" element={<FinalPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
