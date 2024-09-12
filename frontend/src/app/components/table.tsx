import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import Image from "next/image";
import { sendPostRequest } from "../utils/utils";

interface Client {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone_number: string;
  image?: string; // Rendre image optionnelle pour l'instant
}

interface ClientTableProps {
  data: {
    data: Client[];
  };
}

const ClientTable: React.FC<ClientTableProps> = ({ data }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Last 30 days");
  const [searchTerm, setSearchTerm] = useState("");
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [clients, setClients] = useState<Client[]>([]);
  const itemsPerPage = 10;

  const router = useRouter();

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

  useEffect(() => {
    const fetchCoachImages = async () => {
      try {
        const imagePromises = data.data.map(async (client) => {
          const response = await sendPostRequest(`http://localhost/client_image.php`, { id: client.id });
          const data = JSON.parse(response);
          return { id: client.id, image: data.data };
        });

        const allImages = await Promise.all(imagePromises);

        const updatedClients = data.data.map(client => {
          const image = allImages.find(img => img.id === client.id)?.image;
          return { ...client, image };
        });

        console.log(updatedClients);

        setClients(updatedClients);
      } catch (error) {
        console.error("Erreur lors de la requête : ", error);
      }
    };

    if (data?.data) {
      fetchCoachImages();
    }
  }, [data]);

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
            placeholder="Chercher des clients"
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
            <th className="px-6 py-3">Prenom</th>
            <th className="px-6 py-3">Nom de famille</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Téléphone</th>
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
                {client.image ? (
                  <Image width={40} height={40} className="w-10 h-10 rounded-full" src={`data:image/png;base64,${client.image}`} alt="Client" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300"></div> // Placeholder image if no image
                )}
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
              Précédent
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
              Suivant
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
