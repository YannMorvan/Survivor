"use client";
import React, { useState, useEffect } from "react";
import Price from "../components/charts/star";
import Meetings from "../components/charts/meetings-coach";
import Image from "next/image";
import { sendPostRequest } from "../utils/utils";
import { ArrowLeftRight } from "lucide-react";
import { useRouter } from "next/navigation";
import GradualChart from "../components/charts/gradual-chart";
import { cos } from "@amcharts/amcharts4/.internal/core/utils/Math";
import LoadingScreen from "../components/loading";

interface Coach {
  id: number;
  name: string;
  image: string;
  surname: string;
}

interface Client {
  id: number;
  name: string;
  birth_date: string;
  surname: string;
  phone: string;
  email: string;
  gender: string;
  address: string;
  description: string;
  image: string;
  astrological_sign: string;
  encounters: Encounters[];
}

interface Encounters {
  name: string;
  image: string;
  client_id: number;
  date: string;
  rating: number;
  comment: string;
  source: string;
}

export default function Page() {
  const router = useRouter();

  const [isDropdownOpen, setToggleDropdown] = useState(false);
  const [isDropdownOpen2, setToggleDropdown2] = useState(false);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [selectedCoach, setSelectedCoach] = useState("Choisir un coach");
  const [selectedCoach2, setSelectedCoach2] = useState("Choisir un coach");
  const [coachId1, setCoachId1] = useState(0);
  const [coachId2, setCoachId2] = useState(0);
  const [encounter, setEncounter] = useState<Encounters[]>([]);
  const [coachCustomers, setCoachCustomers] = useState([]);
  const [avgStar, setAvgStar] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isCoach, setIsCoach] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await sendPostRequest(
          "http://localhost/check_session.php",
          {}
        );

        const data = JSON.parse(response);

        if (data.status === true) {
          setIsLoading(false);
        }
        if (data.isCoach === true) {
          setIsCoach(true);
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error during the request: ", error);
      }
    };

    fetchData();
  }, [router]);

  const handleDropdown = () => {
    setToggleDropdown(!isDropdownOpen);
  };

  const handleCoachSelect = (coach: Coach) => {
    setSelectedCoach(coach.name);
    setCoachId1(coach.id);
    setIsOpen(false);
  };

  const handleCoachSelect2 = (coach: Coach) => {
    setSelectedCoach2(coach.name);
    setCoachId2(coach.id);
    setIsOpen2(false);
  };

  useEffect(() => {
    if (
      selectedCoach === "Choisir un coach" ||
      selectedCoach2 === "Choisir un coach"
    ) {
      return;
    }

    router.replace(`/statistics/${coachId1}/${coachId2}`);
  }, [selectedCoach, selectedCoach2]);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await sendPostRequest(
          "http://localhost/employes_table.php",
          {}
        );
        const data = JSON.parse(response);
        console.log(data);
        setCoaches(data.data);
      } catch (error) {
        console.error("Erreur lors de la requête : ", error);
      }
    };

    fetchCoaches();
  }, []);

  useEffect(() => {
    if (selectedCoach != "Choisir un coach") {
      const fetchClientsData = async () => {
        try {
          const response = await sendPostRequest(
            `http://localhost/get_coach.php`,
            { id_coach: coachId1 }
          );

          const data = JSON.parse(response);

          if (data.coach.customers.length === 0) {
            setCoachCustomers([]);
            setEncounter([]);
            setAvgStar(0);
            return;
          }

          const all_encounters: Encounters[] = [];
          data.coach.customers.forEach((customer: Client) => {
            all_encounters.push(...customer.encounters);
            customer.encounters.forEach((encounter) => {
              encounter.name = customer.name;
            });
            all_encounters.sort((a, b) => {
              return a.date < b.date ? -1 : 1;
            });
          });

          setCoachCustomers(data.coach.customers);
          setEncounter(all_encounters);

          let avgStar = 0;
          all_encounters.forEach((encounter) => {
            avgStar += encounter.rating;
          });
          avgStar = avgStar / all_encounters.length;
          setAvgStar(avgStar);
        } catch (error) {
          console.error("Erreur lors de la requête : ", error);
        }
      };

      fetchClientsData();
    }
  }, [selectedCoach]);

  useEffect(() => {
    console.log(coachCustomers);
  }, [coachCustomers]);

  useEffect(() => {
    let all_encounters: Encounters[] = [];

    if (selectedCoach2 !== "Choisir un coach") {
      const fetchClientsData = async () => {
        try {
          const response = await sendPostRequest(
            `http://localhost/get_coach.php`,
            { id_coach: coachId2 }
          );
          const data = JSON.parse(response);

          for (const customer of data.coach.customers) {
            all_encounters.push(...customer.encounters);

            customer.encounters.forEach((encounter: Encounters) => {
              encounter.name = customer.name;
              encounter.client_id = customer.id;
            });
          }

          all_encounters.sort((a, b) => (a.date < b.date ? -1 : 1));

          setCoachCustomers(data.coach.customers);

          await Promise.all(
            data.coach.customers.map(async (customer: Client) => {
              try {
                const imageResponse = await sendPostRequest(
                  "http://localhost/client_image.php",
                  { id: customer.id }
                );
                const imageData = JSON.parse(imageResponse);
                console.log(imageData);
                customer.image = imageData.data;
              } catch (error) {
                console.error("Erreur lors de la requête : ", error);
              }
            })
          );

          all_encounters.forEach((encounter: Encounters) => {
            const customer = data.coach.customers.find(
              (cust: Client) => cust.id === encounter.client_id
            );
            encounter.image = customer?.image;
          });

          console.log(all_encounters);

          setEncounter(all_encounters);

          const avgStar =
            all_encounters.reduce(
              (sum, encounter) => sum + encounter.rating,
              0
            ) / all_encounters.length;

          setAvgStar(avgStar);
        } catch (error) {
          console.error("Erreur lors de la requête : ", error);
        }
      };

      fetchClientsData();
    }
  }, [selectedCoach2]);

  const handleDropdown2 = () => {
    setToggleDropdown2(!isDropdownOpen2);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown2 = () => {
    setIsOpen2(!isOpen2);
  };

  useEffect(() => {
    let all_encounters: Encounters[] = [];

    const fetchClientsData = async () => {
      try {
        const response = await sendPostRequest(
          `http://localhost/get_coach.php`,
          { id_coach: coachId1 }
        );
        const data = JSON.parse(response);

        for (const customer of data.coach.customers) {
          all_encounters.push(...customer.encounters);

          customer.encounters.forEach((encounter: Encounters) => {
            encounter.name = customer.name;
            encounter.client_id = customer.id;
          });
        }

        all_encounters.sort((a, b) => (a.date < b.date ? -1 : 1));

        setCoachCustomers(data.coach.customers);

        await Promise.all(
          data.coach.customers.map(async (customer: Client) => {
            try {
              const imageResponse = await sendPostRequest(
                "http://localhost/client_image.php",
                { id: customer.id }
              );
              const imageData = JSON.parse(imageResponse);
              console.log(imageData);
              customer.image = imageData.data;
            } catch (error) {
              console.error("Erreur lors de la requête : ", error);
            }
          })
        );

        all_encounters.forEach((encounter: Encounters) => {
          const customer = data.coach.customers.find(
            (cust: Client) => cust.id === encounter.client_id
          );
          encounter.image = customer?.image;
        });

        console.log(all_encounters);

        setEncounter(all_encounters);

        const avgStar =
          all_encounters.reduce((sum, encounter) => sum + encounter.rating, 0) /
          all_encounters.length;

        setAvgStar(avgStar);
      } catch (error) {
        console.error("Erreur lors de la requête : ", error);
      }
    };

    fetchClientsData();
  }, [selectedCoach]);

  if (isLoading || isCoach) {
    return <LoadingScreen />;
  }

  return (
    <div className="ml-6 sm:mr-6 mr-6 mb-5">
      <div className="md:flex justify-between">
        <div>
          <h1 className="md:text-2xl sm:text-1xl text-xl font-semibold">
            Statistiques
          </h1>
        </div>
        <div className="flex">
          <button
            id="dropdownUsersButton"
            onClick={toggleDropdown}
            className="border bg-white border-slate-300 font-medium rounded-sm text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
          >
            {selectedCoach}
            <svg
              className="w-2.5 h-2.5 ml-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>

          {isOpen && (
            <div
              id="dropdownUsers"
              className="z-10 min-w-20 max-w-44 mt-12 absolute bg-white rounded-lg shadow w-60 dark:bg-gray-700"
            >
              <ul
                className="h-80 py-2 overflow-y-auto text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownUsersButton"
              >
                {coaches.map((coach, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      onClick={() => handleCoachSelect(coach)}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      <p>{coach.name}</p>
                      <p className="ml-2">{coach.surname}</p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mx-3 mt-2">
            <ArrowLeftRight size={24} />
          </div>
          <button
            id="dropdownUsersButton2"
            onClick={toggleDropdown2}
            className="border bg-white border-slate-300 font-medium rounded-sm text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
          >
            {selectedCoach2}
            <svg
              className="w-2.5 h-2.5 ml-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>

          {isOpen2 && (
            <div
              id="dropdownUsers2"
              className="z-10 min-w-20 max-w-44 right-7 mt-12 absolute bg-white rounded-lg shadow w-60 dark:bg-gray-700"
            >
              <ul
                className="h-80 py-2 overflow-y-auto text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownUsersButton2"
              >
                {coaches.map((coach, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      onClick={() => handleCoachSelect2(coach)}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      <p>{coach.name}</p>
                      <p className="ml-2">{coach.surname}</p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div>
        <h2 className="mt-4 text-sm text-slate-700">
          Analyser les statistiques des coachs.
        </h2>
      </div>
      <div className="mt-5">
        <div className="lg:flex min-w-screen">
          <div className="lg:w-1/3 bg-white border border-slate-200 rounded-md p-5">
            {encounter.length === 0 ? (
              <div className="flex h-full justify-center items-center">
                <p className="text-xl text-slate-300">
                  Aucune données à afficher
                </p>
              </div>
            ) : (
              <div>
                <div>
                  <p>Note Global</p>
                </div>
                <div className="mt-2 flex">
                  <div className="mt-2 flex">
                    <div>
                      <p className="text-6xl">{avgStar.toPrecision(2)}</p>
                    </div>
                    <div>
                      <div className="flex items-center mt-5 ml-2">
                        {[...Array(Math.floor(avgStar))].map((_, index) => (
                          <svg
                            key={`gold-${index}`}
                            className="w-4 h-4 text-yellow-300 ms-1"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                        ))}
                        {[...Array(5 - Math.floor(avgStar))].map((_, index) => (
                          <svg
                            key={`gray-${index}`}
                            className="w-4 h-4 text-gray-300 ms-1"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex">
                  <p className="text-green-500">+ 0.5</p>
                  <p className="ml-1">points depuis le dernier mois</p>
                </div>
                <div className="mt-5">
                  <Price encounters={encounter} />
                </div>
              </div>
            )}
          </div>
          <div className="lg:w-2/3 lg:ml-4 lg:mt-0 mt-5 bg-white border border-slate-200 rounded-md p-5">
            {encounter.length === 0 ? (
              <div className="flex h-full justify-center items-center">
                <p className="text-xl text-slate-300">
                  Aucune données à afficher
                </p>
              </div>
            ) : (
              <div>
                <div className="flex justify-between mb-2">
                  <p>Rendez-vous Clients</p>
                </div>
                <div className="flex">
                  <div className="mt-1">
                    <p className="text-slate-500">Rendez-vous total</p>
                    <p className="text-5xl">{encounter.length}</p>
                  </div>
                  <div className="mt-1 ml-10">
                    <p className="text-green-500">
                      Rendez-vous ce dernier mois
                    </p>
                    <p className="text-5xl text-green-600">+ 1</p>
                  </div>
                </div>
                <div className="mt-5">
                  <Meetings encounterss={encounter} />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="lg:flex">
          <div className="mt-5 lg:w-2/3 border rounded p-7 bg-white">
            {encounter.length != 0 ? (
              <div className="mt-1">
                <p className="text-bold">Dernières Reviews</p>
              </div>
            ) : null}
            <div className="mt-8">
              {encounter.length === 0 ? (
                <div className="flex h-full justify-center items-center">
                  <p className="text-xl text-slate-300">
                    Aucune données à afficher
                  </p>
                </div>
              ) : (
                encounter.slice(0, 3).map((customers, index) => (
                  <div className="flex mb-5" key={index}>
                    <div className="w-12 h-12">
                      <Image
                        width={48}
                        height={48}
                        className="rounded-full object-cover border"
                        src={`data:image/png;base64,${customers.image}`}
                        alt="Bordered avatar"
                      />
                    </div>
                    <div>
                      <p className="font-semibold ml-6">{customers.name}</p>
                      <div className="flex items-center ml-5 mt-1">
                        {[...Array(Math.floor(customers.rating))].map(
                          (_, index) => (
                            <svg
                              key={`gold-${index}`}
                              className="w-4 h-4 text-yellow-300 ms-1"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                          )
                        )}
                        {[...Array(5 - Math.floor(customers.rating))].map(
                          (_, index) => (
                            <svg
                              key={`gray-${index}`}
                              className="w-4 h-4 text-gray-300 ms-1"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                          )
                        )}
                        <p className="ml-3 text-sm text-slate-400">
                          {customers.date}
                        </p>
                      </div>
                      <p className="ml-6 mt-2 text-sm text-slate-400">
                        {customers.source}
                      </p>
                      <p className="ml-6 mt-2 text-slate-500">
                        {customers.comment}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="mt-5 lg:ml-5 lg:w-1/3 border rounded p-7 bg-white">
            {encounter.length === 0 ? (
              <div className="flex h-full justify-center items-center">
                <p className="text-xl text-slate-300">
                  Aucune données à afficher
                </p>
              </div>
            ) : (
              <div className="h-full">
                <div className="mt-1">
                  <p className="text-bold">Sources des Rendez-vous</p>
                </div>
                <GradualChart data={encounter} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
