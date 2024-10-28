import React from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import HomeJualAset from '../../assets/Panduan/HomeJualAset.png';
import Dashboard from '../../assets/Panduan/Dashboard.png';
import ManageAssetImg from '../../assets/Panduan/ManageAssetImg.png';
import File from '../../assets/Panduan/File.png';
import AddAssetImg from '../../assets/Panduan/AddAssetImg.png';
import AddImage from '../../assets/Panduan/AddImage.png';

// Jangan lupa Install npm install react-medium-image-zoom

const JualAsset = () => {
  return (
    <div>
      {/* Main content with vertical scroll */}
      <div className='flex-1 overflow-y-auto'>
        {/* Navbar */}
        <nav className="bg-gray-900 shadow-lg">
          <div className="container mx-auto px-4 h-16 flex justify-center items-center">
            <h1 className="text-white text-xl font-bold">Panduan Jual Asset</h1>
          </div>
        </nav>

        {/* Guide Content */}
        <div className="bg-gray-900 text-white py-8">
          <div className="container mx-auto px-4">
            {/* Step 1 */}
            <div className="mb-16">
              <p className="mb-4">
                1. Pastikan anda sudah mendaftar akun di PixelStore dan Login menggunakan akun yang terdaftar.
              </p>
            </div>

            {/* Step 2 */}
            <div className="mb-16">
              <p className="mb-4">
                2. Kemudian pada halaman Landing Page, klik Jual Asset dan pilih menu Mulai Jual Asset seperti gambar dibawah.
              </p>
              <Zoom>
                <img src={HomeJualAset} alt="Jual Asset" className="w-full max-w-sm mx-auto" />
              </Zoom>
            </div>

            {/* Step 3 */}
            <div className="mb-16">
              <p className="mb-4">
                3. Setelah itu anda akan diarahkan ke halaman Dashboard untuk mengatur asset yang dijual.
              </p>
              <Zoom>
                <img src={Dashboard} alt="Halaman Asset Market" className="w-full max-w-sm mx-auto" />
              </Zoom>
            </div>

            {/* Step 4 */}
            <div className="mb-16">
              <p className="mb-4">
                4. Pada Halaman ini anda dapat memilih konten apa yang anda akan Upload ke PixelStore dan yang akan anda jual nantinya.
              </p>
            </div>

            {/* Step 5 */}
            <div className="mb-16">
              <p className="mb-4">
                5. Sebagai contoh, jika Anda ingin menjual gambar sebagai asset gambar, klik 'Manage Asset Image' di sidebar, kemudian pilih 'Add Image' untuk mengunggah gambar yang ingin dijual. Setelah itu, Anda akan diarahkan langsung ke halaman unggah asset gambar.
              </p>
              <Zoom>
                <img src={ManageAssetImg} alt="Manage Asset" className="w-full max-w-sm mx-auto" />
              </Zoom>
            </div>

            {/* Step 6 */}
            <div className="mb-16">
              <p className="mb-4">
                6. Di halaman "add asset image" unggah gambar yang ingin Anda jual. Anda akan langsung diarahkan ke file explorer untuk memilih gambar tersebut.
              </p>
              <Zoom>
                <img src={File} alt="Add Asset" className="w-full max-w-sm mx-auto" />
              </Zoom>
            </div>

            {/* Step 7 */}
            <div className="mb-16">
              <p className="mb-4">
                7. Setelah menambahkan gambar yang ingin dijual, lengkapi kolom "Image Name" sebagai nama gambar, pilih kategori yang sesuai, tambahkan deskripsi, dan tentukan harga untuk aset tersebut. Jika semua sudah sesuai, klik "Save" untuk menyimpan aset gambar Anda.
              </p>
              <Zoom>
                <img src={AddAssetImg} alt="Add Asset Image" className="w-full max-w-sm mx-auto" />
              </Zoom>
            </div>

            {/* Step 8 */}
            <div className="mb-16">
              <p className="mb-4">
                8. Setelah itu anda akan diarahkan ke halaman sebelumnya yaitu Halaman Add Image, dan pada halaman ini anda bisa melihat konten yang telah anda upload.
              </p>
              <Zoom>
                <img src={AddImage} alt="Dataset" className="w-full max-w-sm mx-auto" />
              </Zoom>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JualAsset;