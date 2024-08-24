import React, { useEffect, useState } from "react";
import { useFirebase } from "../Firebase";

const ImportPopup = ({
  toggler,
  handler,
  setSelectedCustom,
  selectedCustom,
}) => {
  const [meal, setMeal] = useState("");
  const [customList, setCustomList] = useState([]);
  const { fetchCustomMeals } = useFirebase();
  const [open, setOpen] = useState(false);

  const handleOutside = (e) => {
    if (e.target.id === "con") toggler(false);
  };
  useEffect(() => {
    const fetchCustom = async () => {
      try {
        const data = await fetchCustomMeals();
        setCustomList(data);
      } catch (error) {
        console.error("Failed to save custom diet plan:", error);
      }
    };
    fetchCustom();
    if (selectedCustom?.name) setMeal(selectedCustom.name);
  }, [selectedCustom]);

  const handleSelect = (item) => {
    setOpen(false);
    setMeal(item?.name);
    setSelectedCustom(item);
  };
  const handleChange = (e) => {
    setMeal(e.target.value);
    if (e.target.value) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };
  const handleAddMeal = () => {
    handler(selectedCustom?.list);
    toggler(false);
  };

  return (
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
        <div className="mb-4 flex space-x-3">
          <div className="relative flex-grow">
            <input
              type="text"
              className="w-full rounded border border-gray-400 px-3 py-2 outline-violet-300 focus:border-violet-500"
              placeholder="Enter a meal..."
              value={meal}
              onChange={handleChange}
            />
            {meal && open && (
              <div className="absolute z-10 mt-1 max-h-[20vh] w-full overflow-y-auto bg-white py-2 text-sm shadow-md">
                {customList
                  ?.filter((out) =>
                    out?.name
                      ?.toLowerCase()
                      .includes(meal.toLowerCase().trim()),
                  )
                  .map((opt) => (
                    <div
                      key={opt.name}
                      className="cursor-pointer px-3 py-1 hover:bg-gray-100"
                      onClick={() => {
                        handleSelect(opt);
                      }}
                    >
                      {opt.name}
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
      </div>
    </div>
  );
};

export default ImportPopup;
