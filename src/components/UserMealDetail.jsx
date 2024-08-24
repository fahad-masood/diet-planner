import React, { useEffect, useState } from "react";
import DayMealContainer from "./DayMealContainer";
import { PlusCircle } from "@phosphor-icons/react";
import DatePicker from "react-datepicker";
import { DEFAULT_MEAL_DATA } from "../data";
import { addDays } from "date-fns";
import Loader from "./Loader";
import "react-datepicker/dist/react-datepicker.css";
import { useFirebase } from "../Firebase";
import { useParams } from "react-router-dom";
import CustomPopup from "./CustomPopup";
import ImportPopup from "./ImportPopup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DEFAULT_WEEK = { startDate: "", endDate: "", list: [] };
const DEFAULT_MEAL = {
  mealId: "",
  mealDetails: {
    mealType: "",
    time: "",
  },
  Days: [
    { dayId: "", day: "Day 1", items: [] },
    { dayId: "", day: "Day 2", items: [] },
    { dayId: "", day: "Day 3", items: [] },
    { dayId: "", day: "Day 4", items: [] },
    { dayId: "", day: "Day 5", items: [] },
    { dayId: "", day: "Day 6", items: [] },
    { dayId: "", day: "Day 7", items: [] },
  ],
};

const UserMealDetail = ({ type = "" }) => {
  const { saveDietPlanForSpecificUser, fetchUserDetails } = useFirebase();
  const days = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];
  const [dietDetails, setDietDetails] = useState(DEFAULT_MEAL_DATA);
  const [selectedDate, setSelectedDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedWeek, setSelectedWeek] = useState(DEFAULT_WEEK);
  const [isEnable, setIsEnable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [customToggler, setCustomToggler] = useState(false);
  const [importToggler, setImportToggler] = useState(false);
  const [selectedCustom, setSelectedCustom] = useState("");
  const { userId } = useParams();

  console.log("diet", dietDetails, "-ss", selectedCustom);
  useEffect(() => {
    if (dietDetails) {
      setSelectedWeek((prev) => ({ ...prev, list: dietDetails }));
    }
    setLoading(false);
  }, [dietDetails]);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDetails = await fetchUserDetails(userId);

        console.log("userDetails", userDetails);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
      setLoading(false);
    };

    fetchUser();
  }, [userId]);

  const handleDate = (val) => {
    setSelectedDate(val);
    const futureDate = addDays(val, 6);
    setEndDate(futureDate);

    setSelectedWeek((prev) => ({
      ...prev,
      startDate: val,
      endDate: futureDate,
    }));
  };
  const handleAddMeal = () => {
    let DEFAULT_MEAL_NEW = { ...DEFAULT_MEAL };
    DEFAULT_MEAL_NEW = { ...DEFAULT_MEAL_NEW, mealId: dietDetails?.length + 1 };
    DEFAULT_MEAL_NEW.mealDetails = {
      ...DEFAULT_MEAL_NEW.mealDetails,
      mealType: `Meal ${dietDetails?.length + 1}`,
    };
    for (var i = 0; i < DEFAULT_MEAL_NEW.Days.length; i++) {
      DEFAULT_MEAL_NEW.Days[i] = {
        ...DEFAULT_MEAL_NEW.Days[i],
        dayId: dietDetails?.length + `${i + 1}`,
      };
    }

    setIsEnable(true);
    setSelectedWeek((prev) => ({
      ...prev,
      list: [...prev.list, DEFAULT_MEAL_NEW],
    }));
    setDietDetails((prev) => [...prev, DEFAULT_MEAL_NEW]);
  };

  const handleReset = () => {
    setSelectedDate("");
    setEndDate("");
    setSelectedWeek(DEFAULT_WEEK);
    setDietDetails(DEFAULT_MEAL_DATA);
  };

  const handleDraft = async () => {
    // Save draft logic here
    setCustomToggler(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await saveDietPlanForSpecificUser(userId, selectedWeek);
      console.log("Diet plan saved successfully");
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Failed to save diet plan:", error);
    }
    setLoading(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    // OLD
    // <div className="p-4">
    //   {type === "custom" && (
    //     <div className="flex justify-between pb-4">
    //       <h1 className="text-2xl">Create Custom Meal</h1>
    //       <div>
    //         <span
    //           className="mr-2 cursor-pointer rounded-md border border-blue-700 bg-blue-500 px-3 py-2 pr-2 text-white hover:bg-white hover:text-blue-700"
    //           onClick={handleReset}
    //         >
    //           Reset Meal Item
    //         </span>
    //         <span
    //           className="cursor-pointer rounded-md border border-lime-700 bg-lime-500 px-3 py-2 pr-2 text-white hover:bg-white hover:text-lime-700"
    //           onClick={handleDraft}
    //         >
    //           Save as Draft
    //         </span>
    //       </div>
    //     </div>
    //   )}
    //   {type !== "custom" && (
    //     <div className="flex justify-between pb-4">
    //       <div className="flex gap-2">
    //         <div className="flex flex-col">
    //           {" "}
    //           <label htmlFor="datePicker">Select Date:*</label>{" "}
    //           <DatePicker
    //             showIcon
    //             selected={selectedDate}
    //             dateFormat="dd/MM/yyyy"
    //             onChange={(date) => handleDate(date)}
    //             minDate={new Date()}
    //             placeholderText="Select a start date"
    //           />
    //         </div>
    //         <div className="flex flex-col">
    //           {" "}
    //           <label htmlFor="datePicker">Select Date:</label>{" "}
    //           <DatePicker
    //             showIcon
    //             selected={endDate}
    //             dateFormat="dd/MM/yyyy"
    //             disabled
    //             minDate={new Date()}
    //             placeholderText="Select a end date"
    //           />
    //         </div>
    //       </div>
    //       <div>
    //         <span
    //           className="mr-2 cursor-pointer rounded-md border border-blue-700 bg-blue-500 px-3 py-2 text-white hover:bg-white hover:text-blue-700"
    //           onClick={handleReset}
    //         >
    //           Reset Meal Item
    //         </span>
    //         <span
    //           className="cursor-pointer rounded-md border border-lime-700 bg-lime-500 px-3 py-2 text-white hover:bg-white hover:text-lime-700"
    //           onClick={handleSave}
    //         >
    //           Save
    //         </span>
    //       </div>
    //     </div>
    //   )}

    //   <div className="container mx-auto">
    //     <div className="grid h-[10vh] grid-cols-8 place-items-center">
    //       <div></div>
    //       {days?.map((day, index) => (
    //         <h3
    //           className="rounded-lg border border-gray-500 bg-white px-3 py-1 text-gray-800 shadow-lg"
    //           key={`${day}~~${index}`}
    //         >
    //           {day}
    //         </h3>
    //       ))}
    //     </div>
    //   </div>

    //   <DayMealContainer
    //     dietDetails={dietDetails}
    //     setDietDetails={setDietDetails}
    //   />
    //   <PlusCircle
    //     className="cursor-pointer"
    //     size={32}
    //     color="blue"
    //     onClick={handleAddMeal}
    //   />
    //   {customToggler && (
    //     <CustomPopup toggler={setCustomToggler} mealList={selectedWeek?.list} />
    //   )}
    // </div>

    // NEW

    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="flex flex-col items-center border-b pb-6 md:flex-row md:justify-between">
        <h1 className="mb-4 text-3xl font-semibold text-gray-800 md:mb-0">
          {type === "custom" ? "Create Custom Diet Plan" : "Diet Plan Details"}
        </h1>
        <div className="flex gap-3">
          <button
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-200"
            onClick={handleReset}
          >
            Reset
          </button>
          {type === "custom" ? (
            <button
              className="rounded-md bg-yellow-500 px-4 py-2 text-sm text-white transition hover:bg-yellow-600"
              onClick={handleDraft}
            >
              Save as Draft
            </button>
          ) : (
            <>
              <button
                className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="rounded-md bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700"
                onClick={() => setImportToggler(true)}
              >
                Import Custom Diet
              </button>
            </>
          )}
        </div>
      </div>

      {type !== "custom" && (
        <div className="flex flex-col items-center justify-between py-6 md:flex-row">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600">
                Start Date*
              </label>
              <DatePicker
                selected={selectedDate}
                dateFormat="dd/MM/yyyy"
                onChange={(date) => handleDate(date)}
                minDate={new Date()}
                placeholderText="Select start date"
                className="mt-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600">
                End Date
              </label>
              <DatePicker
                selected={endDate}
                dateFormat="dd/MM/yyyy"
                disabled
                placeholderText="Select end date"
                className="mt-1 rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto">
        <div className="grid h-[6vh] grid-cols-8 place-items-center">
          <div className="col-span-1"></div>
          {days.map((day, index) => (
            <div
              className="text-center text-sm font-medium text-gray-700"
              key={`${day}~~${index}`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-white p-4 shadow-sm">
        <DayMealContainer
          dietDetails={dietDetails}
          setDietDetails={setDietDetails}
        />
      </div>

      <div className="mt-8 flex justify-center">
        <PlusCircle
          className="cursor-pointer text-blue-600"
          size={48}
          onClick={handleAddMeal}
        />
      </div>

      {customToggler && (
        <CustomPopup toggler={setCustomToggler} mealList={selectedWeek?.list} />
      )}
      {importToggler && (
        <ImportPopup
          toggler={setImportToggler}
          handler={setDietDetails}
          setSelectedCustom={setSelectedCustom}
          selectedCustom={selectedCustom}
        />
      )}
    </div>
  );
};

export default UserMealDetail;
