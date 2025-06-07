"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

type RequestType = {
  _id: string;
  expertID: string;
  expertName: string;
  userID: string;
  slot: string;
  status: string;
  isPayment: boolean;
  paymentIntentID: string;
};

type UserType = {
  _id: string;
  clerkID: string;
  fullName: string;
  email: string;
  linkedinURL: string;
  twitterURL: string;
  websiteURL: string;
};

type SessionType = {
  _id: string;
  userID: string;
  role: string;
  industry: string;
  stage: string;
  aboutStartup: string;
  helpWith: string;
  reasonToTalk: string;
};

type CombinedData = {
  request: RequestType;
  user: UserType | null;
  usersessiondata: SessionType | null;
};

export default function ExpertRequests() {
  const { user } = useUser();
  const expertID = user?.id;
  const [combinedData, setCombinedData] = useState<CombinedData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Step 1: Get all requests for this expert
        const requestRes = await fetch(`/api/request`);
        const res = await requestRes.json();
        const requests = res.data;
        // console.log("response is", requests.data);
        if(requests.status===false)
        {
            console.log("error fetching expert data")
        }
        const results: CombinedData[] = [];

        // Step 2: For each request, get user profile and session data
        for (const request of requests) {
          const userID = request.userID;

          const [userRes, sessionRes] = await Promise.all([
            fetch(`/api/user/saveuserdata?userId=${userID}`),
            fetch(`/api/user/saveUserSessionData?userId=${userID}`),
          ]);
        
          const userJson = await userRes.json();
          const sessionJson = await sessionRes.json();
          if(userJson.status===false || userJson.found===false)
            console.log("error fetching user data");
          if(sessionJson.status===false || sessionJson.found===false)
            console.log("error fetching session data")
          results.push({
            request,
            user: userJson?.userData || null,
            usersessiondata: sessionJson?.userData || null,
          });
        }
        
        setCombinedData(results);
        console.log("Final Combined Data: ", results);
      } catch (error) {
        console.error("Error fetching expert request data", error);
      }
    };

    fetchData();
  }, [expertID]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Expert Requests</h2>
      {combinedData.map(({ request, user, usersessiondata }) => (
        <div key={request._id} className="mb-6 p-4 border rounded">
          <h3 className="text-lg font-semibold">
            From: {user?.fullName || "Unknown"}
          </h3>
          <p>Email: {user?.email}</p>
          <p>LinkedIn: {user?.linkedinURL}</p>
          <p>Stage: {usersessiondata?.stage}</p>
          <p>Industry: {usersessiondata?.industry}</p>
          <p>About Startup: {usersessiondata?.aboutStartup}</p>
          <p>Help With: {usersessiondata?.helpWith}</p>
          <p>Reason: {usersessiondata?.reasonToTalk}</p>
          <p>Slot: {new Date(request.slot).toLocaleString()}</p>
          <p>Status: {request.status}</p>
        </div>
      ))}
    </div>
  );
}
