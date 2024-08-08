import React, { useEffect, useState } from "react";
import { useFirebase } from "../Firebase";
import { differenceInDays, isToday, addMonths } from "date-fns";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const navigate = useNavigate();
  const handleStatus = (date) => {
    const startDate = new Date(date);
    const afterMonth = addMonths(startDate, 1);
    const daysDifference = differenceInDays(afterMonth, startDate);
    if (daysDifference < 0) return "expired";
    else return "active";
  };
  function getRemainingTime(date) {
    const startDate = new Date(date);
    const afterMonth = addMonths(startDate, 1);
    const today = new Date();
    const daysDifference = differenceInDays(afterMonth, today);

    if (isToday(afterMonth)) {
      return "expiring today";
    } else if (daysDifference <= 7 && daysDifference > 0) {
      return `expiring in ${daysDifference} ${
        daysDifference === 1 ? "day" : "days"
      }`;
    } else if (daysDifference > 7) {
      const weeks = Math.floor(daysDifference / 7);
      return `expires in ${weeks} ${weeks === 1 ? "week" : "weeks"}`;
    } else {
      return `expired ${Math.abs(daysDifference)} ${
        Math.abs(daysDifference) === 1 ? "day" : "days"
      } ago`;
    }
  }

  const { fetchAllUserDetails } = useFirebase();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDetails = await fetchAllUserDetails();
        const notAdmin = userDetails?.filter((user) => !user?.isAdmin);
        setUsers(notAdmin);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleCustom = () => {
    setLoading(true);
    navigate("/custom-meal");
  };
  const handleAddMeal = (userId) => {
    setLoading(true);
    navigate(`/add-meal/${userId}`);
  };
  if (loading) {
    return <Loader />;
  }

  if (!users.length === 0) {
    return <p>No subscribers found.</p>;
  }

  console.log("user", users?.flat());
  return (
    <div className="p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl">All Users</h1>
        <button
          className="cursor-pointer rounded-lg border border-lime-500 bg-lime-300 p-2 text-lime-900 hover:bg-lime-100"
          onClick={handleCustom}
        >
          Custom Meal
        </button>
      </div>
      <div className="overflow-hidden rounded-lg border border-red-400">
        <ul className="grid grid-cols-9 gap-4 bg-red-500 px-2 py-2 text-lg font-semibold">
          <li>Name</li>
          <li>Age</li>
          <li className="col-span-2">Email</li>
          <li>Subscription Date</li>
          <li>Status</li>
          <li>Subscription Status</li>
          <li className="col-span-2">Actions</li>
        </ul>
        {users?.map((user, i) => (
          <ul
            className="grid grid-cols-9 gap-4 px-2 py-4 text-lg font-medium odd:bg-red-100"
            key={`${user?.formResponses[0]?.name}-${i}`}
          >
            <li>{user?.formResponses[0].name}</li>
            <li>{user?.formResponses[0].age}</li>
            <li className="col-span-2">{user?.formResponses[0].email}</li>
            <li>{user?.formResponses[0].dietStartDate}</li>
            <li
              className={
                handleStatus(user?.formResponses[0].dietStartDate) === "expired"
                  ? "capitalize text-red-600"
                  : "capitalize text-lime-600"
              }
            >
              {handleStatus(user?.formResponses[0].dietStartDate)}
            </li>
            <li>{getRemainingTime(user?.formResponses[0].dietStartDate)}</li>
            <li className="col-span-2 flex items-center gap-2 text-sm">
              <span className="cursor-pointer rounded-md border border-blue-700 bg-blue-500 px-3 py-2 text-white hover:bg-white hover:text-blue-700">
                Show User Details
              </span>
              <span
                className="cursor-pointer rounded-md border border-blue-700 bg-blue-500 px-3 py-2 text-white hover:bg-white hover:text-blue-700"
                onClick={() => handleAddMeal(user?.id)}
              >
                Add New Meal
              </span>
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
};

export default UserList;
