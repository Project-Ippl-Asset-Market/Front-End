import React from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import AddImageSudah from '../../assets/Panduan/AddImageSudah.png';
import edit from '../../assets/Panduan/edit.png';
import hapus from '../../assets/Panduan/Hapus.png';
import AddAssetImg from '../../assets/Panduan/AddAssetImg.png';
import AddImage from '../../assets/Panduan/AddImage.png';
import PopupDelete from '../../assets/Panduan/PopupDelete.png';
import Hilang from '../../assets/Panduan/Hilang.png';

// Jangan lupa Install npm install react-medium-image-zoom

const EditAsset = () => {
  return (
    <div className="flex-1 overflow-y-auto min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
      
      {/* Guide Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Step 1 */}
        <div className="mb-16">
          <p className="mb-4">
            1. Untuk mengedit/menghapus konten yang telah Anda upload, pergi ke halaman Manage Asset.
          </p>
        </div>

        {/* Step 2 */}
        <div className="mb-16">
          <p className="mb-4">
            2. Di halaman Manage Asset, pilih konten yang ingin diedit atau dihapus dengan klik tombol 
            <span className="inline-flex items-center">
              <img src={edit} alt="Edit" className="mx-1 inline h-4" />
              untuk edit atau klik 
              <img src={hapus} alt="Hapus" className="mx-1 inline h-4" />
              untuk hapus.
            </span>
          </p>
          <Zoom>
            <img src={AddImageSudah} alt="Add Image" className="w-full max-w-lg mx-auto" />
          </Zoom>
        </div>

        {/* Step 3 */}
        <div className="mb-16">
          <p className="mb-4">
            3. Klik tombol edit untuk diarahkan ke halaman edit aset. Di sana, ubah aset sesuai kebutuhan, seperti contoh gambar berikut.
          </p>
          <Zoom>
            <img src={AddAssetImg} alt="Add Dataset" className="w-full max-w-lg mx-auto" />
          </Zoom>
        </div>

        {/* Step 4 */}
        <div className="mb-16">
          <p className="mb-4">
            4. Setelah mengedit informasi aset, klik "Save" untuk menyimpan perubahan atau "Cancel" untuk membatalkan.
          </p>
          <Zoom>
            <img src={AddImage} alt="Dataset" className="w-full max-w-lg mx-auto" />
          </Zoom>
        </div>

        {/* Step 5 */}
        <div className="mb-16">
          <p className="mb-4">
            5. Jika ingin menghapus konten, akan muncul pop-up konfirmasi.
          </p>
          <Zoom>
            <img src={PopupDelete} alt="Pop Up Delete" className="w-full max-w-lg mx-auto" />
          </Zoom>
        </div>

        {/* Step 6 */}
        <div className="mb-16">
          <p className="mb-4">
            6. Di pop-up, klik "Delete" untuk menghapus atau "Close" untuk membatalkan.
          </p>
        </div>

        {/* Step 7 */}
        <div className="mb-16">
          <p className="mb-4">
            7. Konten yang dihapus tidak lagi muncul di daftar isi.
          </p>
          <Zoom>
            <img src={Hilang} alt="Dataset Hilang" className="w-full max-w-lg mx-auto" />
          </Zoom>
        </div>
      </div>
    </div>
  );
};

export default EditAsset;