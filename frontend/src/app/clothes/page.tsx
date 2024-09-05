"use client";
import React, { useState } from "react";

const Page = () => {
  const [activeTabs, setActiveTabs] = useState<string[]>([]);

  const handleTabClick = (tab: string) => {
    setActiveTabs((prevActiveTabs) =>
      prevActiveTabs.includes(tab)
        ? prevActiveTabs.filter((item) => item !== tab)
        : [...prevActiveTabs, tab]
    );
  };

  return (
    <div className="mx-6 flex flex-col">
      <div className="flex justify-between items-center mb-6 flex-row">
        <h1 className="text-3xl font-semibold text-[#384B65]">
          Customers List
        </h1>
      </div>
      <div>
        <div className="flex flex-col border-2 bg-white border-[#E1E8F1] rounded-md w-1/2 items-center">
          <div className="flex flex-col w-full border-b border-[#E1E8F1]">
            <button
              onClick={() => handleTabClick("Couvre-Chefs")}
              className={`px-4 py-2 text-lg font-medium ${
                activeTabs.includes("Couvre-Chefs")
                  ? "text-[#384B65]"
                  : "text-gray-500"
              } flex justify-center border-b border-[#E1E8F1]`}
            >
              Couvre-Chefs
            </button>
            {activeTabs.includes("Couvre-Chefs") && (
              <div className="mt-2 grid grid-cols-3 gap-4 max-h-[250px] overflow-y-auto">
                {Array(12)
                  .fill("")
                  .map((_, index) => (
                    <img
                      key={index}
                      src="/path/to/hat.jpg"
                      alt="Hat"
                      className="w-full h-[250px]"
                    />
                  ))}
              </div>
            )}
          </div>

          <div className="flex flex-col w-full border-b border-[#E1E8F1]">
            <button
              onClick={() => handleTabClick("Hauts")}
              className={`px-4 py-2 text-lg font-medium ${
                activeTabs.includes("Hauts")
                  ? "text-[#384B65]"
                  : "text-gray-500"
              } flex justify-center border-b border-[#E1E8F1]`}
            >
              Hauts
            </button>
            {activeTabs.includes("Hauts") && (
              <div className="mt-2 grid grid-cols-3 gap-4 max-h-[250px] overflow-y-auto">
                {Array(12)
                  .fill("")
                  .map((_, index) => (
                    <img
                      key={index}
                      src="/path/to/top.jpg"
                      alt="Top"
                      className="w-full h-[250px]"
                    />
                  ))}
              </div>
            )}
          </div>

          <div className="flex flex-col w-full border-b border-[#E1E8F1]">
            <button
              onClick={() => handleTabClick("Bas")}
              className={`px-4 py-2 text-lg font-medium ${
                activeTabs.includes("Bas") ? "text-[#384B65]" : "text-gray-500"
              } flex justify-center border-b border-[#E1E8F1]`}
            >
              Bas
            </button>
            {activeTabs.includes("Bas") && (
              <div className="mt-2 grid grid-cols-3 gap-4 max-h-[250px] overflow-y-auto">
                {Array(12)
                  .fill("")
                  .map((_, index) => (
                    <img
                      key={index}
                      src="/path/to/shorts.jpg"
                      alt="Shorts"
                      className="w-full h-[250px]"
                    />
                  ))}
              </div>
            )}
          </div>

          <div className="flex flex-col w-full">
            <button
              onClick={() => handleTabClick("Chaussures")}
              className={`px-4 py-2 text-lg font-medium ${
                activeTabs.includes("Chaussures")
                  ? "text-[#384B65]"
                  : "text-gray-500"
              } flex justify-center border-b border-[#E1E8F1]`}
            >
              Chaussures
            </button>
            {activeTabs.includes("Chaussures") && (
              <div className="mt-2 grid grid-cols-3 gap-4 max-h-[250px] overflow-y-auto">
                {Array(12)
                  .fill("")
                  .map((_, index) => (
                    <img
                      key={index}
                      src="/path/to/shoes.jpg"
                      alt="Shoes"
                      className="w-full h-[250px]"
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
