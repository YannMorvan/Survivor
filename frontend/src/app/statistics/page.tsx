"use client";
import React, {useState, useEffect} from 'react';
import Price from '../components/charts/price';
import Meetings from '../components/charts/meetings-coach';
import Image from 'next/image';
import { sendPostRequest } from '../utils/utils';
import { ArrowLeftRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Coach {
    id: number;
    name: string;
    image: string;
}

export default function Page() {

    const router = useRouter();

    const [isDropdownOpen, setToggleDropdown] = useState(false);
    const [isDropdownOpen2, setToggleDropdown2] = useState(false);
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [selectedCoach, setSelectedCoach] = useState('Choisir un coach');
    const [selectedCoach2, setSelectedCoach2] = useState('Choisir un coach');

    const handleDropdown = () => {
        setToggleDropdown(!isDropdownOpen);
    }

    const handleCoachSelect = (coach) => {
        setSelectedCoach(coach.name);
        setIsOpen(false);
    };

    const handleCoachSelect2 = (coach) => {
        setSelectedCoach2(coach.name);
        setIsOpen2(false);
    }
    
    useEffect(() => {

        if (selectedCoach === 'Choisir un coach' || selectedCoach2 === 'Choisir un coach') {
            return;
        }

        router.replace(`/statistics/${selectedCoach}/${selectedCoach2}`);

    }, [selectedCoach, selectedCoach2]);

    const handleDropdown2 = () => {
        setToggleDropdown2(!isDropdownOpen2);
    }

    const [isOpen, setIsOpen] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const toggleDropdown2 = () => {
        setIsOpen2(!isOpen2);
    };

    useEffect(() => {
        const fetchClientsData = async () => {
          try {
            const response = await sendPostRequest(
              `http://localhost/employes_table.php`,
              {}
            );
            
            const data = JSON.parse(response);
            setCoaches(data.data);
            console.log(data);
          } catch (error) {
            console.error("Erreur lors de la requête : ", error);
          }
        };
      
        fetchClientsData();
      }, []);

    return (
        <div className="ml-6 sm:mr-6 mr-6 mb-5">
        <div className='flex justify-between'>
            <div>
                <h1 className='md:text-2xl sm:text-1xl text-xl font-semibold'>Statistiques</h1>
            </div>
            <div className='flex'>
            <button
                id="dropdownUsersButton"
                onClick={toggleDropdown}
                className="border bg-white border-slate-300 font-medium rounded-sm text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
            >
                {selectedCoach}
                <svg className="w-2.5 h-2.5 ml-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
            </button>

            {isOpen && (
                <div id="dropdownUsers" className="z-10 w-40 mt-12 max-w-full absolute bg-white rounded-lg shadow w-60 dark:bg-gray-700">
                    <ul className="h-48 py-2 overflow-y-auto text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUsersButton">
                        {coaches.map((coach, index) => (
                            <li key={index}>
                               <a
                                href="#"
                                onClick={() => handleCoachSelect(coach)}
                                className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >

                                    <img className="w-6 h-6 mr-2 rounded-full" src={`data:image/png;base64,${coach.image}`} alt={coach.name} />
                                    {coach.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <a href="#" className="flex items-center p-3 text-sm font-medium text-blue-600 border-t border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-blue-500 hover:underline">
                        <svg className="w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                            <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-2V5a1 1 0 0 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 0 0 2 0V9h2a1 1 0 1 0 0-2Z" />
                        </svg>
                        Ajouter un coach
                    </a>
                </div>
            )}
            <div className="mx-3 mt-2">
                <ArrowLeftRight size={24} />
            </div>
            <button
                id="dropdownUsersButton2"
                onClick={toggleDropdown2}
                className="border bg-white border-slate-300 font-medium rounded-sm text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
            >
                {selectedCoach2}
                <svg className="w-2.5 h-2.5 ml-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
            </button>

            {isOpen2 && (
                <div id="dropdownUsers2" className="z-10 w-40 max-w-full right-7 mt-12 absolute bg-white rounded-lg shadow w-60 dark:bg-gray-700">
                    <ul className="h-48 py-2 overflow-y-auto text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUsersButton2">
                        {coaches.map((coach, index) => (
                            <li key={index}>
                                <a
                                    href="#"
                                    onClick={() => handleCoachSelect2(coach)}
                                    className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >

                                    <img className="w-6 h-6 mr-2 rounded-full" src={`data:image/png;base64,${coach.image}`} alt={coach.name} />
                                    {coach.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <a href="#" className="flex items-center p-3 text-sm font-medium text-blue-600 border-t border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-blue-500 hover:underline">
                        <svg className="w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                            <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-2V5a1 1 0 0 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 0 0 2 0V9h2a1 1 0 1 0 0-2Z" />
                        </svg>
                        Ajouter un coach
                    </a>
                </div>
            )}
        </div>
        </div>
        <div>
            <h2 className='mt-4 text-sm text-slate-700'>Analyser les statistiques des coachs.</h2>
        </div> 
        <div className='mt-5'>
            <div className='lg:flex min-w-screen'>
                <div className='lg:w-1/3 bg-white border border-slate-200 rounded-md p-5'>
                <div>
                    <p>Note Global</p>
                </div>
                <div className='mt-2 flex'>
                    <div>
                        <p className='text-6xl'>4.0</p>
                    </div>
                    <div>
                        <div className="flex items-center mt-5 ml-2">
                            <svg className="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                            </svg>
                            <svg className="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                            </svg>
                            <svg className="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                            </svg>
                            <svg className="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                            </svg>
                            <svg className="w-4 h-4 text-gray-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className='flex'>
                    <p className='text-green-500'>+ 0.5</p>
                    <p className='ml-1'>points depuis le dernier mois</p>
                </div>
                <div className='mt-5'>
                    <Price />
                </div>
                </div>
                <div className='lg:w-2/3 lg:ml-4 lg:mt-0 mt-5 bg-white border border-slate-200 rounded-md p-5'>
                    <div className='flex justify-between'>
                        <p>Rendez-vous Clients</p>
                        <div>
                            <button 
                                onClick={handleDropdown} 
                                className="bg-white font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" 
                                type="button">
                                1 an
                                <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                                </svg>
                            </button>
                            {isDropdownOpen && (
                                <div id="dropdown" className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute mt-2 w-24">
                                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                        <li>
                                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">1 mois</a>
                                        </li>
                                        <li>
                                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">1 semaine</a>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='flex'>
                        <div className='mt-1'>
                            <p className='text-slate-500'>Rendez-vous total</p>
                            <p className='text-5xl'>123</p>
                        </div>
                        <div className='mt-1 ml-10'>
                            <p className='text-green-500'>Rendez-vous ce dernier mois</p>
                            <p className='text-5xl text-green-600'>+23</p>
                        </div>
                    </div>
                    <div className='mt-5'>
                        <Meetings />
                    </div>
                </div>
            </div>
            <div className='lg:flex'>
            <div className='mt-5 lg:w-2/3 border rounded p-7 bg-white'>
                <div className='mt-1'>
                    <p className='text-bold'>Dernières Reviews</p>
                </div>
                <div className='mt-8'>
                    <div className='flex'>
                    <Image height={100} width={100} className="p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500" src="/docs/images/people/profile-picture-5.jpg" alt="Bordered avatar"/>
                        <div>
                            <p className='font-semibold ml-6'>Deena Timmon</p>
                            <div className="flex items-center ml-5 mt-1">
                                <svg className="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg className="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg className="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg className="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg className="w-4 h-4 text-gray-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <p className='ml-3 text-sm text-slate-400'>il y a 5 heures</p>
                            </div>
                            <p className='mt-5 ml-6 text-slate-500'>
                            J&apos;ai eu une séance de coaching hier avec Sarah, et c&apos;était incroyablement utile. Elle a su tout de suite comprendre mes objectifs et m’a donné des conseils très pertinents pour améliorer mon organisation professionnelle.
                            </p>
                        </div>   
                    </div>
                </div>
                <div className='mt-8'>
                    <div className='flex'>
                    <Image width={100} height={100} className="p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500" src="/docs/images/people/profile-picture-5.jpg" alt="Bordered avatar"/>
                        <div>
                            <p className='font-semibold ml-6'>Deena Timmon</p>
                            <div className="flex items-center ml-5 mt-1">
                                <svg className="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg className="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg className="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg className="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg className="w-4 h-4 text-gray-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <p className='ml-3 text-sm text-slate-400'>il y a 5 heures</p>
                            </div>
                            <p className='mt-5 ml-6 text-slate-500'>
                            J&apos;ai eu une séance de coaching hier avec Sarah, et c&apos;était incroyablement utile. Elle a su tout de suite comprendre mes objectifs et m’a donné des conseils très pertinents pour améliorer mon organisation professionnelle.
                            </p>
                        </div>   
                    </div>
                </div>
            </div>
            <div className='mt-5 lg:ml-5 lg:w-1/3 border rounded p-7 bg-white'>
                <div className='mt-1'>
                    <p className='text-bold'>Prochains Rendez-vous</p>
                </div>
                <div className='mt-10'>
                    <div className='border p-3 rounded-lg border-slate-300'>
                        <div className='flex'>
                            <Image height={100} width={100} className="p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500" src="/docs/images/people/profile-picture-5.jpg" alt="Bordered avatar"/>
                            <div>
                                <p className='font-semibold ml-6'>Deena Timmon</p>
                                <p className='text-sm ml-6 text-slate-400'>Mardi, 12 2024</p>
                                <p className='ml-6 text-sm'>Je recherche quelqu&apos;un qui a les même gout musicaux</p>
                            </div>   
                        </div>
                    </div>
                    <div className='border p-3 mt-5 rounded-lg border-slate-300'>
                        <div className='flex'>
                            <Image height={100} width={100} className="p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500" src="/docs/images/people/profile-picture-5.jpg" alt="Bordered avatar"/>
                            <div>
                                <p className='font-semibold ml-6'>Deena Timmon</p>
                                <p className='text-sm ml-6 text-slate-400'>Mardi, 12 2024</p>
                                <p className='ml-6 text-sm'>Je recherche quelqu&apos;un qui a les même gout musicaux</p>
                            </div>   
                        </div>
                    </div>
                </div>
            </div>
        </div>  
        </div>
        </div>
    );
};
