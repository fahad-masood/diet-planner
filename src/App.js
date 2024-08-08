import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { FirebaseProvider } from "./Firebase";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import FormSuccess from "./components/FormSuccess";
import CustomForm from "./components/CustomForm";
import AdminDashboard from "./components/AdminDashboard";
import { useFirebase } from "./Firebase";
import Loader from "./components/Loader";
import UserMealDetail from "./components/UserMealDetail";

const AppRoutes = () => {
  const { user, loading } = useFirebase();

  if (loading) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/form-success"
        element={
          <ProtectedRoute>
            {user?.isFormSubmitted ? (
              <FormSuccess />
            ) : (
              <Navigate to={"/dashboard"} />
            )}
          </ProtectedRoute>
        }
      />
      <Route
        exact
        path="/dashboard"
        element={
          <ProtectedRoute>
            {user?.isAdmin ? <Navigate to="/admin-dashboard" /> : <Dashboard />}
          </ProtectedRoute>
        }
      />
      <Route
        exact
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            {user?.isAdmin ? <AdminDashboard /> : <Navigate to="/dashboard" />}
          </ProtectedRoute>
        }
      />
      <Route
        exact
        path="/custom-meal"
        element={
          <ProtectedRoute>
            {user?.isAdmin ? (
              <UserMealDetail type="custom" />
            ) : (
              <Navigate to="/dashboard" />
            )}
          </ProtectedRoute>
        }
      />
      <Route
        exact
        path="/add-meal/:userId"
        element={
          <ProtectedRoute>
            {user?.isAdmin ? <UserMealDetail /> : <Navigate to="/dashboard" />}
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <FirebaseProvider>
      <Router>
        <AppRoutes />
      </Router>
    </FirebaseProvider>
  );
};

export default App;
