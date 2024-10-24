import React from 'react';

const PanduanRegistrasi = () => {
  return (
    <div className="p-8 bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
      <h1 className="text-4xl font-bold mb-6">Panduan Registrasi</h1>
      <p className="text-lg mb-4">
        Berikut adalah langkah-langkah untuk melakukan registrasi.
      </p>
      <ul className="list-decimal list-inside">
        <li className="mb-2">Buka halaman utama dan klik tombol "Hello, Sign in".</li>
        <li className="mb-2">Pilih "Daftar" pada halaman login.</li>
        <li className="mb-2">Isi formulir registrasi dengan data yang diminta.</li>
        <li className="mb-2">Klik tombol "Daftar" untuk menyelesaikan proses registrasi.</li>
      </ul>
    </div>
  );
};

export default PanduanRegistrasi;
