"use client";

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';


export default function Statistics() {

    const router = useRouter();

    return (
        <div className="ml-6 sm:mr-6 mr-6 mb-5">
            <div className='flex justify-between'>
                <div>
                    <h1 className='md:text-2xl sm:text-1xl text-xl font-semibold'>Comparaison entre deux coaches</h1>
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
        </div>
    )
}