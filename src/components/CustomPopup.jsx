import React, { useState } from "react";
import { useFirebase } from "../Firebase";
import Loader from "./Loader";

const CustomPopup = ({ toggler, mealList }) => {
  const [mealName, setMealName] = useState("");
  const { saveCustomDietPlan } = useFirebase();
  const [loading, setLoading] = useState(false);

  const handleOutside = (e) => {
    if (e.target.id === "con") toggler(false);
  };

  const handleSave = async () => {
    if (mealName.length > 0) {
      const newMeal = {
        id: "",
        name: mealName,
        list: mealList,
      };
      console.log("newm", newMeal);
      try {
        setLoading(true);
        await saveCustomDietPlan(newMeal);
        console.log("Custom diet plan saved successfully");
        toggler(false);
      } catch (error) {
        console.error("Failed to save custom diet plan:", error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please enter a meal name");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    //OLD
    // <div
    //   className="fixed inset-0 z-50 bg-opacity-40 backdrop-blur-sm"
    //   id="con"
    //   onClick={handleOutside}
    // >
    //   <div
    //     className="mx-auto mt-28 flex min-h-[30vh] w-1/3 flex-col rounded-md border border-gray-500 bg-white p-4"
    //     id="inside"
    //   >
    //     <h2 className="pb-4 text-xl">Custom Meal Details</h2>

    //     <input
    //       type="text"
    //       className="mb-4 w-full rounded border border-gray-500 px-2 py-1 outline-violet-300 focus:border-violet-300"
    //       placeholder="Enter a custom meal name"
    //       value={mealName}
    //       onChange={(e) => setMealName(e.target.value)}
    //     />

    //     <button
    //       className={`mt-auto rounded bg-green-500 px-3 py-1 text-white  ${
    //         mealName.length === 0
    //           ? "cursor-not-allowed bg-green-400 hover:outline-none"
    //           : "hover:bg-white hover:font-bold hover:text-green-500 hover:outline hover:outline-green-500"
    //       }`}
    //       disabled={mealName.length === 0}
    //       onClick={() => {
    //         handleSave();
    //       }}
    //     >
    //       Save
    //     </button>
    //   </div>
    // </div>

    //NEW

    <div
      className="fixed inset-0 z-50 bg-opacity-40 backdrop-blur-sm"
      id="con"
      onClick={handleOutside}
    >
      <div
        className="mx-auto mt-28 w-1/3 rounded-md border border-gray-500 bg-white p-4"
        id="inside"
      >
        <h2 className="pb-4 text-xl">Custom Meal Name</h2>
        <div className="flex">
          <div className="relative w-full">
            <input
              type="text"
              className="w-full rounded border border-gray-500 px-2 py-1 outline-violet-300 focus:border-violet-300"
              placeholder="Enter a custom meal name"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className={`rounded bg-green-500 px-4 py-1 text-white transition hover:bg-green-600 ${
              mealName.length === 0 ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={mealName.length === 0}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomPopup;
