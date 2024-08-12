import React, { useEffect, useState } from "react";

const MealType = ({ mealDetails, setDietDetails, id, dietDetails }) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    setTime(mealDetails.time);
  }, [mealDetails]);

  const handleOnChange = (e) => {
    setTime(e.target.value);
    const copy = [...dietDetails];
    copy[id].mealDetails = {
      ...copy[id].mealDetails,
      time: e.target.value,
    };
    setDietDetails(copy);
  };

  return (
    // OLD
    // <>
    //   <h3>{mealDetails.mealType}</h3>
    //   <p>at</p>
    //   <input type="time" value={time} onChange={handleOnChange} />
    // </>

    //NEW
    <>
      <h3 className="text-lg font-semibold text-gray-700">
        {mealDetails.mealType}
      </h3>
      <p className="text-sm text-gray-500">at</p>
      <input
        type="time"
        value={time}
        onChange={handleOnChange}
        className="mt-1 rounded-md px-2 py-1 text-sm text-gray-700"
      />
    </>
  );
};

export default MealType;
