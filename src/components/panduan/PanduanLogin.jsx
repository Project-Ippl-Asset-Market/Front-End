import React from "react";
import Login from "../../assets/Asset_Panduan/assets/SignIn.png";
import Login2 from "../../assets/Asset_Panduan/assets/Daftar.png";
import LoginBerhasil from "../../assets/Asset_Panduan/assets/LoginBerhasil.png";
import LoginGagal from "../../assets/Asset_Panduan/assets/LoginGagal.png";
import SidebarPanduan from "./SidebarPanduan";

const PanduanLogin = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <SidebarPanduan />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-100">
        {/* Main content with vertical scroll */}
        <div className="flex-1 overflow-y-auto">
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
                  1. Pada Halaman Home Silahkan Klik “Hello, Sign in” yang
                  terdapat bagian atas kanan halaman lalu , klik “Log In”
                  seperti yang ada di gambar.
                </p>
                <img src={Login} alt="Hello Sign In" className="mb-4" />
              </div>

              {/* Step 2 */}
              <div className="mb-8">
                <p className="mb-4">
                  2. Setelah itu anda akan diarakan ke halaman Log in, Isi data
                  berdasarkan data akun yang anda daftarkan sebelumnya di
                  PixelStore, atau anda dapat Log In menggunakan akun google.
                </p>
                <img src={Login2} alt="Log In" className="mb-4" />
              </div>

              {/* Step 3 */}
              <div className="mb-8">
                <p className="mb-4">
                  3. Setelah selesai mengisi data Login akun, jika data yang
                  anda isi benar, maka proses Login anda berhasil, dan Klik
                  Lanjut Masuk, dan langsung diarahkan ke halaman Home.
                </p>
                <img
                  src={LoginBerhasil}
                  alt="Login Berhasil"
                  className="mb-4"
                />
              </div>

              {/* Step 4 */}
              <div className="mb-8">
                <p className="mb-4">
                  4. Namun jika data yang anda isi tidak sesuai dengan data akun
                  yang anda daftarkan, maka proses Log In anda gagal, dan Klik
                  Ok untuk Isi data ulang
                </p>
                <img src={LoginGagal} alt="Login Gagal" className="mb-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanduanLogin;
