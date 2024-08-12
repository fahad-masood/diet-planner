import React, { useEffect, useState } from "react";
import { legacy } from "../data.js";
import { TrashSimple } from "@phosphor-icons/react";

const MealPopup = ({ setTogglePopup, setMealsList, mealsList }) => {
  const [meals, setMeals] = useState([]);
  const [newMeal, setNewMeal] = useState("");
  const [editingMealIndex, setEditingMealIndex] = useState(null);

  useEffect(() => {
    if (mealsList) {
      setMeals(mealsList);
    }
  }, []);

  const handleAddMeal = () => {
    const duplicate = legacy.find(
      (item) => item?.label?.toLowerCase() === newMeal?.toLowerCase()?.trim(),
    );
    if (newMeal.trim() !== "" && !duplicate) {
      setMeals([...meals, newMeal]);

      setNewMeal("");
    }
  };

  const handleDeleteMeal = (index) => {
    const updatedMeals = [...meals];
    updatedMeals.splice(index, 1);
    setMeals(updatedMeals);
  };

  const handleOutside = (e) => {
    if (e.target.id === "con") setTogglePopup(false);
  };

  return (
    //OLD
    // <div
    //   className="fixed inset-0 z-50 bg-opacity-40 backdrop-blur-sm"
    //   id="con"
    //   onClick={handleOutside}
    // >
    //   <div
    //     className="mx-auto mt-28 min-h-[50vh] w-1/3 rounded-md border border-gray-500 bg-white p-4"
    //     id="inside"
    //   >
    //     <h2 className="text-xl">Create Meals List</h2>
    //     <div className="flex">
    //       <div className="relative w-8/12">
    //         <input
    //           type="text"
    //           className=" w-full rounded border border-gray-500 px-2 py-1 outline-violet-300 focus:border-violet-300"
    //           placeholder="Enter a meal..."
    //           value={newMeal}
    //           onChange={(e) => setNewMeal(e.target.value)}
    //         />
    //         {newMeal && (
    //           <div
    //             className="absolute z-10 max-h-[20vh] w-full cursor-pointer overflow-y-auto bg-white py-2 text-sm shadow-md"
    //             onClick={(e) => {
    //               if (e.target.value) setMeals([...meals, e.target.value]);
    //               setNewMeal("");
    //             }}
    //           >
    //             {legacy
    //               .filter((out) =>
    //                 out.label
    //                   .toLowerCase()
    //                   .includes(newMeal.toLowerCase().trim()),
    //               )
    //               .map((opt) => (
    //                 <option className="px-2 hover:bg-gray-100" key={opt.value}>
    //                   {opt.label}
    //                 </option>
    //               ))}
    //           </div>
    //         )}
    //       </div>
    //       {editingMealIndex !== null ? (
    //         <div className="flex w-4/12 justify-evenly">
    //           <button
    //             className="w-2/5 rounded bg-red-500 px-3 py-1 text-white"
    //             onClick={() => setEditingMealIndex(null)}
    //           >
    //             Cancel
    //           </button>
    //         </div>
    //       ) : (
    //         <button
    //           className="mx-auto w-3/12 rounded-md bg-blue-500
    //            px-3 py-1 text-white hover:outline hover:outline-gray-500"
    //           onClick={handleAddMeal}
    //         >
    //           Add Meal
    //         </button>
    //       )}
    //     </div>
    //     <ul className="mt-4 h-[30vh] overflow-y-auto">
    //       {meals?.map((meal, index) => (
    //         <li
    //           key={index}
    //           className="text-md border-b-1 mb-2 flex items-center justify-between rounded-lg border border-gray-500 bg-violet-400 p-2"
    //         >
    //           <span>{meal}</span>
    //           <div className="space-x-2">
    //             <TrashSimple
    //               className="cursor-pointer"
    //               size={24}
    //               color="red"
    //               onClick={() => handleDeleteMeal(index)}
    //             />
    //           </div>
    //         </li>
    //       ))}
    //     </ul>

    //     <button
    //       className={`mt-1 rounded bg-green-500 px-3 py-1 text-white hover:outline hover:outline-gray-500 ${
    //         meals.length === 0 ? "cursor-not-allowed" : ""
    //       }`}
    //       disabled={meals.length === 0}
    //       onClick={() => {
    //         setTogglePopup(false);
    //         setMealsList(meals);
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
        className="mx-auto mt-28 w-full max-w-lg rounded-lg border border-gray-500 bg-white p-6 shadow-lg"
        id="inside"
      >
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">Add Meal</h2>
        <div className="mb-4 flex space-x-3">
          <div className="relative flex-grow">
            <input
              type="text"
              className="w-full rounded border border-gray-400 px-3 py-2 outline-violet-300 focus:border-violet-500"
              placeholder="Enter a meal..."
              value={newMeal}
              onChange={(e) => setNewMeal(e.target.value)}
            />
            {newMeal && (
              <div className="absolute z-10 mt-1 max-h-[20vh] w-full overflow-y-auto bg-white py-2 text-sm shadow-md">
                {legacy
                  .filter((out) =>
                    out.label
                      .toLowerCase()
                      .includes(newMeal.toLowerCase().trim()),
                  )
                  .map((opt) => (
                    <div
                      key={opt.value}
                      className="cursor-pointer px-3 py-1 hover:bg-gray-100"
                      onClick={() => {
                        setMeals([...meals, opt.label]);
                        setNewMeal("");
                      }}
                    >
                      {opt.label}
                    </div>
                  ))}
              </div>
            )}
          </div>
          <button
            className="w-1/4 rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
            onClick={handleAddMeal}
          >
            Add Meal
          </button>
        </div>
        <ul className="mb-4 max-h-[30vh] space-y-2 overflow-y-auto">
          {meals?.map((meal, index) => (
            <li
              key={index}
              className="flex items-center justify-between rounded-lg border border-violet-400 bg-violet-100 p-3"
            >
              <span className="text-gray-700">{meal}</span>
              <TrashSimple
                className="cursor-pointer text-red-500"
                size={24}
                onClick={() => handleDeleteMeal(index)}
              />
            </li>
          ))}
        </ul>

        <div className="flex justify-end">
          <button
            className={`rounded-md bg-green-500 px-4 py-2 text-white transition hover:bg-green-600 ${
              meals.length === 0 ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={meals.length === 0}
            onClick={() => {
              setTogglePopup(false);
              setMealsList(meals);
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealPopup;
