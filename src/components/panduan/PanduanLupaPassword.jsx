import React from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import Login from '../../assets/Asset_Panduan/assets/Login.png';
import EmailPass from '../../assets/Asset_Panduan/assets/EmailPass.png';

const LupaPassword = () => {
  return (
    <div className="flex-1 overflow-y-auto min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
      
      {/* Guide Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Step 1 */}
        <div className="mb-16">
          <p className="mb-4">
            1. Pada Halaman Login, silahkan klik Lupa Password
          </p>
          <Zoom>
            <img src={Login} alt="Lupa Password" className="w-full max-w-sm mx-auto" />
          </Zoom>
        </div>

        {/* Step 2 */}
        <div className="mb-16">
          <p className="mb-4">
            2. Kemudian anda akan diarahkan ke halaman pemulihan akun, dan isi Email berdasarkan email akun yang anda daftarkan.
            Jika data yang anda isi salah, maka pada bar pengisian akan ada peringatan untuk melakukan pengisian ulang dengan benar.
          </p>
          <Zoom>
            <img src={EmailPass} alt="Ganti Password" className="w-full max-w-sm mx-auto" />
          </Zoom>
        </div>

        {/* Step 3 */}
        <div className="mb-16">
          <p className="mb-4">
            3. Dan jika data yang anda isi benar maka perubahan password anda berhasil, dan klik lanjut masuk. Anda otomatis diarahkan ke Halaman Login.
          </p>
          <Zoom>
            <img src={EmailPass} alt="Ganti Password Berhasil" className="w-full max-w-sm mx-auto" />
          </Zoom>
        </div>
      </div>
    </div>
  );
};

export default LupaPassword;