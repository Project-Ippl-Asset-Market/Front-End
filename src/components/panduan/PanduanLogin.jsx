
import React from 'react';
import LandingPage from '../../assets/Panduan/LandingPage.png'
import Login from '../../assets/Panduan/Login.png'
import LoginBerhasil from '../../assets/Panduan/LoginBerhasil.png'
import LoginGagal from '../../assets/Panduan/LoginGagal.png'
import LandingpageLog from '../../assets/Panduan/LandingpageLog.png'

const PanduanLogin = () => {
  return (
    <div>
      {/* Main content with vertical scroll */}
      <div className='flex-1 overflow-y-auto'>
        {/* Navbar */}
        <nav className="bg-gray-900 shadow-lg">
          <div className="container mx-auto px-4 h-16 flex justify-center items-center">
            <h1 className="text-white text-xl font-bold">Panduan Login</h1>
          </div>
        </nav>

        {/* Guide Content */}
        <div className="bg-gray-900 text-white py-8">
          <div className="container mx-auto px-4">
            {/* Step 1 */}
            <div className="mb-8">
              <p className="mb-4">
              1. Pada Halaman Home Silahkan Klik “Hello, Sign in” yang terdapat bagian atas kanan halaman lalu , klik “Login” seperti yang ada di gambar.
              </p>
              <img src={LandingPage} alt="Landing Page" className="mb-4" />
            </div>

            {/* Step 2 */}
            <div className="mb-8">
              <p className="mb-4">
              2. Setelah itu anda akan diarakan ke halaman Log in, Isi data berdasarkan data akun yang anda daftarkan sebelumnya di PixelStore, atau jika belum punya akun klik daftar.
              </p>
              <img src={Login} alt="Log In" className="mb-4" />
            </div>

            {/* Step 3 */}
            <div className="mb-8">
              
              <p className="mb-4">
              3. Setelah selesai mengisi data Login akun, jika data yang anda isi benar, maka Popup "login berhasil" ditampilkan, dan langsung diarahkan ke halaman Landing Page.
              </p>
              <img src={LoginBerhasil} alt="Login Berhasil" className="mb-4" />
            </div>

            {/* Step 4 */}
            <div className="mb-8">
              <p className="mb-4">
              4. Namun jika data yang anda isi tidak sesuai dengan data akun yang anda daftarkan, maka proses Log In anda gagal, dan Klik Ok untuk Isi data ulang
              </p>
              <img src={LoginGagal} alt="Login Gagal" className="mb-4" />
            </div>

            {/* Step 5 */}
            <div className="mb-8">
              <p className="mb-4">
              5. "Selamat datang di halaman utama Pixel Store. Silakan cari dan temukan asset yang Anda butuhkan."
              </p>
              <img src={LandingpageLog} alt="Landing Page Login" className="mb-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanduanLogin;