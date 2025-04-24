import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Sprint from "../components/Screens/Sprint";
import Backlog from "../components/Screens/Backlog";


export const AppRoutes = () => {
    return (
      <BrowserRouter>
          <Routes>
          <Route path="/" element={<Navigate to="/backlog" replace />} />
          <Route path="*" element={<Navigate to="/backlog" replace />} />
          <Route path="/backlog" element={<Backlog />} />
          <Route path="/sprint" element={<Sprint />} />
          </Routes>
      </BrowserRouter>
  
    );
  }