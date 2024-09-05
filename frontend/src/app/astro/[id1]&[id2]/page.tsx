"use client";
import React from 'react';
import { ArrowLeft, MailCheck, MapPin, HeartPulse, ArrowUp01, Phone, Telescope } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProgressBar from '../../components/charts/progress';
import PriceChart from '../../components/charts/price';

export default function Astro() {
    const router = useRouter();

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
            <div className='p-5 w-2/3 bg-white mt-3 border rounded-lg border-slate-200'>
                <div className=''>
                    <div className='flex justify-center'>
                        <p>Pourcentage : 75%</p>
                    </div>
                    <ProgressBar />
                </div>
            </div>
        </div>
        <div className='lg:flex justify-around'>
            <div className='bg-white rounded-lg p-5 mt-5 lg:w-12/12 border lg:mr-7'>
                <div className='flex'>
                    <div>
                        <div className='flex justify-between pb-5 border-b'>
                            <div className='flex'>
                                <img className="w-20 h-20 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500" src="/docs/images/people/profile-picture-5.jpg" alt="Bordered avatar" />
                                <div className='ml-5 mt-3'>
                                    <p className=''>Quentin Bolloré</p>
                                    <p className='text-slate-400'>2000 / 12 / 03</p>
                                </div>
                            </div>
                            <div className='mt-3 ml-24'>
                            <button type="button" className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2">
                                Go to Profile
                                </button>
                            </div>
                        </div>
                        <div className='mt-7'>
                        <div className='mt-7'>
                            <div className='flex flex-col gap-5 ml-10 mr-10'>
                                <div className='flex justify-between'>
                                <div>
                                    <div className='flex'>
                                        <MailCheck className='mt-1 mr-2 text-slate-400' size={18}/>
                                        <p className='text-slate-400'>Email</p>
                                    </div>
                                    <p>quentinbollore@gmail.com</p>
                                </div>
                                <div className='text-right'>
                                <div className='flex'>
                                        <MapPin className='mt-1 mr-2 text-slate-400' size={18}/>
                                        <p className='text-slate-400'>Location</p>
                                    </div>
                                    <p>456 Elm St</p>
                                </div>
                                </div>
                                <div className='flex justify-between'>
                                <div>
                                    <div className='flex'>
                                        <ArrowUp01 className='mt-1 mr-2 text-slate-400' size={18}/>
                                        <p className='text-slate-400'>Age</p>
                                    </div>
                                    <p>24</p>
                                </div>
                                <div className='text-right'>
                                    <div className='flex'>
                                        <HeartPulse className='mt-1 mr-2 text-slate-400' size={18}/>
                                        <p className='text-slate-400'>Genre</p>
                                    </div>
                                    <p>Homme</p>
                                </div>
                                </div>
                                <div className='flex justify-between'>
                                <div>
                                    <div className='flex'>
                                        <Phone className='mt-1 mr-2 text-slate-400' size={18}/>
                                        <p className='text-slate-400'>Téléphone</p>
                                    </div>
                                    <p>06.54.23.34.89</p>
                                </div>
                                <div className='text-right'>
                                    <div className='flex'>
                                        <Telescope className='mt-1 mr-2 text-slate-400' size={18}/>
                                        <p className='text-slate-400'>Signe Astrologique</p>
                                    </div>
                                    <p>Cancer</p>
                                </div>
                                </div>
                            </div>
                            <div className='border border-slate-200 mt-5 mr-5 ml-5'></div>
                                <div className='flex justify-center mt-3'>
                                    <p className='text-slate-400'>Description </p>
                                </div>
                                <p>I am looking for someone to share moments of complicity and laughter with.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='bg-white rounded-lg p-5 mt-5 lg:w-12/12 border lg:mr-7'>
            <div className='flex'>
                    <div>
                        <div className='flex justify-between pb-5 border-b'>
                            <div className='flex'>
                                <img className="w-20 h-20 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500" src="/docs/images/people/profile-picture-5.jpg" alt="Bordered avatar" />
                                <div className='ml-5 mt-3'>
                                    <p className=''>Quentin Bolloré</p>
                                    <p className='text-slate-400'>2000 / 12 / 03</p>
                                </div>
                            </div>
                            <div className='mt-3 ml-24'>
                            <button type="button" className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2">
                                Go to Profile
                                </button>
                            </div>
                        </div>
                        <div className='mt-7'>
                        <div className='mt-7'>
                            <div className='flex flex-col gap-5 ml-10 mr-10'>
                                <div className='flex justify-between'>
                                <div>
                                    <div className='flex'>
                                        <MailCheck className='mt-1 mr-2 text-slate-400' size={18}/>
                                        <p className='text-slate-400'>Email</p>
                                    </div>
                                    <p>quentinbollore@gmail.com</p>
                                </div>
                                <div className='text-right'>
                                <div className='flex'>
                                        <MapPin className='mt-1 mr-2 text-slate-400' size={18}/>
                                        <p className='text-slate-400'>Location</p>
                                    </div>
                                    <p>456 Elm St</p>
                                </div>
                                </div>
                                <div className='flex justify-between'>
                                <div>
                                    <div className='flex'>
                                        <ArrowUp01 className='mt-1 mr-2 text-slate-400' size={18}/>
                                        <p className='text-slate-400'>Age</p>
                                    </div>
                                    <p>24</p>
                                </div>
                                <div className='text-right'>
                                    <div className='flex'>
                                        <HeartPulse className='mt-1 mr-2 text-slate-400' size={18}/>
                                        <p className='text-slate-400'>Genre</p>
                                    </div>
                                    <p>Homme</p>
                                </div>
                                </div>
                                <div className='flex justify-between'>
                                <div>
                                    <div className='flex'>
                                        <Phone className='mt-1 mr-2 text-slate-400' size={18}/>
                                        <p className='text-slate-400'>Téléphone</p>
                                    </div>
                                    <p>06.54.23.34.89</p>
                                </div>
                                <div className='text-right'>
                                    <div className='flex'>
                                        <Telescope className='mt-1 mr-2 text-slate-400' size={18}/>
                                        <p className='text-slate-400'>Signe Astrologique</p>
                                    </div>
                                    <p>Cancer</p>
                                </div>
                                </div>
                            </div>
                            <div className='border border-slate-200 mt-5 mr-5 ml-5'></div>
                                <div className='flex justify-center mt-3'>
                                    <p className='text-slate-400'>Description </p>
                                </div>
                                <p>I am looking for someone to share moments of complicity and laughter with.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};