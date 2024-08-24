import React, { useState } from "react";
import MealContainer from "./MealContainer";
import MealType from "./MealType";

const DayMealContainer = ({ dietDetails, setDietDetails }) => {
  const [copy, setCopy] = useState("");
  return (
    // OLD
    // <div className="container mx-auto">
    //   <div className="border-red grid grid-cols-8">
    //     {dietDetails?.map((meal, i) => (
    //       <>
    //         <div className="mb-2 mr-4 rounded-md border border-black bg-white p-4 shadow-xl">
    //           <MealType
    //             mealDetails={meal.mealDetails}
    //             id={i}
    //             setDietDetails={setDietDetails}
    //             dietDetails={dietDetails}
    //           />
    //         </div>
    //         {meal?.Days?.map((day, index) => (
    //           <div key={index}>
    //             <MealContainer
    //               day={day}
    //               id={i}
    //               dayId={index}
    //               setDietDetails={setDietDetails}
    //               dietDetails={dietDetails}
    //               setCopy={setCopy}
    //               copy={copy}
    //             />
    //           </div>
    //         ))}
    //       </>
    //     ))}
    //   </div>
    // </div>

    // NEW
    <div className="container mx-auto">
      <div className="grid grid-cols-8 gap-4">
        {dietDetails?.map((meal, i) => (
          <div key={`${meal?.MealType}-${i}`}>
            <div className="mb-4 mr-4 rounded-md border border-gray-300 bg-white p-4 shadow-md">
              <MealType
                mealDetails={meal.mealDetails}
                id={i}
                setDietDetails={setDietDetails}
                dietDetails={dietDetails}
              />
            </div>
            {meal?.Days?.map((day, index) => (
              <div key={index}>
                <MealContainer
                  day={day}
                  id={i}
                  dayId={index}
                  setDietDetails={setDietDetails}
                  dietDetails={dietDetails}
                  setCopy={setCopy}
                  copy={copy}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayMealContainer;
