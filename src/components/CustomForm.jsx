import React, { useState } from "react";
import { useFirebase } from "../Firebase";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const CustomForm = ({ user, handleLogout }) => {
  const { saveFormResponse, markFormAsSubmitted, uploadFile } = useFirebase();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    physicalActivity: "",
    economicStatus: "",
    foodChoice: "",
    requirements: "",
    symptoms: "",
    surgicalHistory: "",
    medicalReports: null,
    foodAllergies: "",
    foodLikes: "",
    foodDislikes: "",
    smokingDrinkingHabit: "",
    weightLoss: "",
    dailyDiet: "",
    sleepWakeTime: "",
    medications: "",
    outsideFoodFrequency: "",
    digestiveIssues: "",
    bodyPicture: null,
    waterIntake: "",
    dietStartDate: "",
    paymentScreenshot: null,
    additionalInfo: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const uploadedFiles = {};
      for (const key in formData) {
        if (formData[key] instanceof File) {
          uploadedFiles[key] = await uploadFile(formData[key]);
        }
      }

      const formResponse = {
        ...formData,
        ...uploadedFiles,
      };

      // Save response to Firestore
      await saveFormResponse(user.uid, formResponse);
      await markFormAsSubmitted(user.uid);

      // Save response to Google Sheets
      //   await submitToGoogleSheets(formResponse);

      // Redirect to success page
      navigate("/form-success");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  //   const submitToGoogleSheets = async (formResponse) => {
  //     const scriptURL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";

  //     await fetch(scriptURL, {
  //       method: "POST",
  //       body: JSON.stringify(formResponse),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //   };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className=" min-h-screen bg-gray-100 p-6">
          <div className="mb-6 flex items-center justify-between border-b border-gray-300 pb-4">
            <h1 className="text-3xl font-semibold text-gray-800">
              Please fill the form
            </h1>
            <button
              className="rounded-md bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mx-auto space-y-6 rounded-lg bg-white p-6 shadow-md lg:w-3/4"
          >
            <div className="mt-4">
              <label className="block text-base font-semibold tracking-wide text-gray-800 md:text-lg">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                autoFocus
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-base font-semibold tracking-wide text-gray-800 md:text-lg">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-base font-semibold tracking-wide text-gray-800 md:text-lg">
                Gender <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-base font-semibold tracking-wide text-gray-800 md:text-lg">
                Weight <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-base font-semibold tracking-wide text-gray-800 md:text-lg">
                Height (in cms) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-base font-semibold tracking-wide text-gray-800 md:text-lg">
                Physical activity <span className="text-red-500">*</span>
              </label>
              <div className="mt-2 flex flex-col">
                {["Bedridden", "Light", "Medium", "Heavy"].map((activity) => (
                  <label
                    key={activity}
                    className="mb-2 mr-4 inline-flex items-center md:text-lg"
                  >
                    <input
                      type="radio"
                      name="physicalActivity"
                      value={activity}
                      checked={formData.physicalActivity === activity}
                      onChange={handleChange}
                      className="form-radio border-gray-300 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <span className="ml-2 text-gray-700">{activity}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-base font-semibold tracking-wide text-gray-800 md:text-lg">
                Economic Status <span className="text-red-500">*</span>
              </label>
              <div className="mt-2 flex flex-col">
                {[
                  "Low income group",
                  "Middle income group",
                  "High income group",
                ].map((status) => (
                  <label
                    key={status}
                    className="mb-2 mr-4 inline-flex items-center md:text-lg"
                  >
                    <input
                      type="radio"
                      name="economicStatus"
                      value={status}
                      checked={formData.economicStatus === status}
                      onChange={handleChange}
                      className="form-radio border-gray-300 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <span className="ml-2 text-gray-700">{status}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-base font-semibold tracking-wide text-gray-800 md:text-lg">
                Food Choice <span className="text-red-500">*</span>
              </label>
              <div className="mt-2 flex flex-col">
                {[
                  "Non Vegetarian",
                  "Vegetarian (with egg)",
                  "Vegetarian (without egg)",
                ].map((choice) => (
                  <label
                    key={choice}
                    className="mb-2 mr-4 inline-flex items-center md:text-lg"
                  >
                    <input
                      type="radio"
                      name="foodChoice"
                      value={choice}
                      checked={formData.foodChoice === choice}
                      onChange={handleChange}
                      className="form-radio border-gray-300 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <span className="ml-2 text-gray-700">{choice}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-base font-semibold tracking-wide text-gray-800 md:text-lg">
                Requirements (if suffering from a disease, kindly mention){" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                className="mt-1 block h-24 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-base font-semibold tracking-wide text-gray-800 md:text-lg">
                Symptoms
              </label>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                className="mt-1 block h-24 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-4">
              <label className="block text-base font-semibold tracking-wide text-gray-800 md:text-lg">
                Surgical History
              </label>
              <textarea
                name="surgicalHistory"
                value={formData.surgicalHistory}
                onChange={handleChange}
                className="mt-1 block h-24 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-4">
              <label className="block text-base font-semibold tracking-wide text-gray-800 md:text-lg">
                Medical Reports (Photo/PDF)
              </label>
              <input
                type="file"
                name="medicalReports"
                accept="image/*,.pdf"
                onChange={handleChange}
                className="text-md file:text-md mt-1 block w-full text-gray-500 file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-gray-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-gray-700"
              />
            </div>
            <div className="mt-4">
              <label className="block text-base font-semibold tracking-wide text-gray-800 md:text-lg">
                Food Allergies
              </label>
              <textarea
                name="foodAllergies"
                value={formData.foodAllergies}
                onChange={handleChange}
                className="mt-1 block h-24 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-4">
              <label className="block text-base font-semibold tracking-wide text-gray-800 md:text-lg">
                Food Likes
              </label>
              <textarea
                name="foodLikes"
                value={formData.foodLikes}
                onChange={handleChange}
                className="mt-1 block h-24 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-4">
              <label className="block text-base font-semibold tracking-wide text-gray-800 md:text-lg">
                Food Dislikes
              </label>
              <textarea
                name="foodDislikes"
                value={formData.foodDislikes}
                onChange={handleChange}
                className="mt-1 block h-24 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-4">
              <label className="block text-base font-semibold tracking-wide text-gray-800 md:text-lg">
                Smoking/Drinking Habit <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="smokingDrinkingHabit"
                value={formData.smokingDrinkingHabit}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-base font-semibold tracking-wide text-gray-800 md:text-lg">
                Tried weight loss before? Y/N If yes, details.{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="weightLoss"
                value={formData.weightLoss}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-base font-semibold tracking-wide text-gray-800 md:text-lg">
                Describe your daily diet <span className="text-red-500">*</span>
              </label>
              <textarea
                name="dailyDiet"
                value={formData.dailyDiet}
                onChange={handleChange}
                className="mt-1 block h-24 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-base font-semibold tracking-wide text-gray-800 md:text-lg">
                Sleep and Wake up time <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="sleepWakeTime"
                value={formData.sleepWakeTime}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-base font-semibold tracking-wide text-gray-800 md:text-lg">
                Any medication? Y/N If yes, details
              </label>
              <input
                type="text"
                name="medications"
                value={formData.medications}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-4">
              <label className="block text-base font-semibold tracking-wide text-gray-800 md:text-lg">
                How many times do you eat outside food in a week?{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="outsideFoodFrequency"
                value={formData.outsideFoodFrequency}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-base font-semibold tracking-wide text-gray-800 md:text-lg">
                Digestive issues
              </label>
              <input
                type="text"
                name="digestiveIssues"
                value={formData.digestiveIssues}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-4">
              <label className="block text-base font-semibold tracking-wide text-gray-800 md:text-lg">
                Straight Body Picture <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                name="bodyPicture"
                accept="image/*"
                onChange={handleChange}
                className="text-md file:text-md mt-1 block w-full text-gray-500 file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-gray-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-gray-700"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-base font-semibold tracking-wide text-gray-800 md:text-lg">
                Water intake (in liters) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="waterIntake"
                value={formData.waterIntake}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-base font-semibold tracking-wide text-gray-800 md:text-lg">
                When do you want to start your diet plan? Mention the date.{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dietStartDate"
                value={formData.dietStartDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-base font-semibold tracking-wide text-gray-800 md:text-lg">
                Screenshot of payment (Photo/PDF){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                name="paymentScreenshot"
                accept="image/*,.pdf"
                onChange={handleChange}
                className="text-md file:text-md mt-1 block w-full text-gray-500 file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-gray-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-gray-700"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-base font-semibold tracking-wide text-gray-800 md:text-lg">
                Additional information
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                className="mt-1 block h-24 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2 text-white"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default CustomForm;
