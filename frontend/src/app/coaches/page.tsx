"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  CloudDownload,
  Plus,
  Search,
  Sliders,
  Settings,
  X,
  EyeOff,
  Eye,
} from "lucide-react";

import { sendPostRequest } from "../utils/utils.js";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select, { SingleValue } from "react-select";

import { format, formatDuration, set } from "date-fns";

interface FormData {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  birth_date: string | null;
  gender: string;
  work: string;
  password: string;
}

const Page = () => {
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    id: "",
    name: "",
    surname: "",
    email: "",
    phone: "",
    birth_date: "",
    gender: "",
    work: "",
    password: "",
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
    phone_number: string;
    amount_customer: number;
  }

  const [allChecked, setAllChecked] = useState(false);
  const [coachesData, setCoachesData] = useState<Coach[]>([]);

  const [checkedItems, setCheckedItems] = useState<CheckedItems>(() => {
    const initialCheckedItems = coachesData.reduce((acc, coach) => {
      acc[coach.id] = false;
      return acc;
    }, {} as CheckedItems);
    return initialCheckedItems;
  });

  useEffect(() => {
    if (coachesData.length > 0) {
      setCheckedItems(
        coachesData.reduce((acc, coach) => {
          acc[coach.id] = false;
          return acc;
        }, {} as CheckedItems)
      );
    }
  }, [coachesData]);

  useEffect(() => {
    const fetchCoachesData = async () => {
      try {
        const response = await sendPostRequest(
          `http://localhost/employes_table.php`,
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
              phone_number: item.phone_number,
              amount_customer: item.amount_customer,
            })
          );

          console.log("formattedData", formattedData);

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
  const [filterNbrClients, setFilterNbrClients] = useState(false);
  const [paginationOption, setPaginationOption] = useState(false);
  const [minCustomers, setMinCustomers] = useState(0);
  const [maxCustomers, setMaxCustomers] = useState(10);

  const modalAddRef = useRef<HTMLDivElement | null>(null);
  const modalEditRef = useRef<HTMLDivElement | null>(null);
  const modalDeleteRef = useRef<HTMLDivElement | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredCoaches = coachesData.filter((coach) => {
    const [firstName, lastName] = coach.name.split(" ");
    const search = searchQuery.toLowerCase();
    const withinRange =
      coach.amount_customer >= minCustomers &&
      coach.amount_customer <= maxCustomers;
    return (
      (firstName.toLowerCase().includes(search) ||
        lastName?.toLowerCase().includes(search)) &&
      withinRange
    );
  });

  const paginatedCoaches = filteredCoaches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(coachesData.length / itemsPerPage);

  const [selectedGender, setSelectedGender] = useState("");

  const [selectedBulkAction, setSelectedBulkAction] = useState("");

  const handleGenderChange = (
    selectedOption: SingleValue<{ value: string; label: string }>
  ) => {
    const gender = selectedOption ? selectedOption.value : "";
    setSelectedGender(gender);
    setFormData({
      ...formData,
      gender: gender || "",
    });
  };

  const openAddModal = () => {
    setIsModalAddOpen(true);
  };

  const closeAddModal = () => {
    setFormData({
      email: "",
      id: "",
      name: "",
      surname: "",
      birth_date: "",
      phone: "",
      gender: "",
      work: "",
      password: "",
    });
    setSelectedGender("");
    setIsPasswordVisible(false);
    setIsModalAddOpen(false);
  };

  const openEditModal = async (coachId: string) => {
    setIsModalEditOpen(true);
    setDropdownOpen(null);
    if (!coachId || isNaN(Number(coachId))) {
      console.error("Invalid coach ID:", coachId);
      return;
    }

    try {
      const response = await sendPostRequest(`http://localhost/get_coach.php`, {
        id_coach: coachId,
      });

      const parsedResponse = JSON.parse(response);

      if (parsedResponse.error) {
        console.error("Error fetching coach:", parsedResponse.error);
        return;
      }

      if (!parsedResponse.coach || typeof parsedResponse.coach !== "object") {
        console.error("Unexpected response format:", parsedResponse);
        return;
      }

      const coach = parsedResponse.coach;

      setFormData({
        email: coach.email || "",
        id: coach.id || "",
        name: coach.name || "",
        surname: coach.surname || "",
        birth_date: coach.birth_date || "",
        phone: coach.phone_number || "",
        gender: coach.gender || "",
        work: coach.work || "",
        password: "",
      });
    } catch (error) {
      console.error("Error fetching coach:", error);
    }
  };

  const closeEditModal = () => {
    setFormData({
      email: "",
      id: "",
      name: "",
      surname: "",
      birth_date: "",
      phone: "",
      gender: "",
      work: "",
      password: "",
    });
    setSelectedGender("");
    setIsPasswordVisible(false);
    setIsModalEditOpen(false);
  };

  const openDeleteModal = async (coachId: string) => {
    setIsModalDeleteOpen(true);
    setDropdownOpen(null);
    if (!coachId || isNaN(Number(coachId))) {
      console.error("Invalid coach ID:", coachId);
      return;
    }

    try {
      const response = await sendPostRequest(`http://localhost/get_coach.php`, {
        id_coach: coachId,
      });

      const parsedResponse = JSON.parse(response);

      if (parsedResponse.error) {
        console.error("Error fetching coach:", parsedResponse.error);
        return;
      }

      if (!parsedResponse.coach || typeof parsedResponse.coach !== "object") {
        console.error("Unexpected response format:", parsedResponse);
        return;
      }

      const coach = parsedResponse.coach;

      setFormData({
        email: coach.email || "",
        id: coach.id || "",
        name: coach.name || "",
        surname: coach.surname || "",
        birth_date: coach.birth_date || "",
        phone: coach.phone_number || "",
        gender: coach.gender || "",
        work: coach.work || "",
        password: "",
      });
    } catch (error) {
      console.error("Error fetching coach:", error);
    }
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
    };

    if (
      isModalAddOpen ||
      dropdownOpen !== null ||
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
    filterNbrClients,
    isModalDeleteOpen,
    isModalEditOpen,
    paginationOption,
  ]);

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

  const handleDateChange = (birth_date: Date | null) => {
    if (birth_date) {
      const formattedDate = format(birth_date, "yyyy-MM-dd");
      setFormData({
        ...formData,
        birth_date: formattedDate,
      });
    } else {
      setFormData({
        ...formData,
        birth_date: null,
      });
    }
  };

  const handleEditCoach = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.surname ||
      !formData.email ||
      !formData.phone ||
      !formData.birth_date ||
      !formData.gender ||
      !formData.work
    ) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await sendPostRequest(
        "http://localhost/edit_employees.php",
        {
          id: formData.id,
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          phone_number: formData.phone,
          birth_date: formData.birth_date,
          password: formData.password,
          gender: formData.gender,
          work: formData.work,
        }
      );

      const parsedResponse = JSON.parse(response);

      if (parsedResponse.error) {
        setError(parsedResponse.error);
        return;
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      setIsModalEditOpen(false);
    }
  };

  const handleCreateCoach = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.surname ||
      !formData.email ||
      !formData.phone ||
      !formData.birth_date ||
      !formData.gender ||
      !formData.work ||
      !formData.password
    ) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await sendPostRequest(
        "http://localhost/add_employee_to_db.php",
        {
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          phone_number: formData.phone,
          birth_date: formData.birth_date,
          password: formData.password,
          gender: formData.gender,
          work: formData.work,
        }
      );

      const parsedResponse = JSON.parse(response);

      if (parsedResponse.error) {
        setError(parsedResponse.error);
        return;
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      setIsModalAddOpen(false);
    }
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
      coach.phone_number,
      coach.amount_customer,
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

  const handleDropdownToggle = (id: string) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleDeleteCoach = async (id: string) => {
    try {
      const response = await sendPostRequest(
        "http://localhost/delete_coach.php",
        {
          id,
        }
      );

      const parsedResponse = JSON.parse(response);

      if (parsedResponse.error) {
        setError(parsedResponse.error);
        return;
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      setIsModalDeleteOpen(false);
    }
  };

  const handleFilterToggle = () => {
    isSearchActive && setIsSearchActive(false);
    paginationOption && setPaginationOption(false);
    setFilterNbrClients(!filterNbrClients);
  };

  const handlePaginationToggle = () => {
    isSearchActive && setIsSearchActive(false);
    filterNbrClients && setFilterNbrClients(false);
    setPaginationOption(!paginationOption);
  };

  const handleIconSearchClick = () => {
    filterNbrClients && setFilterNbrClients(false);
    paginationOption && setPaginationOption(false);
    setIsSearchActive(true);
  };

  const handleBulkAction = async () => {
    const selectedIds = Object.entries(checkedItems)
      .filter(([_, isChecked]) => isChecked)
      .map(([id]) => id);

    try {
      for (const id of selectedIds) {
        const response = await sendPostRequest(
          "http://localhost/delete_coach.php",
          {
            id: id,
          }
        );

        const parsedResponse = JSON.parse(response);

        if (parsedResponse.error) {
          setError(parsedResponse.error);
          return;
        }
      }
    } catch (error) {
      setError("An error occurred while deleting coaches.");
    }
  };

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const genderOptions = [
    { value: "Male", label: "Hommes" },
    { value: "Female", label: "Femmes" },
  ];

  const bulkActions = [{ value: "delete", label: "Supprimer" }];

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
              <Select
                id="bulkActions"
                value={
                  bulkActions.find(
                    (bulkAction) => bulkAction.value === selectedBulkAction
                  ) || null
                }
                options={bulkActions}
                onChange={(selectedOption) =>
                  setSelectedBulkAction(selectedOption?.value || "")
                }
                className="w-full"
                classNamePrefix="react-select"
                placeholder="Action Groupée"
                isSearchable
                isClearable
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md  disabled:bg-slate-200"
                onClick={handleBulkAction}
                disabled={selectedBulkAction === ""}
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
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={handlePaginationToggle}
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {paginationOption && (
            <div className="filter-dropdown absolute right-6 bg-white border border-gray-200 shadow-lg rounded-md p-4 z-10">
              <label className="block text-gray-700 mb-2">
                Coachs par page
              </label>
              <div className="flex flex-row justify-between items-center">
                <button
                  onClick={() =>
                    setItemsPerPage((prev) => Math.max(prev - 1, 1))
                  }
                  className="px-3 py-2 border rounded-l-lg bg-gray-200 hover:bg-gray-300"
                >
                  -
                </button>
                <input
                  type="number"
                  value={itemsPerPage}
                  onChange={(e) =>
                    setItemsPerPage(Math.max(Number(e.target.value), 1))
                  }
                  className="w-full px-3 py-2 border-t border-b border-gray-300 text-center"
                  min="1"
                />
                <button
                  onClick={() => setItemsPerPage((prev) => prev + 1)}
                  className="px-3 py-2 border rounded-r-lg bg-gray-200 hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {filterNbrClients && (
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
            {paginatedCoaches.map((coach) => (
              <tr
                key={coach.id}
                className="border-t border-gray-200 hover:bg-gray-50 relative"
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    className="form-checkbox size-4"
                    checked={!!checkedItems[coach.id]}
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
                  <span className="text-l">
                    {coach.name + " " + coach.surname}
                  </span>
                </td>
                <td className="p-4 text-[#6B83A2]">{coach.email}</td>
                <td className="p-4 text-[#6B83A2]">{coach.phone_number}</td>
                <td className="p-4 text-[#6B83A2]">{coach.amount_customer}</td>
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
                        onClick={() => openEditModal(coach.id)}
                      >
                        Editer
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                        onClick={() => openDeleteModal(coach.id)}
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
        <nav
          className="flex items-center flex-column flex-wrap md:flex-row justify-between py-4"
          aria-label="Table navigation"
        >
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredCoaches.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {filteredCoaches.length}
            </span>
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
                  className={`flex items-center justify-center px-3 h-8 leading-tight ${
                    currentPage === index + 1
                      ? "text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                      : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  }`}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Suivant
              </button>
            </li>
          </ul>
        </nav>
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
            <form onSubmit={handleEditCoach}>
              <div className="flex flex-row gap-4 w-full">
                <div className="mb-4">
                  <label className="block text-gray-700">Prénom</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Nom</label>
                  <input
                    type="text"
                    name="surname"
                    value={formData.surname || ""}
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
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Mot De Passe</label>
                <div className="relative">
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    name="password"
                    value={formData.password || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {isPasswordVisible ? (
                      <EyeOff />
                    ) : (
                      <Eye className="text-gray-600" />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-4 w-full">
                <div className="mb-4">
                  <label className="block text-gray-700">Tel</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Métier</label>
                  <input
                    type="text"
                    name="work"
                    value={formData.work || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-row gap-4 w-full">
                <div className="mb-4 w-full">
                  <label htmlFor="date" className="block text-gray-700">
                    Date d'anniversaire
                  </label>
                  <DatePicker
                    selected={
                      formData.birth_date ? new Date(formData.birth_date) : null
                    }
                    onChange={handleDateChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Selectionner une date"
                  />
                </div>
                <div className="mb-4 w-full">
                  <label className="block text-gray-700">Genre</label>
                  <Select
                    id="gender"
                    value={
                      genderOptions.find(
                        (genderOption) => genderOption.value === selectedGender
                      ) ||
                      genderOptions.find(
                        (genderOption) =>
                          genderOption.value === formData?.gender
                      ) ||
                      null
                    }
                    onChange={handleGenderChange}
                    options={genderOptions}
                    className="w-full"
                    classNamePrefix="react-select"
                    placeholder="Genre"
                    isSearchable
                  />
                </div>
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
                onClick={() => {
                  handleDeleteCoach(formData.id);
                }}
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
            <form onSubmit={handleCreateCoach}>
              <div className="flex flex-row gap-4 w-full">
                <div className="mb-4">
                  <label className="block text-gray-700">Prénom</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Nom</label>
                  <input
                    type="text"
                    name="surname"
                    value={formData.surname || ""}
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
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Mot De Passe</label>
                <div className="relative">
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    name="password"
                    value={formData.password || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {isPasswordVisible ? (
                      <EyeOff />
                    ) : (
                      <Eye className="text-gray-600" />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-4 w-full">
                <div className="mb-4">
                  <label className="block text-gray-700">Tel</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Métier</label>
                  <input
                    type="text"
                    name="work"
                    value={formData.work || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-row gap-4 w-full">
                <div className="mb-4 w-full">
                  <label htmlFor="date" className="block text-gray-700">
                    Date d'anniversaire
                  </label>
                  <DatePicker
                    selected={
                      formData.birth_date ? new Date(formData.birth_date) : null
                    }
                    onChange={handleDateChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Selectionner une date"
                  />
                </div>
                <div className="mb-4 w-full">
                  <label className="block text-gray-700">Genre</label>
                  <Select
                    id="gender"
                    value={
                      genderOptions.find(
                        (genderOption) => genderOption.value === selectedGender
                      ) ||
                      genderOptions.find(
                        (genderOption) =>
                          genderOption.value === formData?.gender
                      ) ||
                      null
                    }
                    onChange={handleGenderChange}
                    options={genderOptions}
                    className="w-full"
                    classNamePrefix="react-select"
                    placeholder="Genre"
                    isSearchable
                  />
                </div>
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
