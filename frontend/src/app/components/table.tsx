"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import Image from "next/image";

interface Client {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone_number: string;
  image: string;
}

interface ClientTableProps {
  data: {
    data: Client[];
  };
}


const ClientTable: React.FC<ClientTableProps>  = ({ data }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Last 30 days");
  const [searchTerm, setSearchTerm] = useState("");
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const router = useRouter();

  const clients = data.data || [];
  const totalPages = Math.ceil(clients.length / itemsPerPage);

  const filters = ["Last day", "Last 7 days", "Last 30 days", "Last month", "Last year"];

  const handleDropdownToggle = () => setDropdownOpen(!isDropdownOpen);

  const handleFilterChange: (filter: string) => void = (filter: string) => {
    setSelectedFilter(filter);
    setDropdownOpen(false);
  };

  const handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCheckboxChange: (clientId: number) => void = (clientId: number) => {
    setCheckedItems((prev) => {
      const newCheckedItems = new Set(prev);
      if (newCheckedItems.has(clientId)) {
        newCheckedItems.delete(clientId);
      } else {
        if (newCheckedItems.size < 2) {
          newCheckedItems.add(clientId);
        } else {
          alert("Vous ne pouvez sélectionner que 2 utilisateurs.");
        }
      }
      return newCheckedItems;
    });
  };

  const handleCheckAll: () => void = () => {
    if (checkedItems.size === clients.length) {
      setCheckedItems(new Set());
    } else {
      const newCheckedItems = new Set(clients.slice(0, 2).map((client) => client.id));
      setCheckedItems(newCheckedItems);
    }
  };

  const handleTryComptability: () => void = () => {
    if (checkedItems.size === 2) {
      const [firstClient, secondClient] = Array.from(checkedItems);
      router.push(`/astro/${firstClient}/${secondClient}`);
    } else {
      alert("Veuillez sélectionner exactement 2 utilisateurs.");
    }
  };

  const filteredClients = clients.filter((client) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return client.name.toLowerCase().includes(lowerCaseSearchTerm);
  });

  const paginatedClients = filteredClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
        <label htmlFor="table-search" className="sr-only">Search</label>
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
                  checked={checkedItems.size === filteredClients.length}
                  onChange={handleCheckAll}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Surname</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Phone number</th>
          </tr>
        </thead>
        <tbody>
          {paginatedClients.map((client) => (
            <tr key={client.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={checkedItems.has(client.id)}
                    onChange={() => handleCheckboxChange(client.id)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </td>
              <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                <Image width={10} height={10} className="w-10 h-10 rounded-full" src={`data:image/png;base64,${client.image}`} alt="Client" />
                <div className="ps-3">
                  <div className="text-base font-semibold">{client.name}</div>
                </div>
              </th>
              <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{client.surname}</th>
              <td className="px-6 py-4">{client.email}</td>
              <td className="px-6 py-4">{client.phone_number}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
          Showing <span className="font-semibold text-gray-900 dark:text-white">{((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredClients.length)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{filteredClients.length}</span>
        </span>
        <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
          <li>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Previous
            </button>
          </li>
          {[...Array(totalPages)].map((_, index) => (
            <li key={index}>
              <button
                onClick={() => setCurrentPage(index + 1)}
                className={`flex items-center justify-center px-3 h-8 leading-tight ${currentPage === index + 1 ? "text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white" : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"}`}
              >
                {index + 1}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
      <div className="py-4">
        <div className='flex lg:justify-end mt-2 mb-2'>
          <div onClick={handleTryComptability} className='p-1.5 border border-slate-300 rounded bg-white cursor-pointer hover:bg-slate-100'>
            <div className="flex">
              <Heart size={16} className="mt-1" />
              <span className="ms-2">Tester la compatibilité</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientTable;
