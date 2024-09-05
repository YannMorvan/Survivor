"use client";

import React from "react";
import { ArrowLeft, Bookmark, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

const customers = {
  id: "UD003054",
  surname: "Mitcham",
  name: "Francis",
  email: "francis.mitcham@tmail.com",
  phone: "(555) 555-5555",
  address: "551 Swanston Street, Melbourne Victoria 3053 Australia",
  image: "/images/avatars/1.jpg",
  lastActivity: "15 Feb, 2024",
  coachName: "Gerard Depardieu",
  totalEncounters: 23,
  positive: 21,
  inProgress: 2,
};

const recentMeetings = [
  {
    date: "15 Feb, 2024",
    rating: 5,
    notes: "Francis is doing well, keep up the good work",
    source: "Dating App",
  },
  {
    date: "14 Feb, 2024",
    rating: 4,
    notes: "Good progress, needs slight improvement.",
    source: "Friends",
  },
  {
    date: "14 Feb, 2024",
    rating: 3,
    notes: "Good progress, needs slight improvement.",
    source: "Social Network",
  },
  {
    date: "14 Feb, 2024",
    rating: 2,
    notes: "Good progress, needs slight improvement.",
    source: "Dating App",
  },
  {
    date: "14 Feb, 2024",
    rating: 0,
    notes: "Good progress, needs slight improvement.",
    source: "Dating App",
  },
];

const paymentsHistory = [
  {
    date: "15 Feb, 2024",
    paymentHistory: "Visa",
    amount: "$50",
    comment: "Payment for session",
  },
  {
    date: "14 Feb, 2024",
    paymentHistory: "Visa",
    amount: "$50",
    comment: "Payment for session",
  },
  {
    date: "14 Feb, 2024",
    paymentHistory: "Visa",
    amount: "$50",
    comment: "Payment for session",
  },
  {
    date: "14 Feb, 2024",
    paymentHistory: "Visa",
    amount: "$50",
    comment: "Payment for session",
  },
  {
    date: "14 Feb, 2024",
    paymentHistory: "Visa",
    amount: "$50",
    comment: "Payment for session",
  },
];

const StarRating = ({ rating }) => {
  const totalStars = 5;
  const filledStars = Array(rating).fill("★");
  const emptyStars = Array(totalStars - rating).fill("☆");

  return (
    <span className="text-black">
      {filledStars.map((star, index) => (
        <span key={`filled-${index}`} className="text-black">
          {star}
        </span>
      ))}
      {emptyStars.map((star, index) => (
        <span key={`empty-${index}`} className="text-black">
          {star}
        </span>
      ))}
    </span>
  );
};

const getSourceColor = (source) => {
  switch (source) {
    case "Dating App":
      return "text-orange-500";
    case "Social Network":
      return "text-blue-500";
    case "Friends":
      return "text-green-500";
    default:
      return "text-[#384B65]";
  }
};

const Page = () => {
  const router = useRouter();

  return (
    <div className="mx-6 flex flex-col">
      <div className="flex justify-between items-center mb-6 flex-row">
        <h1 className="text-3xl font-semibold text-[#384B65]">
          Customers List
        </h1>
        <button
          className="flex items-center bg-white text-[#384B65] px-6 py-2 rounded-lg border border-[#E1E8F1]"
          onClick={() => router.back()}
        >
          <ArrowLeft size={24} className="mr-2" />
          <p className="text-lg">Back</p>
        </button>
      </div>
      <div className="flex flex-row justify-between items-start mb-4 gap-10">
        <div className="flex flex-col border-2 bg-white border-[#E1E8F1] rounded-md w-1/4">
          <div className="flex flex-col items-center px-12 py-6 gap-4 justify-center">
            <img
              src={customers.image}
              alt="avatar"
              className="w-32 h-32 rounded-full border border-[#E1E8F1]"
            />
            <div>
              <p className="text-lg font-bold text-[#384B65]">
                {customers.name} {customers.surname}
              </p>
            </div>
          </div>
          <div className="flex flex-row items-center justify-center gap-6 py-4 border-t-2 border-[#E1E8F1]">
            <button>
              <Mail size={24} className="text-[#384B65] mx-2" />
            </button>
            <button>
              <Bookmark size={24} className="text-[#384B65] mx-2" />
            </button>
          </div>
          <div className="flex flex-col justify-around py-4 border-t-2 border-[#E1E8F1]">
            <div className="flex flex-row justify-around">
              <p className="text-lg text-[#384B65]">
                {customers.totalEncounters}
              </p>
              <p className="text-lg text-[#384B65]">{customers.positive}</p>
              <p className="text-lg text-[#384B65]">{customers.inProgress}</p>
            </div>
            <div className="flex flex-row justify-around">
              <div className="flex flex-col items-center">
                <p className="text-sm text-[#384B65]">Total</p>
                <p className="text-sm text-[#384B65]">Encounters</p>
              </div>
              <p className="text-sm text-[#384B65]">Positive</p>
              <p className="text-sm text-[#384B65]">In Progress</p>
            </div>
          </div>
          <div className="flex flex-col py-4 px-4 border-t-2 border-[#E1E8F1] gap-4 text-sm font-semibold text-gray-600">
            <p>SHORT DETAILS</p>
            <div>
              <p>User ID:</p>
              <p className="text-[#384B65]">{customers.id}</p>
            </div>
            <div>
              <p>Email:</p>
              <p className="text-[#384B65]">{customers.email}</p>
            </div>
            <div>
              <p>Address:</p>
              <p className="text-[#384B65]">{customers.address}</p>
            </div>
            <div>
              <p>Last Activity:</p>
              <p className="text-[#384B65]">{customers.lastActivity}</p>
            </div>
            <div>
              <p>Coach</p>
              <p className="text-[#384B65]">{customers.coachName}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-white w-3/4 p-4 rounded-md border border-[#E1E8F1] gap-6 max-h-fit">
          <div>
            <h2 className="text-xl font-semibold text-[#384B65] mb-4">
              Recent Meetings
            </h2>
            <table className="min-w-full bg-white border-collapse border border-[#E1E8F1] overflow-x-auto">
              <thead>
                <tr className="border-b border-[#E1E8F1]">
                  <th className="text-left p-2 font-medium text-[#384B65]">
                    Date
                  </th>
                  <th className="text-left p-2 font-medium text-[#384B65]">
                    Rating
                  </th>
                  <th className="text-left p-2 font-medium text-[#384B65]">
                    Notes
                  </th>
                  <th className="text-left p-2 font-medium text-[#384B65]">
                    Source
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentMeetings.map((meeting, index) => (
                  <tr key={index} className="border-b border-[#E1E8F1]">
                    <td className="p-2 text-[#0369A1]">{meeting.date}</td>
                    <td className="p-2 text-[#384B65]">
                      <StarRating rating={meeting.rating} />
                    </td>
                    <td className="p-2 text-[#384B65]">{meeting.notes}</td>
                    <td className={`p-2 ${getSourceColor(meeting.source)}`}>
                      {meeting.source}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#384B65] mb-4">
              Payments history
            </h2>
            <table className="min-w-full bg-white border-collapse border border-[#E1E8F1] overflow-x-auto">
              <thead>
                <tr className="border-b border-[#E1E8F1]">
                  <th className="text-left p-2 font-medium text-[#384B65]">
                    Date
                  </th>
                  <th className="text-left p-2 font-medium text-[#384B65]">
                    Payment Method
                  </th>
                  <th className="text-left p-2 font-medium text-[#384B65]">
                    Amount
                  </th>
                  <th className="text-left p-2 font-medium text-[#384B65]">
                    Comment
                  </th>
                </tr>
              </thead>
              <tbody>
                {paymentsHistory.map((paymentHistory, index) => (
                  <tr key={index} className="border-b border-[#E1E8F1]">
                    <td className="p-2 text-[#0369A1]">
                      {paymentHistory.date}
                    </td>
                    <td className="p-2 text-[#384B65]">
                      {paymentHistory.paymentHistory === "Visa" ? (
                        <img
                          src="/images/visa-logo.png"
                          alt="Visa Logo"
                          className="w-9 h-3"
                        />
                      ) : (
                        paymentHistory.paymentHistory
                      )}
                    </td>
                    <td className="p-2 text-[#384B65]">
                      {paymentHistory.amount}
                    </td>
                    <td className="p-2 text-[#384B65]">
                      {paymentHistory.comment}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
