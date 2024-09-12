"use client";

import React, { use, useEffect, useState } from "react";
import { sendPostRequest } from "../utils/utils.js";
import {
  ArrowLeft,
  ArrowRight,
  CloudDownload,
  Shirt,
  Trash2Icon,
} from "lucide-react";

import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import LoadingScreen from "../components/loading";
import { useRouter } from "next/navigation";

import Select, { SingleValue } from "react-select";

interface ClothingItem {
  id: number;
  imageURL: string;
}

export default function Clothes() {
  const [activeTabs, setActiveTabs] = useState<string[]>([]);
  const [hats, setHats] = useState<ClothingItem[]>([]);
  const [tops, setTops] = useState<ClothingItem[]>([]);
  const [bottoms, setBottoms] = useState<ClothingItem[]>([]);
  const [shoes, setShoes] = useState<ClothingItem[]>([]);

  const [currentHatIndex, setCurrentHatIndex] = useState(0);
  const [currentTopIndex, setCurrentTopIndex] = useState(0);
  const [currentBottomIndex, setCurrentBottomIndex] = useState(0);
  const [currentShoeIndex, setCurrentShoeIndex] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageURL, setModalImageURL] = useState<string | null>(null);

  const [clothesTypes, setClothesTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCoach, setIsCoach] = useState(true);
  const router = useRouter();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await sendPostRequest(
          "http://localhost/check_session.php",
          {}
        );

        const data = JSON.parse(response);

        if (data.status === true) {
          setIsCoach(data.isCoach);
          setIsFetching(true);
          setIsLoading(false);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error during the request: ", error);
      }
    };

    fetchData();
  }, [router]);

  useEffect(() => {
    const fetchClothesTypes = async () => {
      const response = await sendPostRequest(
        `http://localhost/clothes_types.php`,
        {}
      );

      const parsedResponse: string[] = JSON.parse(response);

      setClothesTypes(parsedResponse);
    };

    fetchClothesTypes();
  }, []);

  interface ResponseItem {
    image: string;
  }

  const fetchClothes = async (type: string) => {
    if (!selectedCustomer) {
      try {
        const response = await sendPostRequest(
          `http://localhost/clothes_data.php`,
          { type }
        );

        const parsedResponse: { data: ResponseItem[] } = JSON.parse(response);

        const mappedResponse: ClothingItem[] = parsedResponse.data.map(
          (item: ResponseItem, index: number) => ({
            id: index,
            imageURL: item.image,
          })
        );

        switch (type) {
          case "hat/cap":
            setHats(mappedResponse);
            break;
          case "top":
            setTops(mappedResponse);
            break;
          case "bottom":
            setBottoms(mappedResponse);
            break;
          case "shoes":
            setShoes(mappedResponse);
            break;
          default:
            console.error("Unknown type:", type);
        }
      } catch (error) {
        console.error("Error fetching clothes:", error);
      }
    } else {
      try {
        const response = await sendPostRequest(
          `http://localhost/get_clothes_by_user_id.php`,
          { type, id: selectedCustomer }
        );

        const parsedResponse: { data: { [key: string]: string[] } } =
          JSON.parse(response);

        const mappedResponse: ClothingItem[] =
          parsedResponse.data[type]?.map((item: string, index: number) => ({
            id: index,
            imageURL: item,
          })) || [];

        switch (type) {
          case "hat/cap":
            setHats(mappedResponse);
            break;
          case "top":
            setTops(mappedResponse);
            break;
          case "bottom":
            setBottoms(mappedResponse);
            break;
          case "shoes":
            setShoes(mappedResponse);
            break;
          default:
            console.error("Unknown type:", type);
        }
      } catch (error) {
        console.error("Error fetching clothes:", error);
      }
    }
  };

  const fetchAllClothes = async () => {
    await Promise.all([
      fetchClothes("hat/cap"),
      fetchClothes("top"),
      fetchClothes("bottom"),
      fetchClothes("shoes"),
    ]);
  };

  useEffect(() => {
    const fetchClothesTypes = async () => {
      const response = await sendPostRequest(
        `http://localhost/clothes_types.php`,
        {}
      );

      const parsedResponse: string[] = JSON.parse(response);

      setClothesTypes(parsedResponse);

      if (isScreenLessThanLg()) {
        await fetchAllClothes();
      }
    };

    fetchClothesTypes();
  }, []);

  const handleTabClick = (tab: string) => {
    setActiveTabs((prevActiveTabs) =>
      prevActiveTabs.includes(tab)
        ? prevActiveTabs.filter((item) => item !== tab)
        : [...prevActiveTabs, tab]
    );
  };

  const exportOutfit = async () => {
    try {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) {
        console.error("Failed to get canvas context.");
        return;
      }
      const canvasWidth = 300;
      const canvasHeight = 600;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const images = [
        hats[currentHatIndex]?.imageURL,
        tops[currentTopIndex]?.imageURL,
        bottoms[currentBottomIndex]?.imageURL,
        shoes[currentShoeIndex]?.imageURL,
      ];
      const loadImage = (src: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.src = `data:image/jpeg;base64,${src}`;
          img.onload = () => resolve(img);
          img.onerror = (err) => reject(err);
        });
      let yOffset = 0;
      for (const src of images) {
        if (src) {
          const img = await loadImage(src);
          context.drawImage(img, 0, yOffset, canvasWidth, canvasHeight / 4);
          yOffset += canvasHeight / 4;
        }
      }
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, "Outfit.png");
        } else {
          console.error("Failed to export outfit.");
        }
      }, "image/png");
    } catch (error) {
      console.error("Error exporting outfit:", error);
    }
  };

  const openModal = (imageURL: string) => {
    setModalImageURL(imageURL);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalImageURL(null);
    setIsModalOpen(false);
  };

  const isScreenLessThanLg = () =>
    window.matchMedia("(max-width: 1024px)").matches;

  interface CustomersNames {
    id: string;
    name: string;
    surname: string;
  }

  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const handleCustomerChange = (selectedOption: SingleValue<any>) => {
    setTops([]);
    setBottoms([]);
    setHats([]);
    setShoes([]);
    if (activeTabs.length > 0) {
      setActiveTabs([]);
    }
    setSelectedCustomer(selectedOption.value);
  };

  const [customersNames, setCustomersNames] = useState<CustomersNames[]>([]);

  const options = customersNames.map((customer) => ({
    value: customer.id,
    label: `${customer.name} ${customer.surname}`,
  }));

  const fetchCustomersData = async () => {
    if (!isCoach) {
      try {
        const response = await sendPostRequest(
          `http://localhost/get_client_infos.php`,
          {}
        );

        const parsedResponse = JSON.parse(response);

        if (
          parsedResponse.status === true &&
          Array.isArray(parsedResponse.data)
        ) {
          const formattedData: CustomersNames[] = parsedResponse.data.map(
            (item: any) => ({
              id: item.id.toString(),
              name: item.name,
              surname: item.surname,
            })
          );

          setCustomersNames(formattedData);
        } else {
          console.error("Unexpected response format:", parsedResponse);
        }
      } catch (error) {
        console.error("Error fetching coaches data:", error);
      }
    } else {
      try {
        const response = await sendPostRequest(
          `http://localhost/get_coach_clients.php`,
          {}
        );

        const parsedResponse = JSON.parse(response);

        if (
          parsedResponse.status === true &&
          Array.isArray(parsedResponse.clients)
        ) {
          const formattedData: CustomersNames[] = parsedResponse.clients.map(
            (item: any) => ({
              id: item.id.toString(),
              name: item.name,
              surname: item.surname,
            })
          );

          setCustomersNames(formattedData);
        } else {
          console.error("Unexpected response format:", parsedResponse);
        }
      } catch (error) {
        console.error("Error fetching coaches data:", error);
      }
    }
  };

  useEffect(() => {
    fetchCustomersData();
  }, [isFetching]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="mx-6 flex flex-col">
      <div className="flex justify-between items-center mb-6 flex-row">
        <h1 className="text-3xl font-semibold text-[#384B65]">
          Gestion des Vêtements
        </h1>
        <div className="mb-4 w-[200px]">
          <Select
            id="customer"
            value={
              options.find((option) => option.value === selectedCustomer) ||
              null
            }
            onChange={(selectedOption) => handleCustomerChange(selectedOption)}
            options={options}
            className="w-full"
            classNamePrefix="react-select"
            placeholder="Client"
            isSearchable
            required
          />
        </div>
      </div>
      <div className="flex flex-row lg:justify-between justify-center">
        {/*Left Part*/}
        <div className="hidden lg:flex flex-col border-2 bg-white border-[#E1E8F1] rounded-md w-1/2 items-center h-full">
          <div className="flex flex-col w-full border-b border-[#E1E8F1]">
            <button
              onClick={() => {
                handleTabClick("Couvre-Chefs");
                fetchClothes("hat/cap");
              }}
              className={`px-4 py-2 text-lg font-medium ${
                activeTabs.includes("Couvre-Chefs")
                  ? "text-[#384B65]"
                  : "text-gray-500"
              } flex justify-center border-b border-[#E1E8F1]`}
            >
              Couvre-Chefs
            </button>
            {activeTabs.includes("Couvre-Chefs") && (
              <div className="my-2 grid grid-cols-3 gap-4 max-h-[250px] overflow-y-auto mx-4">
                {hats.length > 0 &&
                  hats.map((hat: ClothingItem, index: number) => (
                    <img
                      key={index}
                      src={`data:image/jpeg;base64,${hat.imageURL}`}
                      alt={`Hat ${index + 1}`}
                      className={`w-full h-[250px] ${
                        index === currentHatIndex ? "scale-95" : ""
                      }`}
                      onClick={() => setCurrentHatIndex(index)}
                    />
                  ))}
              </div>
            )}
          </div>

          <div className="flex flex-col w-full border-b border-[#E1E8F1]">
            <button
              onClick={() => {
                handleTabClick("Hauts");
                fetchClothes("top");
              }}
              className={`px-4 py-2 text-lg font-medium ${
                activeTabs.includes("Hauts")
                  ? "text-[#384B65]"
                  : "text-gray-500"
              } flex justify-center border-b border-[#E1E8F1]`}
            >
              Hauts
            </button>
            {activeTabs.includes("Hauts") && (
              <div className="my-2 grid grid-cols-3 gap-4 max-h-[250px] overflow-y-auto mx-4">
                {tops.length > 0 &&
                  tops.map((top: ClothingItem, index: number) => (
                    <img
                      key={index}
                      src={`data:image/jpeg;base64,${top.imageURL}`}
                      alt={`Top ${index + 1}`}
                      className={`w-full h-[250px] ${
                        index === currentTopIndex ? "scale-95" : ""
                      }`}
                      onClick={() => setCurrentTopIndex(index)}
                    />
                  ))}
              </div>
            )}
          </div>

          <div className="flex flex-col w-full border-b border-[#E1E8F1]">
            <button
              onClick={() => {
                handleTabClick("Bas");
                fetchClothes("bottom");
              }}
              className={`px-4 py-2 text-lg font-medium ${
                activeTabs.includes("Bas") ? "text-[#384B65]" : "text-gray-500"
              } flex justify-center border-b border-[#E1E8F1]`}
            >
              Bas
            </button>
            {activeTabs.includes("Bas") && (
              <div className="my-2 grid grid-cols-3 gap-4 max-h-[250px] overflow-y-auto mx-4">
                {bottoms.length > 0 &&
                  bottoms.map((bottom: ClothingItem, index: number) => (
                    <img
                      key={index}
                      src={`data:image/jpeg;base64,${bottom.imageURL}`}
                      alt={`Shoe ${index + 1}`}
                      className={`w-full h-[250px] ${
                        index === currentBottomIndex ? "scale-95" : ""
                      }`}
                      onClick={() => setCurrentBottomIndex(index)}
                    />
                  ))}
              </div>
            )}
          </div>

          <div className="flex flex-col w-full">
            <button
              onClick={() => {
                handleTabClick("Chaussures");
                fetchClothes("shoes");
              }}
              className={`px-4 py-2 text-lg font-medium ${
                activeTabs.includes("Chaussures")
                  ? "text-[#384B65]"
                  : "text-gray-500"
              } flex justify-center border-b border-[#E1E8F1]`}
            >
              Chaussures
            </button>
            {activeTabs.includes("Chaussures") && (
              <div className="my-2 grid grid-cols-3 gap-4 max-h-[250px] overflow-y-auto mx-4">
                {shoes.length > 0 &&
                  shoes.map((shoe: ClothingItem, index: number) => (
                    <img
                      key={index}
                      src={`data:image/jpeg;base64,${shoe.imageURL}`}
                      alt={`Shoe ${index + 1}`}
                      className={`w-full h-[250px] ${
                        index === currentShoeIndex ? "scale-95" : ""
                      }`}
                      onClick={() => setCurrentShoeIndex(index)}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>

        {/*Right Part*/}
        <div className="flex flex-col w-full lg:w-1/2 gap-6 items-center justify-top mb-6">
          <div className="flex flex-row w-full lg:w-1/2 gap-6 justify-center">
            <div className="flex flex-col items-center justify-around gap-6">
              <ArrowLeft
                size={24}
                onClick={() =>
                  currentHatIndex >= 0
                    ? setCurrentHatIndex((prev) => prev - 1)
                    : setCurrentHatIndex(hats.length - 1)
                }
              />
              <ArrowLeft
                size={24}
                onClick={() =>
                  currentTopIndex >= 0
                    ? setCurrentTopIndex((prev) => prev - 1)
                    : setCurrentTopIndex(tops.length - 1)
                }
              />
              <ArrowLeft
                size={24}
                onClick={() =>
                  currentBottomIndex >= 0
                    ? setCurrentBottomIndex((prev) => prev - 1)
                    : setCurrentBottomIndex(bottoms.length - 1)
                }
              />
              <ArrowLeft
                size={24}
                onClick={() =>
                  currentShoeIndex >= 0
                    ? setCurrentShoeIndex((prev) => prev - 1)
                    : setCurrentShoeIndex(shoes.length - 1)
                }
              />
            </div>
            <div className="flex flex-col items-center gap-6 justify-around">
              {hats.length > 0 && currentHatIndex !== -1 ? (
                <div className="border border-4 w-[170px] h-[170px] flex items-center justify-center bg-white">
                  <img
                    src={`data:image/jpeg;base64,${hats[currentHatIndex]?.imageURL}`}
                    alt="Hat"
                    className="w-[150px] h-[150px]"
                    onClick={() => openModal(hats[currentHatIndex]?.imageURL)}
                  />
                </div>
              ) : (
                <div className="flex w-[170px] h-[170px] bg-white items-center justify-center border border-4">
                  <img
                    src="/images/hat.svg"
                    alt="Hat"
                    className="w-[80px] h-[80px]"
                  />
                </div>
              )}
              {tops.length > 0 && currentTopIndex !== -1 ? (
                <div className="border border-4 w-[170px] h-[170px] flex items-center justify-center bg-white">
                  <img
                    src={`data:image/jpeg;base64,${tops[currentTopIndex]?.imageURL}`}
                    alt="Top"
                    className="w-[150px] h-[150px]"
                    onClick={() => openModal(tops[currentTopIndex]?.imageURL)}
                  />
                </div>
              ) : (
                <div className="flex w-[170px] h-[170px] bg-white items-center justify-center border border-4">
                  <img
                    src="/images/shirt.svg"
                    alt="Top"
                    className="w-[100px] h-[100px]"
                  />
                </div>
              )}
              {bottoms.length > 0 && currentBottomIndex !== -1 ? (
                <div className="border border-4 w-[170px] h-[170px] flex items-center justify-center bg-white">
                  <img
                    src={`data:image/jpeg;base64,${bottoms[currentBottomIndex]?.imageURL}`}
                    alt="Bottom"
                    className="w-[150px] h-[150px]"
                    onClick={() =>
                      openModal(bottoms[currentBottomIndex]?.imageURL)
                    }
                  />
                </div>
              ) : (
                <div className="flex w-[170px] h-[170px] bg-white items-center justify-center border border-4">
                  <img
                    src="/images/trouser.svg"
                    alt="Bottom"
                    className="w-[100px] h-[100px]"
                  />
                </div>
              )}
              {shoes.length > 0 && currentShoeIndex !== -1 ? (
                <div className="border border-4 w-[170px] h-[170px] flex items-center justify-center bg-white">
                  <img
                    src={`data:image/jpeg;base64,${shoes[currentShoeIndex]?.imageURL}`}
                    alt="Shoes"
                    className="w-[150px] h-[150px]"
                    onClick={() => openModal(shoes[currentShoeIndex]?.imageURL)}
                  />
                </div>
              ) : (
                <div className="flex w-[170px] h-[170px] bg-white items-center justify-center border border-4">
                  <img
                    src="/images/boots.svg"
                    alt="Shoes"
                    className="w-[80px] h-[80px]"
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col items-center gap-6 justify-around">
              <ArrowRight
                size={24}
                onClick={() =>
                  currentHatIndex <= hats.length - 1
                    ? setCurrentHatIndex((prev) => prev + 1)
                    : setCurrentHatIndex(0)
                }
              />
              <ArrowRight
                size={24}
                onClick={() =>
                  currentTopIndex <= tops.length - 1
                    ? setCurrentTopIndex((prev) => prev + 1)
                    : setCurrentTopIndex(0)
                }
              />
              <ArrowRight
                size={24}
                onClick={() =>
                  currentBottomIndex <= bottoms.length - 1
                    ? setCurrentBottomIndex((prev) => prev + 1)
                    : setCurrentBottomIndex(0)
                }
              />
              <ArrowRight
                size={24}
                onClick={() =>
                  currentShoeIndex <= shoes.length - 1
                    ? setCurrentShoeIndex((prev) => prev + 1)
                    : setCurrentShoeIndex(0)
                }
              />
            </div>
          </div>
          <div className="flex flex-row gap-6 justify-center">
            <button
              className={`px-4 py-2 rounded-md flex flex-row items-center gap-4 border border-2 ${
                hats.length === 0 &&
                tops.length === 0 &&
                bottoms.length === 0 &&
                shoes.length === 0
                  ? "bg-gray-500 text-white border-gray-500 cursor-not-allowed"
                  : "bg-white text-[#2263B3] border-gray-200"
              }`}
              style={{
                color:
                  hats.length === 0 &&
                  tops.length === 0 &&
                  bottoms.length === 0 &&
                  shoes.length === 0
                    ? "white"
                    : "#2263B3",
              }}
              onClick={() => {
                const indexValue = isScreenLessThanLg() ? 0 : -1;
                setCurrentHatIndex(indexValue);
                setCurrentTopIndex(indexValue);
                setCurrentBottomIndex(indexValue);
                setCurrentShoeIndex(indexValue);
              }}
              disabled={
                hats.length === 0 &&
                tops.length === 0 &&
                bottoms.length === 0 &&
                shoes.length === 0
              }
            >
              <Trash2Icon
                style={{
                  color:
                    hats.length === 0 &&
                    tops.length === 0 &&
                    bottoms.length === 0 &&
                    shoes.length === 0
                      ? "white"
                      : "#2263B3",
                }}
              />
              <p
                className={`hidden sm:inline font-bold ${
                  hats.length === 0 &&
                  tops.length === 0 &&
                  bottoms.length === 0 &&
                  shoes.length === 0
                    ? "text-white"
                    : "text-[#2263B3]"
                }`}
              >
                Vider
              </p>
            </button>
            <button
              className={`px-4 py-2 rounded-md flex flex-row items-center gap-4 border border-2 ${
                hats.length === 0 &&
                tops.length === 0 &&
                bottoms.length === 0 &&
                shoes.length === 0
                  ? "bg-gray-500 text-white border-gray-500 cursor-not-allowed"
                  : "bg-white text-[#2263B3] border-gray-200"
              }`}
              style={{
                color:
                  hats.length === 0 &&
                  tops.length === 0 &&
                  bottoms.length === 0 &&
                  shoes.length === 0
                    ? "white"
                    : "#2263B3",
              }}
              onClick={exportOutfit}
              disabled={
                hats.length === 0 &&
                tops.length === 0 &&
                bottoms.length === 0 &&
                shoes.length === 0
              }
            >
              <CloudDownload
                style={{
                  color:
                    hats.length === 0 &&
                    tops.length === 0 &&
                    bottoms.length === 0 &&
                    shoes.length === 0
                      ? "white"
                      : "#2263B3",
                }}
              />
              <p
                className={`hidden sm:inline font-bold ${
                  hats.length === 0 &&
                  tops.length === 0 &&
                  bottoms.length === 0 &&
                  shoes.length === 0
                    ? "text-white"
                    : "text-[#2263B3]"
                }`}
              >
                Exporter
              </p>
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative">
            <img
              src={`data:image/jpeg;base64,${modalImageURL}`}
              alt="Zoomed"
              className="max-w-full max-h-screen"
              onClick={closeModal}
            />
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white text-xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
