import React from "react";
import JualAset from "../../assets/Asset_Panduan/assets/JualAset.png";
import AssetMarket from "../../assets/Asset_Panduan/assets/AssetMarket.png";
import ManageAsset from "../../assets/Asset_Panduan/assets/ManageAsset.png";
import AddDataset from "../../assets/Asset_Panduan/assets/AddDataset.png";
import AddNewDataset from "../../assets/Asset_Panduan/assets/AddNewDataset.png";
import Dataset from "../../assets/Asset_Panduan/assets/Dataset.png";
import SidebarPanduan from "./SidebarPanduan";

const JualAsset = () => {
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
                Panduan Jual Asset
              </h1>
            </div>
          </nav>

          {/* Guide Content */}
          <div className="bg-gray-900 text-white py-8">
            <div className="container mx-auto px-4">
              {/* Step 1 */}
              <div className="mb-8">
                <p className="mb-4">
                  1. Pastikan anda sudah mendaftar akun di PixelStore dan Login
                  menggunakan akun yang terdaftar
                </p>
              </div>

              {/* Step 2 */}
              <div className="mb-8">
                <p className="mb-4">
                  2. Kemudian pada halaman Home, klik Jual Asset dan pilih menu
                  Mulai Jual Asset
                </p>
                <img src={JualAset} alt="Jual Asset" className="mb-4" />
              </div>

              {/* Step 3 */}
              <div className="mb-8">
                <p className="mb-4">
                  3. Setelah itu anda akan diarahkan ke halaman My Asset Market
                </p>
                <img
                  src={AssetMarket}
                  alt="Halaman Asset Market"
                  className="mb-4"
                />
              </div>

              {/* Step 4 */}
              <div className="mb-8">
                <p className="mb-4">
                  4. Pada Halaman My Asset Market anda dapat memilih konten apa
                  yang anda akan Upload ke PixelStore dan yang akan anda jual
                  nantinya
                </p>
              </div>

              {/* Step 5 */}
              <div className="mb-8">
                <p className="mb-4">
                  5. Seperti contoh ketika anda ingin menjual Asset Game, maka
                  anda akan diberikan pilihan untuk menjual jenis Asset Game
                  seperti Asset Game 2D, 3D, atau Asset Audio
                </p>
                <img src={ManageAsset} alt="Manage Asset" className="mb-4" />
              </div>

              {/* Step 6 */}
              <div className="mb-8">
                <p className="mb-4">
                  6. Ketika anda memilih Manage Asset 2D maka akan tampil
                  halaman di samping kanan yaitu halaman Manage Asset Game 2D,
                  kemudian klik New Dataset
                </p>
                <img src={AddDataset} alt="Add Asset" className="mb-4" />
              </div>

              {/* Step 7 */}
              <div className="mb-8">
                <p className="mb-4">
                  7. Setelah itu anda akan diarahkan ke halaman Add New Dataset,
                  di halaman ini anda bisa mengisi data informasi konten Asset
                  Game 2D yang akan anda jual nantinya seperti data Nama,
                  Kategori, Upload Asset Game 2D, Deskripsi, dan Harga. Setelah
                  selesai mengisi data informasi konten, silahkan klik tombol
                  Save. Harap isi data informasi konten sesuai ketentuan
                  PixelStore
                </p>
                <img src={AddNewDataset} alt="Add New Asset" className="mb-4" />
              </div>

              {/* Step 8 */}
              <div className="mb-8">
                <p className="mb-4">
                  8. Setelah itu anda akan diarahkan ke halaman sebelumnya yaitu
                  Halaman Add New Dataset, dan pada halaman ini anda bisa
                  melihat konten yang telah anda upload
                </p>
                <img src={Dataset} alt="Dataset" className="mb-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JualAsset;
