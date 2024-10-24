
import React from 'react';

const LupaPassword = () => {
  return (
    <div>
      {/* Main content with vertical scroll */}
      <div className='flex-1 overflow-y-auto'>
        {/* Navbar */}
        <nav className="bg-gray-900 shadow-lg">
          <div className="container mx-auto px-4 h-16 flex justify-center items-center">
            <h1 className="text-white text-xl font-bold">Panduan Lupa Password</h1>
          </div>
        </nav>

        {/* Guide Content */}
        <div className="bg-gray-900 text-white py-8">
          <div className="container mx-auto px-4">
            {/* Step 1 */}
            <div className="mb-8">
              <p className="mb-4">
              1. Pada Halaman Login , silahkan klik Lupa Password</p>
              <img src={Lupa} alt="Lupa Password" className="mb-4" />
            </div>

            {/* Step 2 */}
            <div className="mb-8">
              <p className="mb-4">
              2. Kemudian anda akan diarahkan ke halaman pemulihan akun, dan isi Email berdasarkan email akun yang anda daftarkan.
              Jika data yang anda isi salah, maka pada bar pengisian akan ada peringatan untuk melakukan pengisian ulang dengan benar
              </p>
              <img src={EmailPass} alt="Ganti Password" className="mb-4" />
            </div>

            {/* Step 3 */}
            <div className="mb-8">
              
              <p className="mb-4">
              3. Dan jika data yang anda isi benar maka perubahan password anda berhasil, dan klik lanjut masuk. Anda Otomatis diarahkan ke Halaman Login
              </p>
              <img src={PasswordBerhasil} alt="Ganti Password Berhasil" className="mb-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LupaPassword;