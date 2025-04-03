import { BrowserRouter, Route, Routes } from "react-router-dom";
import Backlog from "../components/Screens/Backlog";
import Sprint from "../components/Screens/Sprint";

export const AppRoutes = () => {
    return (
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Backlog />} />
            <Route path="/sprint" element={<Sprint />} />
          </Routes>
      </BrowserRouter>
  
    );
  }