import React from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import LandingPage from '../../assets/Panduan/LandingPage.png';
import Register from '../../assets/Panduan/Register.png';
import RegisterError from '../../assets/Panduan/RegisterError.png';
import BerhasilDaftar from '../../assets/Panduan/BerhasilDaftar.png';
import Login from '../../assets/Panduan/Login.png';

const PanduanRegistrasi = () => {
  return (
    <div className="flex-1 overflow-y-auto min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
      
      {/* Guide Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Step 1 */}
        <div className="mb-16">
          <p className="mb-4">
            1. Pada Halaman Home Silahkan Klik “Hello, Sign in” yang terdapat bagian atas kanan halaman lalu, klik “Log In” seperti yang ada di gambar.
          </p>
          <Zoom>
            <img src={LandingPage} alt="Landing Page" className="w-full max-w-lg mx-auto" />
          </Zoom>
        </div>

        {/* Step 2 */}
        <div className="mb-16">
          <p className="mb-4">
            2. Kemudian akan diarahkan ke halaman Register, kemudian isi data yang diminta seperti First Name, Last Name, Email, Username, dan Password. Jika sudah klik masuk/daftar.
          </p>
          <Zoom>
            <img src={Register} alt="Register" className="w-full max-w-lg mx-auto" />
          </Zoom>
        </div>

        {/* Step 3 */}
        <div className="mb-16">
          <p className="mb-4">
            3. Pastikan data sudah terisi semua jika tidak maka akan muncul pemberitahuan untuk mengisi dengan benar, seperti gambar di bawah ini.
          </p>
          <Zoom>
            <img src={RegisterError} alt="Error" className="w-full max-w-lg mx-auto" />
          </Zoom>
        </div>

        {/* Step 4 */}
        <div className="mb-16">
          <p className="mb-4">
            4. Jika data Anda sudah memenuhi syarat maka pendaftaran akun Anda telah berhasil, muncul PopUp "Berhasil melakukan pendaftaran" dan langsung diarahkan ke halaman login.
          </p>
          <Zoom>
            <img src={BerhasilDaftar} alt="Daftar Berhasil" className="w-full max-w-lg mx-auto" />
          </Zoom>
        </div>

        {/* Step 5 */}
        <div className="mb-16">
          <p className="mb-4">
            5. Silahkan mengisi Username dan password menggunakan akun yang sudah didaftarkan di halaman login.
          </p>
          <Zoom>
            <img src={Login} alt="Login" className="w-full max-w-lg mx-auto" />
          </Zoom>
        </div>
      </div>
    </div>
  );
};

export default PanduanRegistrasi;