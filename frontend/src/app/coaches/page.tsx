"use client";

import React, {useState} from 'react';
import Modal from 'react-modal';
import { CloudDownload, Plus, Search, Sliders, Settings, X } from 'lucide-react';

// Sample coaches list data
const coachesList = [
  {
    id: 'c1',
    name: 'Maximilian Schwarzmüller',
    email: 'max@code.com',
    image: 'https://cdn.pixabay.com/photo/2016/11/18/17/46/hockey-1835433_960_720.jpg',
    phone: '+123 456 7890',
    nbrCustomers: 3,
  },
  {
    id: 'c2',
    name: 'Julie Jones',
    email: 'julie@coaches.com',
    image: 'https://cdn.pixabay.com/photo/2016/11/18/17/46/hockey-1835433_960_720.jpg',
    phone: '+987 654 3210',
    nbrCustomers: 2,
  },
  {
    id: 'c3',
    name: 'James Smith',
    email: 'james@coaches.com',
    image: 'https://cdn.pixabay.com/photo/2016/11/18/17/46/hockey-1835433_960_720.jpg',
    phone: '+456 789 0123',
    nbrCustomers: 5,
  },
];

const Page = () => {
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    image: '',
    phone: '',
    nbrCustomers: 0,
  });

  const openModal = () => {
    setIsModalAddOpen(true);
  };

  const closeModal = () => {
    setIsModalAddOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission logic here
    closeModal();
  };

  return (
    <div className="mx-6 flex flex-col">
      <div className="flex justify-between items-center mb-2 flex-row">
        <h1 className="text-3xl font-semibold text-[#384B65]">Coaches List</h1>
        <div className="flex flex-row items-center">
          <button className="bg-white text-white px-4 py-2 rounded-md flex flex-row items-center gap-4 border border-gray-200 border-2" style={{ color: '#2263B3' }}>
            <CloudDownload style={{ color: '#2263B3' }} />
            <p className="hidden sm:inline font-bold text-[#2263B3]">Export</p>
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md ml-4" style={{ color: '2263B3' }} onClick={openModal}>
            <Plus />
          </button>
        </div>
      </div>
      <p className="text-gray-600 mb-4">You have total {coachesList.length} coaches.</p>

    <div className="overflow-x-auto">
      <div className="py-2 px-4 border border-gray-200">
        <div className="my-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <select className="border border-gray-300 p-2 rounded-md">
              <option>Bulk Action</option>
            </select>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Apply</button>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-gray-700">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <Sliders className="w-5 h-5" />
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <Settings className="w-5 h-5" />
            </button>
          </div>
      </div>
      </div>

        <table className="w-full border border-gray-200 shadow-sm rounded-lg">
          <thead>
            <tr>
              <th className="p-4 text-left">
                <input type="checkbox" className="form-checkbox size-4" />
              </th>
              <th className="p-4 text-left text-[#6B83A2]">Coach</th>
              <th className="p-4 text-left text-[#6B83A2]">Email</th>
              <th className="p-4 text-left text-[#6B83A2]">Phone</th>
              <th className="p-4 text-left text-[#6B83A2]">Number of customers</th>
              <th className="p-4 text-left text-[#6B83A2]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coachesList.map((coach) => (
              <tr key={coach.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="p-4">
                  <input type="checkbox" className="form-checkbox size-4" />
                </td>
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={coach.image}
                      alt={coach.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className='text-l'>{coach.name}</span>
                </td>
                <td className="p-4 text-[#6B83A2]">{coach.email}</td>
                <td className="p-4 text-[#6B83A2]">{coach.phone}</td>
                <td className="p-4 text-[#6B83A2]">{coach.nbrCustomers}</td>
                <td className="p-4 text-[#6B83A2]">
                  <button className="text-[#384B65] hover:text-[#6B83A2]">
                    •••
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalAddOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 relative w-1/2">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={closeModal}
            >
              <X />
            </button>
            <h2 className="text-2xl mb-4">Add New Coach</h2>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-row gap-4 w-full">
                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
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
                  <label className="block text-gray-700">Surname</label>
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
                <label className="block text-gray-700">Phone</label>
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
                <label className="block text-gray-700">Number of Customers</label>
                <input
                  type="number"
                  name="nbrCustomers"
                  value={formData.nbrCustomers}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Save
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
