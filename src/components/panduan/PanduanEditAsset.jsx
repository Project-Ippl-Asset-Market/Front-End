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
    <div>
      {/* Main content with vertical scroll */}
      <div className='flex-1 overflow-y-auto'>
        {/* Navbar */}
        <nav className="bg-gray-900 shadow-lg">
          <div className="container mx-auto px-4 h-16 flex justify-center items-center">
            <h1 className="text-white text-xl font-bold">Panduan Edit/Hapus Asset</h1>
          </div>
        </nav>

        {/* Guide Content */}
        <div className="bg-gray-900 text-white py-8">
          <div className="container mx-auto px-4">
            {/* Step 1 */}
            <div className="mb-16">
              <p className="mb-4">
                1. Untuk mengedit/menghapus konten yang telah anda upload, anda bisa pergi ke halaman Manage Asset.
              </p>
            </div>

            {/* Step 2 */}
            <div className="mb-16">
              <p className="mb-4">
                2. Kemudian pada halaman Manage Asset, anda bisa memilih konten mana yang akan anda edit/Hapus dengan cara klik tombol 
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <img src={edit} alt="Edit" style={{ marginLeft: '5px', marginRight: '5px', verticalAlign: 'middle', height: '1em' }} />
                  untuk mengedit konten atau klik tombol 
                  <img src={hapus} alt="Hapus" style={{ marginLeft: '5px', marginRight: '5px', verticalAlign: 'middle', height: '1em' }} />
                  untuk menghapus konten.
                </span>
              </p>
              <Zoom>
                <img src={AddImageSudah} alt="Add Image" className="w-full max-w-sm mx-auto" />
              </Zoom>
            </div>

            {/* Step 3 */}
            <div className="mb-16">
              <p className="mb-4">
                3. Seperti pada halaman "Manage Asset Image," ketika Anda mengklik tombol edit, Anda akan diarahkan ke halaman edit aset. Di sana, Anda dapat melakukan perubahan pada aset sesuai kebutuhan, seperti pada gambar contoh.
              </p>
              <Zoom>
                <img src={AddAssetImg} alt="Add Dataset" className="w-full max-w-sm mx-auto" />
              </Zoom>
            </div>

            {/* Step 4 */}
            <div className="mb-16">
              <p className="mb-4">
                4. Setelah selesai mengedit informasi pada konten aset gambar, klik "Save" untuk menyimpan perubahan. Konten yang Anda edit akan ditampilkan di halaman "Manage Asset Image." Jika Anda ingin membatalkan perubahan, klik "Cancel."
              </p>
              <Zoom>
                <img src={AddImage} alt="Dataset" className="w-full max-w-sm mx-auto" />
              </Zoom>
            </div>

            {/* Step 5 */}
            <div className="mb-16">
              <p className="mb-4">
                5. Dan contoh ketika anda ingin menghapus konten, maka akan tampil pop up yang berisi peringatan.
              </p>
              <Zoom>
                <img src={PopupDelete} alt="Pop Up Delete" className="w-full max-w-sm mx-auto" />
              </Zoom>
            </div>

            {/* Step 6 */}
            <div className="mb-16">
              <p className="mb-4">
                6. Dari Pop up di atas klik Delete untuk menghapus konten, dan klik close untuk batal.
              </p>
            </div>

            {/* Step 7 */}
            <div className="mb-16">
              <p className="mb-4">
                7. Konten yang anda hapus akan hilang dari daftar isi konten.
              </p>
              <Zoom>
                <img src={Hilang} alt="Dataset Hilang" className="w-full max-w-sm mx-auto" />
              </Zoom>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAsset;