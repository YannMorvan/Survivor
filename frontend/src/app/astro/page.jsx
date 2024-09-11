"use client";
import React, { useEffect, useState } from 'react';
import Table from '../components/table';
import { sendPostRequest } from '../utils/utils';

export default function Astro() {

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchClientsData = async () => {
      try {
        const response = await sendPostRequest(
          `http://localhost/table_clients.php`,
          {}
        );
        
        const data = JSON.parse(response);
        setData(data);
      } catch (error) {
        console.error("Erreur lors de la requête : ", error);
      }
    };
  
    fetchClientsData();
  }, []);

  return (
    <div className="ml-6 sm:mr-6 mr-6 mb-5">
      <div>
        <h1 className='md:text-3xl sm:text-2xl text-xl font-semibold'>Compatibilité Astrologique</h1>
        <h2 className='mt-4 text-sm text-slate-700'>Choisissez deux personnes et analyser leur compatibilité.</h2>
      </div>
      <div className='mt-10'>
        <div>
          <Table data={data} />
        </div>
      </div>
    </div>
  );
};
