import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Transfer from "../pages/Transfer";
import History from "../pages/History";
import ProtectedRoute from "../components/ProtectedRoute";
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
       <Route 
path="/dashboard" 
element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
}
/>
   <Route 
path="/transfer"
element={
 <ProtectedRoute>
   <Transfer />
 </ProtectedRoute>
}
/>
      <Route 
path="/history"
element={
 <ProtectedRoute>
   <History />
 </ProtectedRoute>
}
/>
        <Route 
path="/dashboard" 
element={<Dashboard />} 
/>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;