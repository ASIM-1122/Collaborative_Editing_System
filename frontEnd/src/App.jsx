
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DocumentEditor from "./pages/DocumentEditor";
import Profile from "./pages/Profile";
import PrivateRoute from "./utils/PrivateRoutes";
import Navbar from "./components/Navbar";
import CreateDocument from './pages/CreateDocument';
import EditDocument from './pages/EditDocument';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/create-document" element={<CreateDocument />} />
        <Route path="/edit-document" element={<EditDocument />} />
        <Route path="/document/:id" element={<PrivateRoute><DocumentEditor /></PrivateRoute>} />
      </Routes>
    </Router>
  );
};

export default App;