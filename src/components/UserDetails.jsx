import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFirebase } from "../Firebase";
import Loader from "./Loader";
import RenderContent from "./RenderContent";
import DayMealContainer from "./DayMealContainer";
const days = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];

const UserDetails = () => {
  const { fetchUserDetails } = useFirebase();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDetails = await fetchUserDetails(userId);
        setUser(userDetails);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
      setLoading(false);
    };

    fetchUser();
  }, [userId, fetchUserDetails]);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <p>No user data available.</p>;
  }

  // const renderSection = (title, value) =>
  //   value ? (
  //     <div className="mb-4">
  //       <h4 className="text-md font-semibold">{title}:</h4>
  //       <p className="text-gray-700">{value}</p>
  //     </div>
  //   ) : null;

  const { formResponses } = user;
  console.log("form", user?.dietPlans);
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-6">
        <h1 className="text-3xl font-semibold text-gray-800">User Details</h1>
        <div className="flex items-center gap-2">
          <span
            className={`cursor-pointer rounded-md border border-blue-500 px-2 py-1 text-blue-500 ${
              currentTab === 0 ? "bg-green-500" : ""
            }`}
            onClick={() => setCurrentTab(0)}
          >
            User Profile
          </span>
          <span
            className={`cursor-pointer rounded-md border border-blue-500 px-2 py-1 text-blue-500 ${
              currentTab === 1 ? "bg-green-500" : ""
            }`}
            onClick={() => setCurrentTab(1)}
          >
            Meal List
          </span>
        </div>
      </div>

      {currentTab === 0 ? (
        <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Email:</h2>
            <p className="text-gray-700">{user.email}</p>
          </div>

          <div className="mt-6">
            <h3 className="mb-4 text-lg font-semibold">Form Responses:</h3>
            {formResponses[0] && (
              <div className="grid gap-4 md:grid-cols-2">
                <RenderContent title={"Name"} value={formResponses[0].name} />
                <RenderContent title={"Age"} value={formResponses[0].age} />
                <RenderContent
                  title={"Gender"}
                  value={formResponses[0].gender}
                />
                <RenderContent
                  title={"Height"}
                  value={formResponses[0].height}
                />
                <RenderContent
                  title={"Weight"}
                  value={formResponses[0].weight}
                />
                <RenderContent
                  title={"Economic Status"}
                  value={formResponses[0].economicStatus}
                />
                <RenderContent
                  title={"Physical Activity"}
                  value={formResponses[0].physicalActivity}
                />
                <RenderContent
                  title={"Smoking/Drinking Habit"}
                  value={formResponses[0].smokingDrinkingHabit}
                />
                <RenderContent
                  title={"Water Intake"}
                  value={formResponses[0].waterIntake}
                />
                <RenderContent
                  title={"Daily Diet"}
                  value={formResponses[0].dailyDiet}
                />
                <RenderContent
                  title={"Food Choice"}
                  value={formResponses[0].foodChoice}
                />
                <RenderContent
                  title={"Food Likes"}
                  value={formResponses[0].foodLikes}
                />
                <RenderContent
                  title={"Food Dislikes"}
                  value={formResponses[0].foodDislikes}
                />
                <RenderContent
                  title={"Food Allergies"}
                  value={formResponses[0].foodAllergies}
                />
                <RenderContent
                  title={"Digestive Issues"}
                  value={formResponses[0].digestiveIssues}
                />
                <RenderContent
                  title={"Surgical History"}
                  value={formResponses[0].surgicalHistory}
                />
                <RenderContent
                  title={"Medications"}
                  value={formResponses[0].medications}
                />
                <RenderContent
                  title={"Symptoms"}
                  value={formResponses[0].symptoms}
                />
                <RenderContent
                  title={"Requirements"}
                  value={formResponses[0].requirements}
                />
                <RenderContent
                  title={"Additional Information"}
                  value={formResponses[0].additionalInfo}
                />

                <RenderContent
                  title={"Payment Screenshot"}
                  url={formResponses[0].paymentScreenshot}
                />
                <RenderContent
                  title={"Body Picture"}
                  url={formResponses[0].bodyPicture}
                />
                <RenderContent
                  title={"Medical Reports"}
                  url={formResponses[0].medicalReports}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {" "}
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
        </>
      )}
    </div>
  );
};

export default UserDetails;
