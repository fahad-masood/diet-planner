import React, { useEffect, useState } from "react";
import DayMealContainer from "./DayMealContainer";
import { PlusCircle } from "@phosphor-icons/react";
import DatePicker from "react-datepicker";
import { DEFAULT_MEAL_DATA } from "../data";
import { addDays } from "date-fns";
import Loader from "./Loader";
import "react-datepicker/dist/react-datepicker.css";

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
  const days = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];
  const [dietDetails, setDietDetails] = useState(DEFAULT_MEAL_DATA);
  const [selectedDate, setSelectedDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedWeek, setSelectedWeek] = useState(DEFAULT_WEEK);
  const [isEnable, setIsEnable] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dietDetails) {
      setSelectedWeek((prev) => ({ ...prev, list: dietDetails }));
    }
    setLoading(false);
  }, [dietDetails]);

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

  const handleDraft = () => {
    // Save draft logic here
    console.log("save draft", selectedWeek);
  };
  const handleSave = () => {
    // Save draft logic here
    console.log("save payload", selectedWeek);
  };
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="p-4">
      {type === "custom" && (
        <div className="flex justify-between pb-4">
          <h1 className="text-2xl">Create Custom Meal</h1>
          <div>
            <span
              className="mr-2 cursor-pointer rounded-md border border-blue-700 bg-blue-500 px-3 py-2 pr-2 text-white hover:bg-white hover:text-blue-700"
              onClick={handleReset}
            >
              Reset Meal Item
            </span>
            <span
              className="cursor-pointer rounded-md border border-lime-700 bg-lime-500 px-3 py-2 pr-2 text-white hover:bg-white hover:text-lime-700"
              onClick={handleDraft}
            >
              Save as Draft
            </span>
          </div>
        </div>
      )}
      {type !== "custom" && (
        <div className="flex justify-between pb-4">
          <div className="flex gap-2">
            <DatePicker
              showIcon
              selected={selectedDate}
              dateFormat="dd/MM/yyyy"
              onChange={(date) => handleDate(date)}
              minDate={new Date()}
              placeholderText="Select a start date"
            />
            <DatePicker
              showIcon
              selected={endDate}
              dateFormat="dd/MM/yyyy"
              disabled
              minDate={new Date()}
              placeholderText="Select a end date"
            />
          </div>
          <div>
            <span
              className="mr-2 cursor-pointer rounded-md border border-blue-700 bg-blue-500 px-3 py-2 text-white hover:bg-white hover:text-blue-700"
              onClick={handleReset}
            >
              Reset Meal Item
            </span>
            <span
              className="cursor-pointer rounded-md border border-lime-700 bg-lime-500 px-3 py-2 text-white hover:bg-white hover:text-lime-700"
              onClick={handleSave}
            >
              Save
            </span>
          </div>
        </div>
      )}

      <div className="container mx-auto">
        <div className="grid h-[10vh] grid-cols-8 place-items-center">
          <div></div>
          {days?.map((day, index) => (
            <h3
              className="rounded-lg border border-gray-500 bg-white px-3 py-1 text-gray-800 shadow-lg"
              key={`${day}~~${index}`}
            >
              {day}
            </h3>
          ))}
        </div>
      </div>

      <DayMealContainer
        dietDetails={dietDetails}
        setDietDetails={setDietDetails}
      />
      <PlusCircle
        className="cursor-pointer"
        size={32}
        color="blue"
        onClick={handleAddMeal}
      />
    </div>
  );
};

export default UserMealDetail;
