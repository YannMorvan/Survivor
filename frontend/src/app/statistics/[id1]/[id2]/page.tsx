"use client";

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Meetings from '../../../components/charts/compare-coach';
import Price from '../../../components/charts/compare-star';
import Image from 'next/image'
import Review from '../../../components/review';
import { useEffect } from 'react';
import { sendPostRequest } from '../../../utils/utils';
import { useParams } from 'next/navigation';

interface Client {
    id: number;
    name: string;
    birth_date: string;
    surname: string;
    phone: string;
    email: string;
    gender: string;
    address: string;
    description: string;
    image: string;
    astrological_sign: string;
}

interface Encounters {
    date: string;
    rating: number;
    comment: string;
    source: string;
}

export default function Statistics() {

    const router = useRouter();

    const params = useParams();
    const id1 = params.id1;
    const id2 = params.id2;

    const [data1, setData1] = useState<Client>();
    const [data2, setData2] = useState<Client>();
    const [avgStar1, setAvgStar1] = useState<number>(0);
    const [avgStar2, setAvgStar2] = useState<number>(0);
    const [Encounters1, setEncounter1] = useState<Encounters[]>([]);
    const [Encounters2, setEncounter2] = useState<Encounters[]>([]);

    useEffect(() => {
        const fetchData1 = async () => {
            try {
                const response = await sendPostRequest(
                  `http://localhost/get_coach.php`,
                  {id_coach: id1}
                );
                
                const data = JSON.parse(response);
                setData1(data.coach);
                const all_encounters: Encounters[] = [];
                data.coach.customers.forEach((customer) => {
                    all_encounters.push(...customer.encounters);
                    customer.encounters.forEach((encounter) => {
                        encounter.name = customer.name;
                    });
                    all_encounters.sort((a, b) => {
                        return a.date < b.date ? -1 : 1;
                    });
                });
                setEncounter1(all_encounters);
                console.log(all_encounters);

                let avgStar = 0;

                all_encounters.forEach((encounter) => {
                    avgStar += encounter.rating;
                });

                avgStar = avgStar / all_encounters.length;

                setAvgStar1(avgStar);

              } catch (error) {
                console.error("Erreur los de la requête : ", error);
              }
        };

        const fetchData2 = async () => {
            try {
                const response = await sendPostRequest(
                  `http://localhost/get_coach.php`,
                  {id_coach: id2}
                );
                
                const data = JSON.parse(response);
                setData2(data.coach);
                const all_encounters: Encounters[] = [];
                data.coach.customers.forEach((customer) => {
                    all_encounters.push(...customer.encounters);
                    customer.encounters.forEach((encounter) => {
                        encounter.name = customer.name;
                    });
                    all_encounters.sort((a, b) => {
                        return a.date < b.date ? -1 : 1;
                    });
                });
                setEncounter2(all_encounters);
                console.log(all_encounters);

                let avgStar = 0;

                all_encounters.forEach((encounter) => {
                    avgStar += encounter.rating;
                });

                avgStar = avgStar / all_encounters.length;

                setAvgStar2(avgStar);
              } catch (error) {
                console.error("Erreur lors de la requête : ", error);
              }
        };

        fetchData1();
        fetchData2();

    }, [id1, id2]);

    return (
        <div className="ml-6 sm:mr-6 mr-6 mb-5">
            <div className='flex justify-between'>
                <div>
                    <h1 className='md:text-2xl sm:text-1xl text-xl font-semibold'>Comparaison entre {data1?.name} et {data2?.name}</h1>
                </div>
                <div>
                        <button
                            className="flex items-center bg-white text-[#384B65] px-6 py-2 rounded-lg border border-[#E1E8F1]"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft size={24} className="mr-2" />
                            <p className="text-lg">Back</p>
                        </button>
                </div>
            </div>
            <div>
            <h2 className='mt-4 text-sm text-slate-700'>Analyser les statistiques des coachs.</h2>
        </div> 
        <div className='mt-5'>
            <div className='lg:flex min-w-screen'>
                <div className='lg:w-1/3 bg-white border border-slate-200 rounded-md p-5'>
                <div className='flex justify-between'>
                    <div>
                        <p className='font-semibold'>{data1?.name}</p>
                        <div>
                            <p>Note Global</p>
                        </div>
                            <div className='mt-2 flex'>
                                <div>
                                    <p className='text-6xl'>{avgStar1}</p>
                                </div>
                                <div>
                                    <div className="flex items-center mt-5 ml-2">
                                    {[...Array(Math.floor(avgStar1))].map((_, index) => (
                                        <svg
                                        key={`gold-${index}`}
                                        className="w-4 h-4 text-yellow-300 ms-1"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 22 20"
                                        >
                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                        </svg>
                                    ))}
                                    {[...Array(5 - Math.floor(avgStar1))].map((_, index) => (
                                        <svg
                                        key={`gray-${index}`}
                                        className="w-4 h-4 text-gray-300 ms-1"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 22 20"
                                        >
                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                        </svg>
                                    ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    <div>
                        <p className='font-semibold'>{data2?.name}</p>
                        <div>
                            <p>Note Global</p>
                        </div>
                        <div className='mt-2 flex'>
                            <div>
                                <p className='text-6xl'>{avgStar2}</p>
                            </div>
                            <div>
                                <div className="flex items-center mt-5 ml-2">
                                {[...Array(Math.floor(avgStar2))].map((_, index) => (
                                    <svg
                                    key={`gold-${index}`}
                                    className="w-4 h-4 text-yellow-300 ms-1"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 22 20"
                                    >
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                    </svg>
                                ))}
                                {[...Array(5 - Math.floor(avgStar2))].map((_, index) => (
                                    <svg
                                    key={`gray-${index}`}
                                    className="w-4 h-4 text-gray-300 ms-1"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 22 20"
                                    >
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                    </svg>
                                ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-5'>
                    <Price coach1={data1?.name} coach2={data2?.name} data1={Encounters1} data2={Encounters2}/>
                </div>
                </div>
                <div className='lg:w-2/3 lg:ml-4 lg:mt-0 mt-5 bg-white border border-slate-200 rounded-md p-5'>
                    <div className='flex justify-between'>
                        <p>Rendez-vous Clients</p>
                    </div>
                    <div className='flex w-10/12 justify-between'>
                        <div className='mt-1'>
                            <p className='text-slate-500'>Rendez-vous total de {data1?.name}</p>
                            <p className='text-5xl'>{Encounters1.length}</p>
                        </div>
                        <div className='mt-1 ml-10'>
                            <p className='text-slate-500'>Rendez-vous total de {data2?.name}</p>
                            <p className='text-5xl'>{Encounters2.length}</p>
                        </div>
                        <div className='mt-1 ml-10'>
                            <p className='text-green-500'>Rendez-vous ce dernier mois</p>
                            <p className='text-5xl text-green-600'>+23</p>
                        </div>
                    </div>
                    <div className='mt-5'>
                        <Meetings coach1={data1?.name} coach2={data2?.name} data1={Encounters1} data2={Encounters2} />
                    </div>
                </div>
            </div>
            </div>
            <div className='lg:flex w-full'>
            <div className='mt-5 border rounded p-7 bg-white mr-5 w-1/2'>
            <div className='mt-1 mb-8'>
                <p className='font-bold'>Dernières Reviews des clients de {data1?.name}</p>
            </div>
                    {Encounters1.slice(0, 3).map((customers, index) => (
                        <div className='flex mb-5' key={index}>
                        <div className="w-12 h-12">
                        <Image
                            width={48}
                            height={48}
                            className="rounded-full object-cover border"
                            src="/docs/images/people/profile-picture-5.jpg"
                            alt="Bordered avatar"
                        />
                    </div>
                        <div>
                            <p className='font-semibold ml-6'>{customers.name}</p>
                            <div className="flex items-center ml-5 mt-1">
                            {[...Array(Math.floor(customers.rating))].map((_, index) => (
                            <svg
                            key={`gold-${index}`}
                            className="w-4 h-4 text-yellow-300 ms-1"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                            >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                            </svg>
                            ))}
                            {[...Array(5 - Math.floor(customers.rating))].map((_, index) => (
                                <svg
                                key={`gray-${index}`}
                                className="w-4 h-4 text-gray-300 ms-1"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 22 20"
                                >
                                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                            ))}
                            <p className='ml-3 text-sm text-slate-400'>{customers.date}</p>
                            </div>
                            <p className='ml-6 mt-2 text-sm text-slate-400'>{customers.source}</p>
                            <p className='ml-6 mt-2 text-slate-500'>
                            {customers.comment}
                            </p>
                        </div>
                        </div>
                    ))}
                    </div>    
                    <div className='mt-5 border rounded p-7 bg-white w-1/2'>
                    <div className='mt-1 mb-8'>
                        <p className='font-bold'>Dernières Reviews des clients de {data2?.name}</p>
                    </div>
                    {Encounters2.slice(0, 3).map((customers, index) => (
                        <div className='flex mb-5' key={index}>
                        <div className="w-12 h-12">
                        <Image
                            width={48}
                            height={48}
                            className="rounded-full object-cover border"
                            src="/docs/images/people/profile-picture-5.jpg"
                            alt="Bordered avatar"
                        />
                    </div>
                        <div>
                            <p className='font-semibold ml-6'>{customers.name}</p>
                            <div className="flex items-center ml-5 mt-1">
                            {[...Array(Math.floor(customers.rating))].map((_, index) => (
                            <svg
                            key={`gold-${index}`}
                            className="w-4 h-4 text-yellow-300 ms-1"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                            >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                            </svg>
                            ))}
                            {[...Array(5 - Math.floor(customers.rating))].map((_, index) => (
                                <svg
                                key={`gray-${index}`}
                                className="w-4 h-4 text-gray-300 ms-1"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 22 20"
                                >
                                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                            ))}
                            <p className='ml-3 text-sm text-slate-400'>{customers.date}</p>
                            </div>
                            <p className='ml-6 mt-2 text-sm text-slate-400'>{customers.source}</p>
                            <p className='ml-6 mt-2 text-slate-500'>
                            {customers.comment}
                            </p>
                        </div>
                        </div>
                    ))}
                    </div>  
            </div>
        </div>
    )
}