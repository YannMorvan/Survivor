"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const ClientTable = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Last 30 days");
  const [searchTerm, setSearchTerm] = useState("");
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const router = useRouter();

  const clients = [
    { id: 12, name: "John Doe", sign: "Aries", address: "123 Main St", age: 28, gender: "Male" },
    { id: 34, name: "Jane Smith", sign: "Taurus", address: "456 Elm St", age: 34, gender: "Female" },
    { id: 56, name: "Bob Johnson", sign: "Gemini", address: "789 Oak St", age: 42, gender: "Male" },
    { id: 78, name: "Alice Williams", sign: "Cancer", address: "101 Maple St", age: 25, gender: "Female" },
    { id: 90, name: "Charlie Brown", sign: "Leo", address: "202 Pine St", age: 38, gender: "Male" },
    { id: 21, name: "Diana Prince", sign: "Virgo", address: "303 Cedar St", age: 30, gender: "Female" },
  ];

  const filters = ["Last day", "Last 7 days", "Last 30 days", "Last month", "Last year"];

  const handleDropdownToggle = () => setDropdownOpen(!isDropdownOpen);

  const handleFilterChange: (filter: string) => void = (filter: string) => {
    setSelectedFilter(filter);
    setDropdownOpen(false);
  };

  const handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };  

  const handleCheckboxChange: (index: number) => void = (index: number) => {
    if (checkedItems.includes(index)) {
      setCheckedItems((prev) => prev.filter((item) => item !== index));
    } else {
      if (checkedItems.length < 2) {
        setCheckedItems((prev) => [...prev, index]);
      } else {
        alert("Vous ne pouvez sélectionner que 2 utilisateurs.");
      }
    }
  };  

  const handleCheckAll: () => void = () => {
    if (checkedItems.length === clients.length) {
      setCheckedItems([]);
    } else {
      setCheckedItems(clients.map((_, index) => index).slice(0, 2));
    }
  };

  const handleTryComptability: () => void = () => {
    if (checkedItems.length === 2) {
      const [firstClient, secondClient] = checkedItems.map((index) => clients[index].id);
      router.push(`/astro/${firstClient}&${secondClient}`);
    } else {
      alert("Veuillez sélectionner exactement 2 utilisateurs.");
    }
  };

  return (
    <div className="relative overflow-x-auto sm:rounded-lg">
      <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
        <div>
          <button
            id="dropdownRadioButton"
            onClick={handleDropdownToggle}
            className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            type="button"
          >
            <svg className="w-3 h-3 text-gray-500 dark:text-gray-400 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
            </svg>
            {selectedFilter}
            <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="z-10 absolute w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
              <ul className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200">
                {filters.map((filter) => (
                  <li key={filter}>
                    <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                      <input
                        type="radio"
                        checked={selectedFilter === filter}
                        onChange={() => handleFilterChange(filter)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">{filter}</label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <label htmlFor="table-search" className="sr-only">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            id="table-search"
            value={searchTerm}
            onChange={handleSearchChange}
            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search for clients"
          />
        </div>
      </div>
      <table className="w-full border rounded-xl text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="p-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={checkedItems.length === clients.length}
                  onChange={handleCheckAll}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Address</th>
            <th className="px-6 py-3">Sign</th>
            <th className="px-6 py-3">Age</th>
            <th className="px-6 py-3">Gender</th>
          </tr>
        </thead>
        <tbody>
          {clients
            .filter((client) => client.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((client, index) => (
              <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={checkedItems.includes(index)}
                      onChange={() => handleCheckboxChange(index)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </td>
                <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{client.name}</th>
                <td className="px-6 py-4">{client.address}</td>
                <td className="px-6 py-4">{client.sign}</td>
                <td className="px-6 py-4">{client.age}</td>
                <td className="px-6 py-4">{client.gender}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">Showing <span className="font-semibold text-gray-900 dark:text-white">1-10</span> of <span className="font-semibold text-gray-900 dark:text-white">1000</span></span>
            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                <li>
                    <a href="#" className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
                </li>
                <li>
                    <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
                </li>
                <li>
                    <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
                </li>
                <li>
                    <a href="#" aria-current="page" className="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
                </li>
                <li>
                    <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">4</a>
                </li>
                <li>
                    <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">5</a>
                </li>
                <li>
            <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
                </li>
            </ul>
        </nav>
      <div className="py-4">
        <div className='flex lg:justify-end mt-2 mb-2'>
            <div onClick={handleTryComptability} className='p-1.5 border border-slate-300 rounded bg-white cursor-pointer hover:bg-slate-100'>
              <p className='text-slate-500 hover:text-slate-700 text-sm'>Try Comptability</p>
            </div>
          </div>
      </div>
    </div>
  );
};

export default ClientTable;