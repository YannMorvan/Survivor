"use client";
import React, { useEffect, useState } from 'react';
import { ArrowLeft, MailCheck, MapPin, HeartPulse, ArrowUp01, Phone, Telescope, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProgressBar from '../../../components/charts/progress';
import PriceChart from '../../../components/charts/price';
import { sendPostRequest } from '../../../utils/api';
import { useParams } from 'next/navigation';
import Heartbeat from '@/app/components/heartbeat';

interface AstrologicalSign {
    Aries: number;
    Taurus: number;
    Gemini: number;
    Cancer: number;
    Leo: number;
    Virgo: number;
    Libra: number;
    Scorpio: number;
    Sagittarius: number;
    Capricorn: number;
    Aquarius: number;
    Pisces: number;
}

const compatibilityTable: Record<string, AstrologicalSign> = {
    Aries: {
        Aries: 50,
        Taurus: 60,
        Gemini: 70,
        Cancer: 55,
        Leo: 80,
        Virgo: 60,
        Libra: 65,
        Scorpio: 75,
        Sagittarius: 85,
        Capricorn: 50,
        Aquarius: 60,
        Pisces: 70
    },
    Taurus: {
        Aries: 60,
        Taurus: 55,
        Gemini: 65,
        Cancer: 75,
        Leo: 60,
        Virgo: 80,
        Libra: 70,
        Scorpio: 65,
        Sagittarius: 55,
        Capricorn: 80,
        Aquarius: 50,
        Pisces: 70
    },
    Gemini: {
        Aries: 70,
        Taurus: 65,
        Gemini: 50,
        Cancer: 60,
        Leo: 75,
        Virgo: 65,
        Libra: 80,
        Scorpio: 60,
        Sagittarius: 85,
        Capricorn: 55,
        Aquarius: 85,
        Pisces: 60
    },
    Cancer: {
        Aries: 55,
        Taurus: 75,
        Gemini: 60,
        Cancer: 50,
        Leo: 65,
        Virgo: 70,
        Libra: 65,
        Scorpio: 80,
        Sagittarius: 60,
        Capricorn: 70,
        Aquarius: 55,
        Pisces: 85
    },
    Leo: {
        Aries: 80,
        Taurus: 60,
        Gemini: 75,
        Cancer: 65,
        Leo: 50,
        Virgo: 60,
        Libra: 75,
        Scorpio: 70,
        Sagittarius: 85,
        Capricorn: 60,
        Aquarius: 70,
        Pisces: 65
    },
    Virgo: {
        Aries: 60,
        Taurus: 80,
        Gemini: 65,
        Cancer: 70,
        Leo: 60,
        Virgo: 50,
        Libra: 65,
        Scorpio: 75,
        Sagittarius: 60,
        Capricorn: 85,
        Aquarius: 55,
        Pisces: 60
    },
    Libra: {
        Aries: 65,
        Taurus: 70,
        Gemini: 80,
        Cancer: 65,
        Leo: 75,
        Virgo: 65,
        Libra: 50,
        Scorpio: 70,
        Sagittarius: 80,
        Capricorn: 60,
        Aquarius: 70,
        Pisces: 65
    },
    Scorpio: {
        Aries: 75,
        Taurus: 65,
        Gemini: 60,
        Cancer: 80,
        Leo: 70,
        Virgo: 75,
        Libra: 70,
        Scorpio: 50,
        Sagittarius: 65,
        Capricorn: 70,
        Aquarius: 60,
        Pisces: 80
    },
    Sagittarius: {
        Aries: 85,
        Taurus: 55,
        Gemini: 85,
        Cancer: 60,
        Leo: 85,
        Virgo: 60,
        Libra: 80,
        Scorpio: 65,
        Sagittarius: 50,
        Capricorn: 60,
        Aquarius: 70,
        Pisces: 65
    },
    Capricorn: {
        Aries: 50,
        Taurus: 80,
        Gemini: 55,
        Cancer: 70,
        Leo: 60,
        Virgo: 85,
        Libra: 60,
        Scorpio: 70,
        Sagittarius: 60,
        Capricorn: 50,
        Aquarius: 60,
        Pisces: 65
    },
    Aquarius: {
        Aries: 60,
        Taurus: 50,
        Gemini: 85,
        Cancer: 55,
        Leo: 70,
        Virgo: 55,
        Libra: 70,
        Scorpio: 60,
        Sagittarius: 70,
        Capricorn: 60,
        Aquarius: 50,
        Pisces: 60
    },
    Pisces: {
        Aries: 70,
        Taurus: 70,
        Gemini: 60,
        Cancer: 85,
        Leo: 65,
        Virgo: 60,
        Libra: 65,
        Scorpio: 80,
        Sagittarius: 65,
        Capricorn: 65,
        Aquarius: 60,
        Pisces: 50
    }
};

function getCompatibility(sign1: keyof AstrologicalSign, sign2: keyof AstrologicalSign): number {

    if (compatibilityTable[sign1] && compatibilityTable[sign1][sign2] !== undefined) {
        return compatibilityTable[sign1][sign2];
    }

    return 0;
}

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

export default function Astro() {

    const router = useRouter();

    const [client1, setData1] = useState<Client>();
    const [client2, setData2] = useState<Client>();
    const [compatibility, setCompatibility] = useState<number>(0);

    const params = useParams();
    const id1 = params.id1;
    const id2 = params.id2;

    useEffect(() => {
        const fetchData1 = async () => {
            try {
                const response = await sendPostRequest(
                  "http://localhost/client_profile.php",
                  {id: id1}
                );
                
                const data = JSON.parse(response);
                setData1(data.data);
                console.log(data);
              } catch (error) {
                console.error("Erreur lors de la requête : ", error);
              }
        };

        const fetchData2 = async () => {
            try {
                const response = await sendPostRequest(
                  "http://localhost/client_profile.php",
                  {id: id2}
                );
                
                const data = JSON.parse(response);
                setData2(data.data);
                console.log(data);
              } catch (error) {
                console.error("Erreur lors de la requête : ", error);
              }
        };

        fetchData1();
        fetchData2();

    }, []);

    useEffect(() => {
        if (client1 && client2) {
            setCompatibility(getCompatibility(client1.astrological_sign as keyof AstrologicalSign, client2.astrological_sign as keyof AstrologicalSign));
        }
    }, [client1, client2]);

    const birthDateToAge = (birthDate: string) => {
        const today = new Date();
        const birthDateFormatted = new Date(birthDate);
        let age = today.getFullYear() - birthDateFormatted.getFullYear();
        const month = today.getMonth() - birthDateFormatted.getMonth();
        if (month < 0 || (month === 0 && today.getDate() < birthDateFormatted.getDate())) {
            age--;
        }
        return age;
    }

    const adressSplit = (address: string) => {
        const addressArray = address.split(/\d{5}/);
        return addressArray
    }

    if (!client1 || !client2) return <div>Loading...</div>;

    return (
        <div className="ml-6 sm:mr-6 mr-6 mb-5">
            <div className='flex justify-between'>
                <div>
                    <h1 className='md:text-3xl sm:text-2xl text-xl font-semibold'>Compatibilité Astrologique</h1>
                    <h2 className='mt-4 text-sm text-slate-700'>Choisissez deux personnes et analyser leur compatibilité.</h2>
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
            <div className='flex justify-center mt-5'>
                <div className='p-5 lg:w-2/3 w-full bg-white mt-3 border rounded-lg border-slate-200'>
                    <div className=''>
                        <div className='flex justify-center'>
                            <p
                                className={`ml-2 text-3xl font-semibold ${
                                    compatibility <= 60 ? 'text-red-500' :
                                    compatibility <= 75 ? 'text-yellow-500' :
                                    compatibility <= 90 ? 'text-green-300' :
                                    'text-green-700'
                                }`}
                            >
                                {compatibility} %
                            </p>
                        </div>
                        {compatibility > 0 && <ProgressBar data={compatibility} />}
                    </div>
                </div>
            </div>
            <div className='lg:flex lg:justify-around'>
            <div className='lg:flex-1 bg-white rounded-lg p-5 mt-5 lg:w-1/2 border lg:max-w-xl lg:min-w-xl'>
                    <div className=''>
                        <div>
                            <div className='md:flex justify-between pb-5 border-b'>
                                <div className='flex'>
                                    <img className="w-20 h-20 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500" src={client1.image} alt="Bordered avatar" />
                                    <div className='ml-5 mt-3'>
                                        <p className=''>{client1.name}</p>
                                        <p className='text-slate-400'>{client1.birth_date}</p>
                                    </div>
                                </div>
                                <div className='mt-3 md:ml-24 md:mt-0 mt-5'>
                                    <button type="button" onClick={() => router.replace(`/customers/${client1.id}`)} className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2">
                                        Go to Profile
                                    </button>
                                </div>
                            </div>
                            <div className='mt-7'>
                                <div className='mt-7'>
                                    <div className='flex flex-col gap-5 ml-10 mr-10'>
                                    <div className='md:flex justify-between'>
                                            <div>
                                                <div className='flex'>
                                                    <MailCheck className='mt-1 mr-2 text-slate-400' size={18} />
                                                    <p className='text-slate-400'>Email</p>
                                                </div>
                                                <p className='sm:text-lg text-xs'>{client1.email}</p>
                                            </div>
                                            <div className='md:text-right md:mt-0 mt-3'>
                                                <div className='flex'>
                                                    <HeartPulse className='mt-1 mr-2 text-slate-400' size={18} />
                                                    <p className='text-slate-400'>Genre</p>
                                                </div>
                                                <p className='sm:text-lg text-xs'>{client1.gender}</p>
                                            </div>
                                        </div>
                                        <div className='md:flex justify-between'>
                                            <div>
                                                <div className='flex'>
                                                    <MapPin className='mt-1 mr-2 text-slate-400' size={18} />
                                                    <p className='text-slate-400'>Location</p>
                                                </div>
                                                <p className='sm:text-lg text-xs'>{adressSplit(client1.address)}</p>
                                            </div>
                                            <div className='md:text-right md:mt-0 mt-3'>
                                                <div className='flex'>
                                                    <ArrowUp01 className='mt-1 mr-2 text-slate-400' size={18} />
                                                    <p className='text-slate-400'>Age</p>
                                                </div>
                                                <p className='sm:text-lg text-xs'>{birthDateToAge(client1.birth_date)}</p>
                                            </div>
                                        </div>
                                        <div className='md:flex justify-between'>
                                            <div>
                                                <div className='flex'>
                                                    <Phone className='mt-1 mr-2 text-slate-400' size={18} />
                                                    <p className='text-slate-400'>Téléphone</p>
                                                </div>
                                                <p className='sm:text-lg text-xs'>{client1.phone}</p>
                                            </div>
                                            <div className='md:text-right md:mt-0 mt-3'>
                                                <div className='flex'>
                                                    <Telescope className='mt-1 mr-2 text-slate-400' size={18} />
                                                    <p className='text-slate-400'>Signe Astrologique</p>
                                                </div>
                                                <p className='sm:text-lg text-xs'>{client1.astrological_sign}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='border border-slate-200 mt-5 mr-5 ml-5'></div>
                                    <div className='flex justify-center mt-3'>
                                        <p className='text-slate-400'>Description</p>
                                    </div>
                                    <div className='flex justify-center mt-3'>
                                    <p className='sm:text-lg text-xs'>{client1.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Heartbeat compatibility={compatibility}/>
                <div className='flex-1 bg-white rounded-lg p-5 mt-5 lg:w-12/12 w-12/12 border lg:max-w-xl lg:min-w-xl'>
                    <div className=''>
                        <div>
                            <div className='md:flex justify-between pb-5 border-b'>
                                <div className='flex'>
                                    <img className="w-20 h-20 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500" src={client2.image} alt="Bordered avatar" />
                                    <div className='ml-5 mt-3'>
                                        <p className=''>{client2.name}</p>
                                        <p className='text-slate-400'>{client2.birth_date}</p>
                                    </div>
                                </div>
                                <div className='mt-3 md:ml-24 md:mt-0 mt-5'>
                                    <button type="button" onClick={() => router.replace(`/customers/${client2.id}`)} className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2">
                                        Go to Profile
                                    </button>
                                </div>
                            </div>
                            <div className='mt-7'>
                                <div className='mt-7'>
                                    <div className='flex flex-col gap-5 ml-10 mr-10'>
                                        <div className='md:flex justify-between'>
                                            <div>
                                                <div className='flex'>
                                                    <MailCheck className='mt-1 mr-2 text-slate-400' size={18} />
                                                    <p className='text-slate-400'>Email</p>
                                                </div>
                                                <p className='sm:text-lg text-xs'>{client2.email}</p>
                                            </div>
                                            <div className='md:text-right md:mt-0 mt-3'>
                                                <div className='flex'>
                                                    <HeartPulse className='mt-1 mr-2 text-slate-400' size={18} />
                                                    <p className='text-slate-400'>Genre</p>
                                                </div>
                                                <p className='sm:text-lg text-xs'>{client2.gender}</p>
                                            </div>
                                        </div>
                                        <div className='md:flex justify-between'>
                                            <div>
                                                <div className='flex'>
                                                    <MapPin className='mt-1 mr-2 text-slate-400' size={18} />
                                                    <p className='text-slate-400'>Location</p>
                                                </div>
                                                <p className='sm:text-lg text-xs'>{adressSplit(client2.address)}</p>
                                            </div>
                                            <div className='md:text-right md:mt-0 mt-3'>
                                                <div className='flex'>
                                                    <ArrowUp01 className='mt-1 mr-2 text-slate-400' size={18} />
                                                    <p className='text-slate-400'>Age</p>
                                                </div>
                                                <p className='sm:text-lg text-xs'>{birthDateToAge(client2.birth_date)}</p>
                                            </div>
                                        </div>
                                        <div className='md:flex justify-between'>
                                            <div>
                                                <div className='flex'>
                                                    <Phone className='mt-1 mr-2 text-slate-400' size={18} />
                                                    <p className='text-slate-400'>Téléphone</p>
                                                </div>
                                                <p className='sm:text-lg text-xs'>{client2.phone}</p>
                                            </div>
                                            <div className='md:text-right md:mt-0 mt-3'>
                                                <div className='flex'>
                                                    <Telescope className='mt-1 mr-2 text-slate-400' size={18} />
                                                    <p className='text-slate-400'>Signe Astrologique</p>
                                                </div>
                                                <p className='sm:text-lg text-xs'>{client2.astrological_sign}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='border border-slate-200 mt-5 mr-5 ml-5'></div>
                                    <div className='flex justify-center mt-3'>
                                        <p className='text-slate-400'>Description</p>
                                    </div>
                                    <div className='flex justify-center mt-3'>
                                         <p className='sm:text-lg text-xs'>{client2.description}</p>
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
