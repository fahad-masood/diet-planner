import React, { useEffect, useState } from "react";
import MealPopup from "./MealPopup";
import MealsList from "./MealsList";
import { PlusCircle, Swap, Copy } from "@phosphor-icons/react";

const MealContainer = ({
  copy,
  setCopy,
  day,
  dayId,
  id,
  dietDetails,
  setDietDetails,
}) => {
  const [togglePopup, setTogglePopup] = useState(false);
  const [mealsList, setMealsList] = useState(day.items);

  useEffect(() => {
    const copyDiet = [...dietDetails];
    copyDiet[id].Days[dayId] = {
      ...copyDiet[id].Days[dayId],
      items: mealsList,
    };
    setDietDetails(copyDiet);
  }, [mealsList]);

  const handleAddMeal = (id, dayId) => {
    const copyDiet = [...dietDetails];
    copyDiet[id].Days[dayId] = {
      ...copyDiet[id].Days[dayId],
      items: mealsList,
    };
    setDietDetails(copyDiet);
  };

  const findIndex = (mealData, selected) => {
    return mealData.Days.findIndex((day) => day.dayId === selected.dayId);
  };

  const handleSwap = (obj) => {
    if (!copy) {
      setCopy({ id: id, detail: obj });
    } else {
      let updateCop = [...dietDetails];
      let dayCop = [...updateCop[id].Days];
      const findCurrentIndexDay = findIndex(updateCop[id], obj);
      dayCop[findCurrentIndexDay] = {
        ...dayCop[findCurrentIndexDay],
        items: copy.detail.items,
      };

      updateCop[id] = { ...updateCop[id], Days: dayCop };

      const findCopiedIndexDay = findIndex(updateCop[copy.id], copy.detail);
      let dayObj = [...updateCop[copy.id].Days];
      dayObj[findCopiedIndexDay] = {
        ...dayObj[findCopiedIndexDay],
        items: obj.items,
      };
      updateCop[copy.id] = { ...updateCop[copy.id], Days: dayObj };

      setDietDetails(updateCop);
      setCopy("");
    }
  };
  const handleCopy = (day) => {
    console.log("ahjdhjas", day);
  };

  return (
    <div className="relative">
      <div
        className={`${
          togglePopup
            ? "overflow-hidden backdrop-blur-md"
            : copy?.detail?.dayId === day?.dayId
            ? "border-2 border-red-500"
            : ""
        } mb-2 mr-2 rounded-lg border border-gray-500 bg-violet-400 p-3 shadow-xl`}
      >
        <MealsList meals={mealsList} setMeals={setMealsList} />

        <div className="flex justify-center text-center">
          <PlusCircle
            className="cursor-pointer"
            size={32}
            color="blue"
            onClick={() => setTogglePopup(true)}
          />
          <Swap
            className="cursor-pointer"
            onClick={() => handleSwap(day)}
            color="green"
            size={32}
          />
          <Copy
            className="cursor-pointer"
            onClick={() => handleCopy(day)}
            color="red"
            size={32}
          />
        </div>
      </div>
      {togglePopup && (
        <div className="absolute">
          <MealPopup
            mealsList={mealsList}
            setMealsList={setMealsList}
            setTogglePopup={setTogglePopup}
          />
        </div>
      )}
    </div>
  );
};

export default MealContainer;
