import { useState } from 'react';
import { Plus } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { sendPostRequest } from '../utils/utils';

interface FormData {
  name: string;
  date: Date | null;
  duration: string;
  max_participants: string;
  location_x: string;
  location_y: string;
  type: string;
  location_name: string;
}

const CrudModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    date: null,
    duration: '',
    max_participants: '',
    location_x: '',
    location_y: '',
    type: '',
    location_name: '',
  });

  const createEvent = async () => {
    const eventData = {
      id: 0,
      name: formData?.name,
      date: formData?.date ? formData.date.toISOString().split('T')[0] : '',
      duration: parseInt(formData.duration, 10),
      max_participants: parseInt(formData.max_participants, 10),
      location_x: formData?.location_x,
      location_y: formData?.location_y,
      type: formData?.type,
      location_name: formData?.location_name,
    };

    try {
      const response = await sendPostRequest(
        `http://localhost/create_event.php`,
        eventData
      );

      const data = JSON.parse(response);
      console.log(data);
    } catch (error) {
      console.error("Erreur lors de la requête : ", error);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date: Date | null) => {
    setFormData({
      ...formData,
      date,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createEvent();
    toggleModal();
  };

  return (
    <>
      <button
        onClick={toggleModal}
        className="xs:ml-5 xs:mt-0 mt-2 text-slate-900 bg-sky-700 font-medium border border-slate-200 rounded-sm text-sm px-5 py-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        <div className='flex'>
          <Plus size={16} color='white' className='mr-3 mt-0.5'/>
          <p className='text-white'>Ajouter Evènement</p>
        </div>
      </button>

      {isModalOpen && (
        <div
          id="crud-modal"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full bg-gray-900 bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Ajouter un nouvel évènement
                </h3>
                <button
                  onClick={toggleModal}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Fermer</span>
                </button>
              </div>
              <form className="p-4 md:p-5" onSubmit={handleSubmit}>
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Titre de l'évènement
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData?.name}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Nom de l'évènement"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="date"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Date de l'évènement
                    </label>
                    <DatePicker
                      selected={formData?.date}
                      onChange={handleDateChange}
                      className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Sélectionner une date"
                    />
                  </div>

                  <div className="col-span-1">
                    <label
                      htmlFor="duration"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Durée (en heures)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      id="duration"
                      value={formData?.duration}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Durée"
                      required
                    />
                  </div>

                  <div className="col-span-1">
                    <label
                      htmlFor="max_participants"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Participants max
                    </label>
                    <input
                      type="number"
                      name="max_participants"
                      id="max_participants"
                      value={formData?.max_participants}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Nombre max de participants"
                      required
                    />
                  </div>

                  <div className="col-span-1">
                    <label
                      htmlFor="location_x"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Localisation X
                    </label>
                    <input
                      type="text"
                      name="location_x"
                      id="location_x"
                      value={formData?.location_x}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Coordonnée X"
                      required
                    />
                  </div>

                  <div className="col-span-1">
                    <label
                      htmlFor="location_y"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Localisation Y
                    </label>
                    <input
                      type="text"
                      name="location_y"
                      id="location_y"
                      value={formData?.location_y}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Coordonnée Y"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="type"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Type d'évènement
                    </label>
                    <input
                      type="text"
                      name="type"
                      id="type"
                      value={formData?.type}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type d'évènement"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="location_name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Nom du lieu
                    </label>
                    <input
                      type="text"
                      name="location_name"
                      id="location_name"
                      value={formData?.location_name}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Nom du lieu"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg
                    className="me-1 -ms-1 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Ajouter un nouvel événement
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CrudModal;

