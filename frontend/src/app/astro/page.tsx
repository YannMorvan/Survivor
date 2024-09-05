import React from 'react';
import Table from '../components/table';

export default function Astro() {
  return (
    <div className="ml-6 sm:mr-6 mr-6 mb-5">
      <div>
        <h1 className='md:text-3xl sm:text-2xl text-xl font-semibold'>Compatibilité Astrologique</h1>
        <h2 className='mt-4 text-sm text-slate-700'>Choisissez deux personnes et analyser leur compatibilité.</h2>
      </div>
      <div className='mt-10'>
        <div>
          <Table />
        </div>
      </div>
    </div>
  );
};