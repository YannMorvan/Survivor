"use client";

import React, { useEffect } from "react";
import { ArrowLeft, Bookmark, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

import { sendPostRequest } from "../../utils/utils.js";

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

const getRandomColor = () => {
  const colors = ["text-orange-500", "text-blue-500", "text-green-500"];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

interface Customer {
  address: string;
  email: string;
  encounters: Encounter[];
  id: string;
  image: string;
  name: string;
  payment: Payment[];
  plannedEncounters: number;
  positiveEncounters: number;
  surname: string;
  totalEncounters: number;
  coachName: string;
  lastActivity: string;
}

interface Encounter {
  comment: string;
  date: string;
  id: number;
  idCustomer: number;
  rating: number;
  source: string;
}

interface Payment {
  id: number;
  idCustomer: number;
  date: string;
  method: string;
  amount: string;
}

const ProfileDetails = ({ params }: { params: { id: string } }) => {
  const router = useRouter();

  const [customerData, setCustomerData] = React.useState<Customer>({
    address: "",
    email: "",
    encounters: [],
    id: "",
    image: "",
    name: "",
    payment: [],
    plannedEncounters: 0,
    positiveEncounters: 0,
    surname: "",
    totalEncounters: 0,
    coachName: "",
    lastActivity: "",
  });

  const [recentEncounters, setRecentEncounters] = React.useState<Encounter[]>(
    []
  );

  const [payment, setPayments] = React.useState<Payment[]>([]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await sendPostRequest(
          "http://localhost/client_profile.php",
          {
            id: params.id,
          }
        );

        const parsedResponse = JSON.parse(response);

        if (parsedResponse.error) {
          console.error(parsedResponse.error);
          return;
        }

        const customer = parsedResponse.data;

        setCustomerData({
          address: customer.address,
          email: customer.email,
          encounters: customer.encounters,
          id: customer.id,
          image: customer.image,
          name: customer.name,
          payment: Array.isArray(customer.payment) ? customer.payment : [],
          plannedEncounters: customer.plannedEncounters || 0,
          positiveEncounters: customer.positiveEncounters || 0,
          surname: customer.surname,
          totalEncounters: customer.totalEncounters || 0,
          coachName: customer.coachName || "Pas de Coach assigné",
          lastActivity: customer.lastActivity || "Aucune activité",
        });

        console.log(customer.payment);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCustomerData();
  }, []);

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
          <p className="text-lg">Retour</p>
        </button>
      </div>
      <div className="flex flex-row justify-between items-start mb-4 gap-10">
        <div className="flex flex-col border-2 bg-white border-[#E1E8F1] rounded-md w-1/4">
          <div className="flex flex-col items-center px-12 py-6 gap-4 justify-center">
            <img
              src={`data:image/jpeg;base64,${customerData.image}`}
              alt="avatar"
              className="w-32 h-32 rounded-full border border-[#E1E8F1]"
            />
            <div>
              <p className="text-lg font-bold text-[#384B65]">
                {customerData.name} {customerData.surname}
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
                {customerData.totalEncounters}
              </p>
              <p className="text-lg text-[#384B65]">
                {customerData.positiveEncounters}
              </p>
              <p className="text-lg text-[#384B65]">
                {customerData.totalEncounters - customerData.positiveEncounters}
              </p>
            </div>
            <div className="flex flex-row justify-around">
              <div className="flex flex-col items-center">
                <p className="text-sm text-[#384B65]">Total</p>
                <p className="text-sm text-[#384B65]">Rencontres</p>
              </div>
              <p className="text-sm text-[#384B65]">Positives</p>
              <p className="text-sm text-[#384B65]">En Cours</p>
            </div>
          </div>
          <div className="flex flex-col py-4 px-4 border-t-2 border-[#E1E8F1] gap-4 text-sm font-semibold text-gray-600">
            <p>DETAILS</p>
            <div>
              <p>Identifiant:</p>
              <p className="text-[#384B65]">{customerData.id}</p>
            </div>
            <div>
              <p>Email:</p>
              <p className="text-[#384B65]">{customerData.email}</p>
            </div>
            <div>
              <p>Adresse:</p>
              <p className="text-[#384B65]">{customerData.address}</p>
            </div>
            <div>
              <p>Dernière Activité:</p>
              <p className="text-[#384B65]">{customerData.lastActivity}</p>
            </div>
            <div>
              <p>Coach</p>
              <p className="text-[#384B65]">{customerData.coachName}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-white w-3/4 p-4 rounded-md border border-[#E1E8F1] gap-6 max-h-fit">
          <div>
            <h2 className="text-xl font-semibold text-[#384B65] mb-4">
              Rencontres Récentes
            </h2>
            <table className="min-w-full bg-white border-collapse border border-[#E1E8F1] overflow-x-auto">
              <thead>
                <tr className="border-b border-[#E1E8F1]">
                  <th className="text-left p-2 font-medium text-[#384B65]">
                    Date
                  </th>
                  <th className="text-left p-2 font-medium text-[#384B65]">
                    Note
                  </th>
                  <th className="text-left p-2 font-medium text-[#384B65]">
                    Commentaire
                  </th>
                  <th className="text-left p-2 font-medium text-[#384B65]">
                    Source
                  </th>
                </tr>
              </thead>
              <tbody>
                {customerData.encounters.map((encounter, index) => (
                  <tr key={index} className="border-b border-[#E1E8F1]">
                    <td className="p-2 text-[#0369A1]">{encounter.date}</td>
                    <td className="p-2 text-[#384B65]">
                      <StarRating rating={encounter.rating} />
                    </td>
                    <td className="p-2 text-[#384B65]">{encounter.comment}</td>
                    <td className={`p-2 ${getRandomColor()}`}>
                      {encounter.source}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#384B65] mb-4">
              Historique de Paiement
            </h2>
            <table className="min-w-full bg-white border-collapse border border-[#E1E8F1] overflow-x-auto">
              <thead>
                <tr className="border-b border-[#E1E8F1]">
                  <th className="text-left p-2 font-medium text-[#384B65]">
                    Date
                  </th>
                  <th className="text-left p-2 font-medium text-[#384B65]">
                    Method de Paiement
                  </th>
                  <th className="text-left p-2 font-medium text-[#384B65]">
                    Montant
                  </th>
                  <th className="text-left p-2 font-medium text-[#384B65]">
                    Commentaire
                  </th>
                </tr>
              </thead>
              <tbody>
                {customerData.payment.map((pay, index) => (
                  <tr key={index} className="border-b border-[#E1E8F1]">
                    <td className="p-2 text-[#0369A1]">{pay.date}</td>
                    <td className="p-2 text-[#384B65]">
                      {pay.method === "Visa" ? (
                        <img
                          src="/images/visa-logo.png"
                          alt="Visa Logo"
                          className="w-9 h-3"
                        />
                      ) : (
                        pay.method
                      )}
                    </td>
                    <td className="p-2 text-[#384B65]">{pay.amount}</td>
                    <td className="p-2 text-[#384B65]">{"No comment"}</td>
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

export default ProfileDetails;
