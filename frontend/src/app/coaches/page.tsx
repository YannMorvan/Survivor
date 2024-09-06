"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  CloudDownload,
  Plus,
  Search,
  Sliders,
  Settings,
  X,
} from "lucide-react";

import { sendPostRequest } from "../utils/utils.js";

const Page = () => {
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    surname: "",
    email: "",
    phone: "",
    nbrCustomers: 0,
  });

  interface CheckedItems {
    [key: string]: boolean;
  }

  interface Coach {
    email: string;
    id: string;
    image: string;
    name: string;
    surname: string;
    phone: string;
    nbrCustomers: number;
  }

  const [allChecked, setAllChecked] = useState(false);
  const [coachesData, setCoachesData] = useState<Coach[]>([]);

  const [checkedItems, setCheckedItems] = useState<CheckedItems>(
    coachesData.reduce((acc, coach) => {
      acc[coach.id] = false;
      return acc;
    }, {} as CheckedItems)
  );

  useEffect(() => {
    const fetchCoachesData = async () => {
      try {
        const response = await sendPostRequest(
          `http://${process.env.NEXT_PUBLIC_PHP_HOST}/employes_table.php`,
          {}
        );

        const parsedResponse = JSON.parse(response);

        if (
          parsedResponse.status === true &&
          Array.isArray(parsedResponse.data)
        ) {
          const formattedData: Coach[] = parsedResponse.data.map(
            (item: any) => ({
              id: item.id.toString(),
              name: item.name,
              email: item.email,
              image: item.image,
              surname: item.surname,
              phone: item.phone || "555",
              nbrCustomers: item.nbrCustomers || 0,
            })
          );

          setCoachesData(formattedData);
        } else {
          console.error("Unexpected response format:", parsedResponse);
        }
      } catch (error) {
        console.error("Error fetching coaches data:", error);
      }
    };

    fetchCoachesData();
  }, []);

  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [minCustomers, setMinCustomers] = useState(0);
  const [maxCustomers, setMaxCustomers] = useState(10);

  const modalAddRef = useRef<HTMLDivElement | null>(null);
  const modalEditRef = useRef<HTMLDivElement | null>(null);
  const modalDeleteRef = useRef<HTMLDivElement | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const openAddModal = () => {
    setIsModalAddOpen(true);
  };

  const closeAddModal = () => {
    setIsModalAddOpen(false);
  };

  const openEditModal = () => {
    setIsModalEditOpen(true);
  };

  const closeEditModal = () => {
    setIsModalEditOpen(false);
  };

  const openDeleteModal = () => {
    setIsModalDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalDeleteOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalAddRef.current &&
        !(modalAddRef.current as Node).contains(event.target as Node)
      ) {
        closeAddModal();
      }

      if (
        modalEditRef.current &&
        !(modalEditRef.current as Node).contains(event.target as Node)
      ) {
        closeEditModal();
      }

      if (
        modalDeleteRef.current &&
        !(modalDeleteRef.current as Node).contains(event.target as Node)
      ) {
        closeDeleteModal();
      }

      if (
        dropdownOpen !== null &&
        dropdownRefs.current[dropdownOpen] &&
        !(dropdownRefs.current[dropdownOpen] as Node).contains(
          event.target as Node
        )
      ) {
        setDropdownOpen(null);
      }

      if (
        filterOpen &&
        !(event.target as Element).closest(".filter-dropdown")
      ) {
        setFilterOpen(false);
      }
    };

    if (
      isModalAddOpen ||
      dropdownOpen !== null ||
      filterOpen ||
      isModalDeleteOpen ||
      isModalEditOpen
    ) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    isModalAddOpen,
    dropdownOpen,
    filterOpen,
    isModalDeleteOpen,
    isModalEditOpen,
  ]);

  const handleIconSearchClick = () => {
    setIsSearchActive(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchBlur = () => {
    setIsSearchActive(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    closeAddModal();
  };

  useEffect(() => {
    const initialCheckedItems = coachesData.reduce((acc, coach) => {
      acc[coach.id] = false;
      return acc;
    }, {} as CheckedItems);

    setCheckedItems(initialCheckedItems);
    setAllChecked(false);
  }, [coachesData]);

  const handleAllCheckedChange = () => {
    const newCheckedStatus = !allChecked;
    setAllChecked(newCheckedStatus);

    const updatedCheckedItems = Object.fromEntries(
      Object.keys(checkedItems).map((id) => [id, newCheckedStatus])
    );

    setCheckedItems(updatedCheckedItems);
  };

  const handleCheckboxChange = (id: string) => {
    setCheckedItems((prev) => {
      const updatedCheckedItems = { ...prev, [id]: !prev[id] };

      const areAllChecked = Object.values(updatedCheckedItems).every(Boolean);
      setAllChecked(areAllChecked);

      return updatedCheckedItems;
    });
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Number of Customers"];
    const rows = coachesData.map((coach) => [
      coach.name,
      coach.email,
      coach.phone,
      coach.nbrCustomers,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "coaches_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCoaches = coachesData.filter((coach) => {
    const [firstName, lastName] = coach.name.split(" ");
    const search = searchQuery.toLowerCase();
    const withinRange =
      coach.nbrCustomers >= minCustomers && coach.nbrCustomers <= maxCustomers;
    return (
      (firstName.toLowerCase().includes(search) ||
        lastName.toLowerCase().includes(search)) &&
      withinRange
    );
  });

  const handleDropdownToggle = (id: string) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleEdit = (id: string) => {
    setIsModalEditOpen(true);
    setDropdownOpen(null);
  };

  const handleDelete = (id: string) => {
    setIsModalDeleteOpen(true);
    setDropdownOpen(null);
  };

  const handleFilterToggle = () => {
    setFilterOpen(!filterOpen);
  };

  return (
    <div className="mx-6 flex flex-col">
      <div className="flex justify-between items-center mb-2 flex-row">
        <h1 className="text-3xl font-semibold text-[#384B65]">
          Liste des Coachs
        </h1>
        <div className="flex flex-row items-center">
          <button
            className="bg-white text-white px-4 py-2 rounded-md flex flex-row items-center gap-4 border border-gray-200 border-2"
            style={{ color: "#2263B3" }}
            onClick={exportToCSV}
          >
            <CloudDownload style={{ color: "#2263B3" }} />
            <p className="hidden sm:inline font-bold text-[#2263B3]">
              Exporter
            </p>
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md ml-4"
            style={{ color: "2263B3" }}
            onClick={openAddModal}
          >
            <Plus />
          </button>
        </div>
      </div>
      <p className="text-gray-600 mb-4">
        Vous avez {coachesData.length} coachs
      </p>

      <div className="overflow-x-auto">
        <div className="py-2 px-4 border border-gray-200 bg-white">
          <div className="my-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <select className="border border-gray-300 p-2 rounded-md bg-white">
                <option>Action Groupée</option>
              </select>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md  disabled:bg-slate-200"
                disabled
              >
                <p className="text-slate-600">Appliquer</p>
              </button>
            </div>
            <div className="flex items-center gap-4">
              {isSearchActive ? (
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onBlur={handleSearchBlur}
                  className="px-3 py-2 border rounded-lg w-full"
                  placeholder="Search..."
                  autoFocus
                />
              ) : (
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={handleIconSearchClick}
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={handleFilterToggle}
              >
                <Sliders className="w-5 h-5" />
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {filterOpen && (
            <div className="filter-dropdown absolute right-6 bg-white border border-gray-200 shadow-lg rounded-md p-4 z-10">
              <label className="block text-gray-700 mb-2">
                Nombre de Clients
              </label>
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col gap-2 mr-2">
                  <span>Min:</span>
                  <span>Max:</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={minCustomers}
                      onChange={(e) => setMinCustomers(Number(e.target.value))}
                      className="mr-2"
                    />
                    <span>{minCustomers}</span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={maxCustomers}
                      onChange={(e) => setMaxCustomers(Number(e.target.value))}
                      className="mr-2"
                    />
                    <span>{maxCustomers}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <table className="w-full border border-gray-200 shadow-sm rounded-lg bg-white">
          <thead>
            <tr>
              <th className="p-4 text-left">
                <input
                  type="checkbox"
                  className="form-checkbox size-4"
                  checked={allChecked}
                  onChange={handleAllCheckedChange}
                />
              </th>
              <th className="p-4 text-left text-[#6B83A2]">Coach</th>
              <th className="p-4 text-left text-[#6B83A2]">Email</th>
              <th className="p-4 text-left text-[#6B83A2]">Tel</th>
              <th className="p-4 text-left text-[#6B83A2]">
                Nombre de Clients
              </th>
              <th className="p-4 text-left text-[#6B83A2]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoaches.map((coach) => (
              <tr
                key={coach.id}
                className="border-t border-gray-200 hover:bg-gray-50 relative"
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    className="form-checkbox size-4"
                    checked={checkedItems[coach.id]}
                    onChange={() => handleCheckboxChange(coach.id)}
                  />
                </td>
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={`data:image/jpeg;base64,${coach.image}`}
                      alt={coach.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-l">{coach.name}</span>
                </td>
                <td className="p-4 text-[#6B83A2]">{coach.email}</td>
                <td className="p-4 text-[#6B83A2]">{coach.phone}</td>
                <td className="p-4 text-[#6B83A2]">{coach.nbrCustomers}</td>
                <td className="p-4 text-[#6B83A2] relative">
                  <button
                    className="text-[#384B65] hover:text-[#6B83A2]"
                    onClick={() => handleDropdownToggle(coach.id)}
                  >
                    •••
                  </button>
                  {dropdownOpen === coach.id && (
                    <div
                      ref={(el) => {
                        dropdownRefs.current[coach.id] = el;
                      }}
                      className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 shadow-lg rounded-md z-10"
                    >
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                        onClick={() => handleEdit(coach.id)}
                      >
                        Editer
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                        onClick={() => handleDelete(coach.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={modalEditRef}
            className="bg-white p-8 rounded-lg shadow-lg relative w-full max-w-md"
          >
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={closeEditModal}
            >
              <X />
            </button>
            <h2 className="text-2xl mb-4">Editer le Coach</h2>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-row gap-4 w-full">
                <div className="mb-4">
                  <label className="block text-gray-700">Nom</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Prénom</label>
                  <input
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Tel</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Nombre de Clients</label>
                <input
                  type="number"
                  name="nbrCustomers"
                  value={formData.nbrCustomers}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isModalDeleteOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={modalDeleteRef}
            className="bg-white p-8 rounded-lg shadow-lg relative w-full max-w-md"
          >
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={closeDeleteModal}
            >
              <X />
            </button>
            <h2 className="text-2xl mb-4">Supprimer le Coach</h2>
            <p>Etes vous sur de vouloir supprimer le Coach?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={closeDeleteModal}
              >
                Supprimer
              </button>
              <button
                className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md"
                onClick={closeDeleteModal}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalAddOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={modalAddRef}
            className="bg-white p-8 rounded-lg shadow-lg relative w-full max-w-md"
          >
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={closeAddModal}
            >
              <X />
            </button>
            <h2 className="text-2xl mb-4">Ajouter un Coach</h2>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-row gap-4 w-full">
                <div className="mb-4">
                  <label className="block text-gray-700">Nom</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Prénom</label>
                  <input
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Tel</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Nombre de Clients</label>
                <input
                  type="number"
                  name="nbrCustomers"
                  value={formData.nbrCustomers}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
