"use client";
import React, {useState} from 'react';
import Price from '../components/charts/price';
import Meetings from '../components/charts/meetings-coach';
import Image from 'next/image';

export default function Page() {

    const [isDropdownOpen, setToggleDropdown] = useState(false);

    const handleDropdown = () => {
        console.log('clicked');
        setToggleDropdown(!isDropdownOpen);
    }

    return (
        <div className="ml-6 sm:mr-6 mr-6 mb-5">
        <div>
            <h1 className='md:text-2xl sm:text-1xl text-xl font-semibold'>Statistiques</h1>
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
