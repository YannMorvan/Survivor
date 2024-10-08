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
import { useRouter } from "next/navigation";

import Select from "react-select";

import { sendPostRequest } from "../utils/utils.js";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { format, formatDuration } from "date-fns";
import { SingleValue, ActionMeta } from "react-select";
import LoadingScreen from "../components/loading";

interface FormData {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone_number: string;
  birth_date: string | null;
  gender: string;
  astrological_sign: string;
  description: string;
  address: string;
  id_coach: string;
}

const Page = () => {
  interface CoachesNames {
    id: string;
    name: string;
    surname: string;
  }

  interface CheckedItems {
    [key: string]: boolean;
  }

  interface Customers {
    id: string;
    name: string;
    email: string;
    image: string;
    surname: string;
    phone_number: string;
    paymentMethod: string;
  }

  interface CustomerData {
    id: string;
    name: string;
    email: string;
    image: string;
    surname: string;
    phone_number: string;
    id_coach: string;
    birth_date: string;
    address: string;
    description: string;
    gender: string;
    astrological_sign: string;
  }

  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [customersData, setCustomersData] = useState<Customers[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [paginationOption, setPaginationOption] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [allChecked, setAllChecked] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedCoach, setSelectedCoach] = useState("");
  const [selectedAstro, setSelectedAstro] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState<FormData>({
    id: "",
    name: "",
    surname: "",
    email: "",
    phone_number: "",
    birth_date: "",
    gender: "",
    astrological_sign: "",
    description: "",
    address: "",
    id_coach: "",
  });

  const genderOptions = [
    { value: "Male", label: "Hommes" },
    { value: "Female", label: "Femmes" },
  ];

  const bulkActions = [{ value: "delete", label: "Supprimer" }];

  const astroOptions = [
    { value: "Aquarius", label: "Verseau" },
    { value: "Aries", label: "Bélier" },
    { value: "Cancer", label: "Cancer" },
    { value: "Capricorn", label: "Capricorne" },
    { value: "Taurus", label: "Taureau" },
    { value: "Leo", label: "Lion" },
    { value: "Libra", label: "Balance" },
    { value: "Pisces", label: "Poissons" },
    { value: "Scorpio", label: "Scorpion" },
    { value: "Sagittarius", label: "Sagittaire" },
    { value: "Virgo", label: "Vierge" },
    { value: "Gemini", label: "Gémeaux" },
  ];

  const [checkedItems, setCheckedItems] = useState<CheckedItems>(
    customersData.reduce((acc, customer) => {
      acc[customer.id] = false;
      return acc;
    }, {} as CheckedItems)
  );

  const modalAddRef = useRef<HTMLDivElement | null>(null);
  const modalEditRef = useRef<HTMLDivElement | null>(null);
  const modalDeleteRef = useRef<HTMLDivElement | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const fetchCustomersData = async () => {
    try {
      const response = await sendPostRequest(
        `http://localhost/table_clients.php`,
        {}
      );

      const parsedResponse = JSON.parse(response);

      if (
        parsedResponse.status === true &&
        Array.isArray(parsedResponse.data)
      ) {
        const formattedData: Customers[] = parsedResponse.data.map(
          (item: any) => ({
            id: item.id.toString(),
            name: item.name,
            email: item.email,
            image: item.image,
            surname: item.surname,
            phone_number: item.phone_number,
            paymentMethod: item.paymentMethod,
          })
        );

        fetchCustomersImage();

        setCustomersData(formattedData);
      } else {
        console.error("Unexpected response format:", parsedResponse);
      }
    } catch (error) {
      console.error("Error fetching coaches data:", error);
    }
  };

  useEffect(() => {
    fetchCustomersData();
  }, []);

  const openAddModal = () => {
    setIsModalAddOpen(true);
  };

  const closeAddModal = () => {
    setFormData({
      address: "",
      email: "",
      id: "",
      name: "",
      surname: "",
      id_coach: "",
      birth_date: "",
      description: "",
      astrological_sign: "",
      phone_number: "",
      gender: "",
    });
    setSelectedCoach("");
    setSelectedAstro("");
    setSelectedGender("");
    setIsModalAddOpen(false);
  };

  const openEditModal = async (customerId: string) => {
    setIsModalEditOpen(true);
    setDropdownOpen(null);
    fetchCoachesData();
    try {
      const response = await sendPostRequest(
        `http://localhost/client_profile.php`,
        {
          id: customerId,
        }
      );

      const parsedResponse = JSON.parse(response);

      if (parsedResponse.error) {
        console.error(parsedResponse.error);
        return;
      }

      const customer = parsedResponse.data;

      if (!customer) {
        console.error("Customer data is undefined");
        return;
      }

      setFormData({
        address: customer.address || "",
        email: customer.email || "",
        id: customer.id || "",
        name: customer.name || "",
        surname: customer.surname || "",
        id_coach: customer.id_coach ? customer.id_coach.toString() : "",
        birth_date: customer.birth_date || "",
        description: customer.description || "",
        astrological_sign: customer.astrological_sign || "",
        phone_number: customer.phone_number || "",
        gender: customer.gender || "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const closeEditModal = () => {
    setFormData({
      address: "",
      email: "",
      id: "",
      name: "",
      surname: "",
      id_coach: "",
      birth_date: "",
      description: "",
      astrological_sign: "",
      phone_number: "",
      gender: "",
    });
    setSelectedCoach("");
    setSelectedAstro("");
    setSelectedGender("");
    setIsModalEditOpen(false);
  };

  const handleEditCustomer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.surname ||
      !formData.email ||
      !formData.phone_number ||
      !formData.birth_date ||
      !formData.gender ||
      !formData.astrological_sign ||
      !formData.description ||
      !formData.address ||
      !formData.id_coach
    ) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await sendPostRequest(
        "http://localhost/edit_customer.php",
        {
          id: formData.id,
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          phone_number: formData.phone_number,
          address: formData.address,
          gender: formData.gender,
          birth_date: formData.birth_date,
          description: formData.description,
          astrological_sign: formData.astrological_sign,
          id_coach: formData.id_coach,
        }
      );

      const parsedResponse = JSON.parse(response);

      fetchCustomersData();

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

  const handleDeleteCustomer = async (id: string) => {
    try {
      const response = await sendPostRequest(
        "http://localhost/delete_customer.php",
        {
          id,
        }
      );

      const parsedResponse = JSON.parse(response);

      if (parsedResponse.error) {
        setError(parsedResponse.error);
        return;
      }

      fetchCustomersData();
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      setIsModalDeleteOpen(false);
    }
  };

  const openDeleteModal = async (customerId: string) => {
    setIsModalDeleteOpen(true);
    setDropdownOpen(null);
    try {
      const response = await sendPostRequest(
        `http://localhost/client_profile.php`,
        {
          id: customerId,
        }
      );

      const parsedResponse = JSON.parse(response);

      if (parsedResponse.error) {
        console.error(parsedResponse.error);
        return;
      }

      const customer = parsedResponse.data;

      if (!customer) {
        console.error("Customer data is undefined");
        return;
      }

      setFormData({
        address: customer.address || "",
        email: customer.email || "",
        id: customer.id || "",
        name: customer.name || "",
        surname: customer.surname || "",
        id_coach: customer.id_coach
          ? customer.id_coach.toString()
          : "Pas de Coach assigné",
        birth_date: customer.birth_date || "",
        description: customer.description || "Pas de description",
        astrological_sign: customer.astrological_sign || "",
        phone_number: customer.phone_number || "",
        gender: customer.gender || "",
      });
    } catch (error) {
      console.error(error);
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
  }, [isModalAddOpen, dropdownOpen, isModalDeleteOpen, isModalEditOpen]);

  const handleIconSearchClick = () => {
    paginationOption && setPaginationOption(false);
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

  useEffect(() => {
    const initialCheckedItems = customersData.reduce((acc, customer) => {
      acc[customer.id] = false;
      return acc;
    }, {} as CheckedItems);

    setCheckedItems(initialCheckedItems);
    setAllChecked(false);
  }, [customersData]);

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
    const headers = ["Name", "Email", "Phone", "Payment Method"];
    const rows = customersData.map((customer) => [
      customer.name,
      customer.email,
      customer.phone_number,
      customer.paymentMethod,
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

  const handlePaginationToggle = () => {
    isSearchActive && setIsSearchActive(false);
    setPaginationOption(!paginationOption);
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

  const handleBulkAction = async () => {
    const selectedIds = Object.entries(checkedItems)
      .filter(([_, isChecked]) => isChecked)
      .map(([id]) => id);

    try {
      for (const id of selectedIds) {
        const response = await sendPostRequest(
          "http://localhost/delete_customer.php",
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

  const filteredCustomers = customersData.filter((customer) => {
    const [firstName, lastName] = customer.name.split(" ");
    const search = searchQuery.toLowerCase();
    return (
      firstName.toLowerCase().includes(search) ||
      lastName?.toLowerCase().includes(search)
    );
  });

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(customersData.length / itemsPerPage);

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

  const handleCoachChange = (selectedOption: SingleValue<any>) => {
    setSelectedCoach(selectedOption.value);
    setFormData({
      ...formData,
      id_coach: selectedOption.value || "",
    });
  };

  const handleAstroChange = (
    selectedOption: SingleValue<{ value: string; label: string }>
  ) => {
    const astro = selectedOption ? selectedOption.value : "";
    setSelectedAstro(astro);
    setFormData({
      ...formData,
      astrological_sign: astro || "",
    });
  };
  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.surname ||
      !formData.email ||
      !formData.phone_number ||
      !formData.birth_date ||
      !formData.gender ||
      !formData.astrological_sign ||
      !formData.description ||
      !formData.address ||
      !formData.id_coach
    ) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await sendPostRequest(
        "http://localhost/add_user_to_db.php",
        {
          email: formData.email,
          phone_number: formData.phone_number,
          name: formData.name,
          surname: formData.surname,
          birth_date: formData.birth_date,
          gender: formData.gender,
          astrological_sign: formData.astrological_sign,
          description: formData.description,
          address: formData.address,
          id_coach: formData.id_coach,
        }
      );

      const parsedResponse = JSON.parse(response);

      fetchCustomersData();

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

  const [coachesNames, setCoachesNames] = useState<CoachesNames[]>([]);

  const options = coachesNames.map((coach) => ({
    value: coach.id,
    label: `${coach.name} ${coach.surname}`,
  }));

  const fetchCoachesData = async () => {
    try {
      const response = await sendPostRequest(
        `http://localhost/get_coach_data.php`,
        {}
      );

      const parsedResponse = JSON.parse(response);

      if (
        parsedResponse.status === true &&
        Array.isArray(parsedResponse.coaches)
      ) {
        const formattedData: CoachesNames[] = parsedResponse.coaches.map(
          (item: any) => ({
            id: item.id.toString(),
            name: item.name,
            surname: item.surname,
          })
        );

        setCoachesNames(formattedData);
      } else {
        console.error("Unexpected response format:", parsedResponse);
      }
    } catch (error) {
      console.error("Error fetching coaches data:", error);
    }
  };

  const [selectedBulkAction, setSelectedBulkAction] = useState("");

  const fetchCustomersImage = async () => {
    const currentCoaches = itemsPerPage * currentPage;

    try {
      for (
        let i = 0 + currentCoaches - itemsPerPage;
        i <= currentCoaches;
        i++
      ) {
        const response = await sendPostRequest(
          `http://localhost/client_image.php`,
          { id: i }
        );

        const parsedResponse = JSON.parse(response);

        if (parsedResponse.status === true) {
          const image = parsedResponse.data;
          setCustomersData((prevData) =>
            prevData.map((item, index) =>
              index === i - 1 ? { ...item, image } : item
            )
          );
        }
      }
    } catch (error) {
      console.error("Error fetching coaches data:", error);
    }
  };

  useEffect(() => {
    fetchCustomersImage();
  }, [currentPage]);

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
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error during the request: ", error);
      }
    };

    fetchData();
  }, [router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="mx-6 flex flex-col">
      <div className="flex justify-between items-center mb-2 flex-row">
        <h1 className="text-3xl font-semibold text-[#384B65]">
          Liste des Customers
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
        Vous avez {customersData.length} clients
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
              <button className="text-gray-500 hover:text-gray-700">
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
                Clients par page
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
              <th className="p-4 text-left text-[#6B83A2]">Customer</th>
              <th className="p-4 text-left text-[#6B83A2]">Email</th>
              <th className="p-4 text-left text-[#6B83A2]">Tel</th>
              <th className="p-4 text-left text-[#6B83A2]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCustomers.map((customer) => (
              <tr
                key={customer.id}
                className="border-t border-gray-200 hover:bg-gray-50 relative"
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    className="form-checkbox size-4"
                    checked={!!checkedItems[customer.id]}
                    onChange={() => handleCheckboxChange(customer.id)}
                  />
                </td>
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={
                        customer.image
                          ? `data:image/jpeg;base64,${customer.image}`
                          : ""
                      }
                      alt={customer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-l">
                    {customer.name + " " + customer.surname}
                  </span>
                </td>
                <td className="p-4 text-[#6B83A2]">{customer.email}</td>
                <td className="p-4 text-[#6B83A2]">{customer.phone_number}</td>
                <td className="p-4 text-[#6B83A2] relative">
                  <button
                    className="text-[#384B65] hover:text-[#6B83A2]"
                    onClick={() => handleDropdownToggle(customer.id)}
                  >
                    •••
                  </button>
                  {dropdownOpen === customer.id && (
                    <div
                      ref={(el) => {
                        dropdownRefs.current[customer.id] = el;
                      }}
                      className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 shadow-lg rounded-md z-10"
                    >
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                        onClick={(e) => {
                          router.push(`/customers/${customer.id}`);
                        }}
                      >
                        Profile
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                        onClick={() => openEditModal(customer.id)}
                      >
                        Editer
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                        onClick={() => openDeleteModal(customer.id)}
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
              {Math.min(currentPage * itemsPerPage, filteredCustomers.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {filteredCustomers.length}
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
            <h2 className="text-2xl mb-4">Editer Le Client</h2>
            <form onSubmit={handleEditCustomer}>
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
                <label className="block text-gray-700">Tel</label>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex flex-row gap-4 w-full">
                <div className="mb-4 w-1/2">
                  <label className="block text-gray-700">Coach</label>
                  <Select
                    id="customer"
                    value={
                      options.find(
                        (option) => option.value === selectedCoach
                      ) ||
                      options.find(
                        (option) => option.value === formData?.id_coach
                      ) ||
                      null
                    }
                    onChange={(selectedOption) =>
                      handleCoachChange(selectedOption)
                    }
                    options={options}
                    className="w-full"
                    classNamePrefix="react-select"
                    placeholder="Select Coach"
                    isSearchable
                    required
                  />
                </div>
                <div className="mb-4 w-1/2">
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
              </div>
              <div className="mb-4 w-full">
                <label className="block text-gray-700">Adresse</label>
                <input
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex flex-row gap-4 w-full">
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
                    placeholder="Select Gender"
                    isSearchable
                  />
                </div>
                <div className="mb-4 w-full">
                  <label className="block text-gray-700">
                    Signe Astrologique
                  </label>
                  <Select
                    id="astrological_sign"
                    value={
                      astroOptions.find(
                        (astroOption) => astroOption.value === selectedAstro
                      ) ||
                      astroOptions.find(
                        (astroOption) =>
                          astroOption.value === formData?.astrological_sign
                      ) ||
                      null
                    }
                    onChange={handleAstroChange}
                    options={astroOptions}
                    className="w-full"
                    placeholder="Signe Astro"
                    isSearchable
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                </div>
              </div>
              <div className="mb-4 w-full">
                <label className="block text-gray-700">Description</label>
                <input
                  name="description"
                  value={formData.description || ""}
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
            <h2 className="text-2xl mb-4">Supprimer le Customer</h2>
            <p>Etes vous sur de vouloir supprimer le Customer?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={() => {
                  handleDeleteCustomer(formData.id);
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
            <h2 className="text-2xl mb-4">Ajouter un Customer</h2>
            <form onSubmit={handleCreateCustomer}>
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
                <label className="block text-gray-700">Tel</label>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex flex-row gap-4 w-full">
                <div className="mb-4 w-1/2">
                  <label className="block text-gray-700">Coach</label>
                  <Select
                    id="coach"
                    value={
                      options.find(
                        (option) => option.value === selectedCoach
                      ) || null
                    }
                    onChange={(selectedOption) =>
                      handleCoachChange(selectedOption)
                    }
                    options={options}
                    className="w-full"
                    placeholder="Select Coach"
                    isSearchable
                    onMenuOpen={fetchCoachesData}
                    required
                  />
                </div>
                <div className="mb-4 w-1/2">
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
              </div>
              <div className="mb-4 w-full">
                <label className="block text-gray-700">Adresse</label>
                <input
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex flex-row gap-4 w-full">
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
                    placeholder="Select Gender"
                    isSearchable
                  />
                </div>
                <div className="mb-4 w-full">
                  <label className="block text-gray-700">
                    Signe Astrologique
                  </label>
                  <Select
                    id="astrological_sign"
                    value={
                      astroOptions.find(
                        (astroOption) => astroOption.value === selectedAstro
                      ) ||
                      astroOptions.find(
                        (astroOption) =>
                          astroOption.value === formData?.astrological_sign
                      ) ||
                      null
                    }
                    onChange={handleAstroChange}
                    options={astroOptions}
                    className="w-full"
                    placeholder="Signe Astro"
                    isSearchable
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                </div>
              </div>
              <div className="mb-4 w-full">
                <label className="block text-gray-700">Description</label>
                <input
                  name="description"
                  value={formData.description || ""}
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
