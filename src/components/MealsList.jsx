import React, { useState } from "react";
import { TrashSimple } from "@phosphor-icons/react";

const MealsList = ({ meals, setMeals }) => {
  const [editingMealIndex, setEditingMealIndex] = useState(null);
  const [inputMeal, setInputMeal] = useState("");

  const handleDeleteMeal = (index) => {
    const updatedMeals = [...meals];
    updatedMeals.splice(index, 1);
    setMeals(updatedMeals);
  };

  return (
    //OLD
    // <div>
    //   <ul className="h-[20vh] overflow-y-auto py-1">
    //     {meals?.map((meal, index) => (
    //       <>
    //         <li
    //           key={index}
    //           className="mb-2 flex items-center justify-between rounded-md border border-black bg-white p-1 text-sm"
    //         >
    //           {editingMealIndex === index ? (
    //             <input
    //               type="text"
    //               value={inputMeal}
    //               onChange={(e) => setInputMeal(e.target.value)}
    //               autoFocus
    //             />
    //           ) : (
    //             <span>{meal}</span>
    //           )}
    //           {editingMealIndex === index ? (
    //             <div className="space-x-2">
    //               <button
    //                 className="text-red-500"
    //                 onClick={() => {
    //                   setInputMeal("");
    //                   setEditingMealIndex(null);
    //                 }}
    //               >
    //                 Cancel
    //               </button>
    //             </div>
    //           ) : (
    //             <div className="space-x-2">
    //               <TrashSimple
    //                 className="cursor-pointer"
    //                 size={20}
    //                 color="red"
    //                 onClick={() => handleDeleteMeal(index)}
    //               />
    //             </div>
    //           )}
    //         </li>
    //       </>
    //     ))}
    //   </ul>
    // </div>

    //NEW
    <div>
      <ul className="h-[20vh] overflow-y-auto py-1">
        {meals?.map((meal, index) => (
          <li
            key={index}
            className="mb-2 flex items-center justify-between rounded-md border border-gray-300 bg-white p-2 text-sm"
          >
            {editingMealIndex === index ? (
              <input
                type="text"
                value={inputMeal}
                onChange={(e) => setInputMeal(e.target.value)}
                autoFocus
                className="mr-2 rounded-md border border-gray-300 px-2 py-1 text-gray-700"
              />
            ) : (
              <span>{meal}</span>
            )}
            <div className="space-x-2">
              {editingMealIndex === index ? (
                <button
                  className="text-red-500"
                  onClick={() => {
                    setInputMeal("");
                    setEditingMealIndex(null);
                  }}
                >
                  Cancel
                </button>
              ) : (
                <TrashSimple
                  className="cursor-pointer"
                  size={20}
                  color="red"
                  onClick={() => handleDeleteMeal(index)}
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MealsList;
