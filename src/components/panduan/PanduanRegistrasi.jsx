import React from "react";
import SignIn from "../../assets/Asset_Panduan/assets/SignIn.png";
import Daftar from "../../assets/Asset_Panduan/assets/Daftar.png";
import Daftar2 from "../../assets/Asset_Panduan/assets/Daftar2.png";
import DaftarBerhasil from "../../assets/Asset_Panduan/assets/DaftarBerhasil.png";
import DaftarGagal from "../../assets/Asset_Panduan/assets/DaftarGagal.png";
import SidebarPanduan from "./SidebarPanduan";

const PanduanRegistrasi = () => {
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
              <h1 className="text-white text-xl font-bold">
                Panduan Registrasi
              </h1>
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
                <img src={SignIn} alt="Hello Sign In" className="mb-4" />
              </div>

              {/* Step 2 */}
              <div className="mb-8">
                <p className="mb-4">
                  2. Kemudian akan diarahkan ke halaman Login , klik Daftar.
                </p>
                <img src={Daftar} alt="Log In" className="mb-4" />
              </div>

              {/* Step 3 */}
              <div className="mb-8">
                <p className="mb-4">
                  3. Setelah itu , akan diarahkan ke halaman daftar , kemudian
                  isi data yang diminta seperti First Name , Last Name ,Email ,
                  Username dan Password. Jika sudah klik masuk/daftar.
                </p>
                <img src={Daftar2} alt="Register" className="mb-4" />
              </div>

              {/* Step 4 */}
              <div className="mb-8">
                <p className="mb-4">
                  4. Jika data anda sudah memenuhi syarat maka pendaftaran akun
                  anda telah berhasil , dan silahkan lanjutkan masuk.
                </p>
                <img
                  src={DaftarBerhasil}
                  alt="Daftar Berhasil"
                  className="mb-4"
                />
              </div>

              {/* Step 5 */}
              <div className="mb-8">
                <p className="mb-4">
                  5. Namun jika data anda belum memenuhi syarat , maka
                  pendaftaran akun anda gagal, dan anda harus mengulang mengisi
                  data diri anda.
                </p>
                <img src={DaftarGagal} alt="Daftar Gagal" className="mb-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanduanRegistrasi;
