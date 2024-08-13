import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useFirebase } from "../Firebase";
import CustomForm from "./CustomForm";
import Loader from "./Loader";

const Dashboard = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const { fetchUserData } = useFirebase();
  const [isFormSubmitted, setIsFormSubmitted] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFormStatus = async () => {
      if (user) {
        try {
          const userData = await fetchUserData(user.uid);
          console.log("User on dashboard: ", userData);
          setIsFormSubmitted(userData.isFormSubmitted);
          console.log("User on dashboard after submitting form: ", userData);
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      }
      setLoading(false);
    };
    fetchFormStatus();
  }, [user, fetchUserData]);

  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>
        <p>User is not logged in.</p>
      </div>
    );
  }

  return (
    <>
      {isFormSubmitted === false ? (
        <CustomForm user={user} handleLogout={handleLogout} />
      ) : (
        <div className="min-h-screen bg-gray-100 p-6">
          <div className="mb-6 flex items-center justify-between border-b border-gray-300 pb-4">
            <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
            <button
              className="rounded-md bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
          <p>Welcome, {user.email}</p>
          <div className="mt-4 rounded-lg bg-white p-4 shadow-md">
            <p className="text-lg font-medium">
              Your form is filled and we are working on providing you with the
              best diet plan that customizes your needs. Please wait until your
              diet gets published.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
