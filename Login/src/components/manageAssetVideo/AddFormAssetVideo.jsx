import Breadcrumb from "../breadcrumbs/Breadcrumbs";
import IconField from "../../assets/icon/iconField/icon.svg";
import HeaderNav from "../HeaderNav/HeaderNav";

function AddNewVideo() {
  return (
    <>
      <div className="bg-primary-100 dark:bg-neutral-20 font-poppins  h-full min-h-screen">
        <div className="bg-primary-100 p-4 mt-12">
          <HeaderNav />
        </div>

        <div className="overflow-scroll ">
          <div className="bg-primary-100 dark:bg-neutral-20 dark:text-primary-100 flex flex-col">
            <div className="text-2xl dark:text-primary-100 p-4">
              <Breadcrumb />
            </div>
          </div>

          <form className="w-full  h-[1434px] gap-[50px] sm:p-0 md:p-0 lg:p-0 xl:p-5 2xl:p-28 overflow-hidden  mt-4 sm:mt-10 md:mt-0 lg:-mt-20 xl:mt-0 2xl:-mt-20">
            <h1 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px]  xl:text-[14px] font-bold text-neutral-10 dark:text-primary-100 p-4">
              Add New Video
            </h1>
            <div className="p-8 -mt-4  bg-primary-100  dark:bg-neutral-20 rounded-sm shadow-lg">
              <h2 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px]  xl:text-[14px] font-bold text-neutral-20 dark:text-primary-100">
                Video Information
              </h2>

              <div className="flex flex-col md:flex-row sm:gap-[140px] md:gap-[149px] lg:gap-[150px] mt-4 sm:mt-10 md:mt-10 lg:mt-10 xl:mt-10 2xl:mt-10 ">
                <div className="w-full sm:w-full md:w-[280px] lg:w-[290px] xl:w-[350px] 2xl:w-[220px] ">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px]  xl:text-[14px]  font-bold text-neutral-20 dark:text-primary-100">
                      Video Name
                    </h3>
                    <img
                      src={IconField}
                      alt=""
                      className="w-2 sm:w-2 md:w-4 lg:w-4 xl:w-4 2xl:w-4 h-2 sm:h-2 md:h-4 lg:h-4 xl:h-4 2xl:h-4 -mt-5"
                    />
                  </div>
                  <p className="w-2/2 text-neutral-60 dark:text-primary-100 mt-4 text-justify text-[10px] sm:text-[10px] md:text-[12px] lg:text-[14px]  xl:text-[12px] mb-2">
                    Masukkan Nama Untuk Video Maximal 40 Huruf
                  </p>
                </div>
                <div className="flex justify-start items-start w-full  sm:-mt-40 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0">
                  <label className="input input-bordered flex items-center gap-2 w-[686px]  sm:w-[686px] md:w-[420px] lg:w-[650px] xl:w-full h-[40px] sm:h-[48px] md:h-[48px] lg:h-[48px] xl:h-[48px] 2xl:h-[48px] border border-neutral-60 rounded-md p-2 bg-primary-100 dark:bg-neutral-20 dark:text-primary-100">
                    <input
                      type="Type Here"
                      className="input border-0 focus:outline-none focus:ring-0 w-full text-neutral-20 text-[10px] sm:text-[10px] md:text-[14px] lg:text-[14px]  xl:text-[14px]"
                      placeholder="Type"
                      required
                    />
                  </label>
                </div>
              </div>
              {/* <div className="flex flex-col md:flex-row sm:gap-[140px] md:gap-[149px] lg:gap-[150px] mt-4 sm:mt-10 md:mt-10 lg:mt-10 xl:mt-10 2xl:mt-10 ">
                <div className="w-full sm:w-full md:w-[280px] lg:w-[290px] xl:w-[350px] 2xl:w-[220px]">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px]  xl:text-[14px]  font-bold text-neutral-20 dark:text-primary-100">
                      Category
                    </h3>
                    <img
                      src={IconField}
                      alt=""
                      className="w-2 sm:w-2 md:w-4 lg:w-4 xl:w-4 2xl:w-4 h-2 h:w-2 md:h-4 lg:h-4 xl:h-4 2xl:h-4 -mt-5"
                    />
                  </div>
                  <p className="w-2/2 mb-2 text-neutral-60 dark:text-primary-100 mt-4 text-justify text-[10px] sm:text-[10px] md:text-[12px] lg:text-[14px]  xl:text-[12px]">
                    Nama username maximal 100 karakter dan jangan menggunakan
                    simbol atau angka.
                  </p>
                </div>
                <div className="flex justify-start items-start w-full  sm:-mt-40 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0">
                  <label className="input input-bordered flex items-center gap-2 w-[686px]  sm:w-[686px] md:w-[420px] lg:w-[650px] xl:w-full h-[40px] sm:h-[48px] md:h-[48px] lg:h-[48px] xl:h-[48px] 2xl:h-[48px] border border-neutral-60 rounded-md p-2 bg-primary-100 dark:bg-neutral-20 dark:text-primary-100">
                    <input
                      type="text"
                      className="input border-0 focus:outline-none focus:ring-0 w-full text-neutral-20 text-[10px] sm:text-[12px] md:text-[14px] lg:text-[14px]  xl:text-[14px]"
                      placeholder="Username"
                      required
                    />
                  </label>
                </div>
              </div> */}
              <div className="flex flex-col md:flex-row sm:gap-[140px] md:gap-[149px] lg:gap-[150px] mt-4 sm:mt-10 md:mt-10 lg:mt-10 xl:mt-10 2xl:mt-10 ">
                <div className="w-full sm:w-full md:w-[280px] lg:w-[290px] xl:w-[350px] 2xl:w-[220px]">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px]  xl:text-[14px]  font-bold text-neutral-20 dark:text-primary-100">
                      Kategori
                    </h3>
                    <img
                      src={IconField}
                      alt=""
                      className="w-2 sm:w-2 md:w-4 lg:w-4 xl:w-4 2xl:w-4 h-2 h:w-2 md:h-4 lg:h-4 xl:h-4 2xl:h-4 -mt-5"
                    />
                  </div>
                  <p className="w-2/2 mb-2 text-neutral-60 dark:text-primary-100 mt-4 text-justify text-[10px] sm:text-[10px] md:text-[12px] lg:text-[14px]  xl:text-[12px]">
                    Pilih kategori yang sesuai karena biaya layanan akan
                    tergantung pada kategori. Jika pemilihan kategori kurang
                    sesuai, maka kategori akan diubah oleh Admin
                  </p>
                </div>
                <div className="flex gap-4 justify-center items-start w-full  sm:-mt-40 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0">
                  <label className="input input-bordered flex items-center gap-2 w-[686px] sm:w-[686px] md:w-[420px] lg:w-[650px] xl:w-full h-[40px] sm:h-[48px] md:h-[48px] lg:h-[48px] xl:h-[48px] 2xl:h-[48px] border border-neutral-60 rounded-md p-2 bg-primary-100 dark:bg-neutral-20 dark:text-primary-100 mx-auto ml-0">
                    <select
                      className="input border-0 focus:outline-none focus:ring-0 w-full text-neutral-20 text-[10px] sm:text-[12px] md:text-[14px] lg:text-[14px] xl:text-[14px] bg-primary-100 dark:bg-neutral-20 dark:text-primary-100 h-[30px] sm:h-[32px] md:h-[34px] lg:h-[36px] xl:h-[36px] p-1 "
                      name="role"
                      defaultValue="">
                      <option value="" disabled>
                        Pilih Kategori
                      </option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                  </label>
                  <div className="bg-blue-600">
                    <button className="btn"> + </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:gap-[140px] mt-4 sm:mt-10 md:mt-10 lg:mt-10 xl:mt-10 2xl:mt-10">
                <div className="w-full sm:w-[200px] md:w-[165px] lg:w-[200px] xl:w-[225px] 2xl:w-[175px]">
                  <h3 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px]  xl:text-[14px] font-bold text-neutral-20 dark:text-primary-100">
                    Upload Video
                  </h3>
                  <p className="w-2/2 text-neutral-60 dark:text-primary-100 mt-4 text-justify text-[10px] sm:text-[10px] md:text-[12px] lg:text-[14px]  xl:text-[12px] mb-2">
                    bisa di tuliskan keterangan minimum dan maksimal ukuran
                    video.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-10 sm:gap-2 md:gap-2 lg:gap-6 xl:gap-6 2xl:gap-10">
                  <div className="mt-2 md:ml-2 lg:ml-4 xl:ml-6 2xl:ml-4 flex justify-center items-center border border-dashed  border-neutral-60 w-[100px] h-[100px] sm:w-[100px] md:w-[120px] lg:w-[150px] sm:h-[100px] md:h-[120px] lg:h-[150px] xl:h-[150px] 2xl:h-[160px]">
                    <label
                      htmlFor="fileUpload"
                      className="flex flex-col justify-center items-center cursor-pointer text-center">
                      <img alt="" className="w-6 h-6" src="path_to_your_icon" />
                      <span className="text-primary-0 text-xs font-light mt-2 dark:text-primary-100">
                        Upload video
                      </span>
                      <input
                        type="file"
                        id="fileUpload"
                        name="product_images.image_url"
                        multiple
                        accept="image/jpeg,image/png,image/jpg"
                        className="hidden "
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row sm:gap-[140px] md:gap-[149px] lg:gap-[150px] mt-4 sm:mt-10 md:mt-10 lg:mt-10 xl:mt-10 2xl:mt-10 ">
                <div className="w-full sm:w-full md:w-[280px] lg:w-[290px] xl:w-[350px] 2xl:w-[220px]">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px]  xl:text-[14px]  font-bold text-neutral-20 dark:text-primary-100">
                      Deskripsi
                    </h3>
                    <img
                      src={IconField}
                      alt=""
                      className="w-2 sm:w-2 md:w-4 lg:w-4 xl:w-4 2xl:w-4 h-2 h:w-2 md:h-4 lg:h-4 xl:h-4 2xl:h-4 -mt-5"
                    />
                  </div>
                  <p className="w-2/2 mb-2 text-neutral-60 dark:text-primary-100 mt-4 text-justify text-[10px] sm:text-[10px] md:text-[12px] lg:text-[14px]  xl:text-[12px]">
                    Berikan Deskripsi Pada Video Anda Maximal 200 Huruf
                  </p>
                </div>
                <div className="flex justify-start items-start w-full  sm:-mt-40 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0">
                  <label className="input input-bordered flex items-center gap-2 w-[686px]  sm:w-[686px] md:w-[420px] lg:w-[650px] xl:w-full h-[40px] sm:h-[48px] md:h-[48px] lg:h-[48px] xl:h-[48px] 2xl:h-[48px] border border-neutral-60 rounded-md p-2 bg-primary-100 dark:bg-neutral-20 dark:text-primary-100">
                    <input
                      type="text"
                      className="input border-0 focus:outline-none focus:ring-0 w-full text-neutral-20 text-[10px] sm:text-[12px] md:text-[14px] lg:text-[14px]  xl:text-[14px]"
                      placeholder="Deskripsi"
                      required
                    />
                  </label>
                </div>
              </div>
              {/* <div className="flex flex-col md:flex-row sm:gap-[140px] md:gap-[149px] lg:gap-[150px] mt-4 sm:mt-10 md:mt-10 lg:mt-10 xl:mt-10 2xl:mt-10 ">
                <div className="w-full sm:w-full md:w-[280px] lg:w-[290px] xl:w-[350px] 2xl:w-[220px]">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px]  xl:text-[14px]  font-bold text-neutral-20 dark:text-primary-100">
                      Last Name
                    </h3>
                    <img
                      src={IconField}
                      alt=""
                      className="w-2 sm:w-2 md:w-4 lg:w-4 xl:w-4 2xl:w-4 h-2 h:w-2 md:h-4 lg:h-4 xl:h-4 2xl:h-4 -mt-5"
                    />
                  </div>
                  <p className="w-2/2 mb-2 text-neutral-60 dark:text-primary-100 mt-4 text-justify text-[10px] sm:text-[10px] md:text-[12px] lg:text-[14px]  xl:text-[12px]">
                    Nama LastName maximal 100 karakter.
                  </p>
                </div>
                <div className="flex justify-start items-start w-full  sm:-mt-40 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0">
                  <label className="input input-bordered flex items-center gap-2 w-[686px]  sm:w-[686px] md:w-[420px] lg:w-[650px] xl:w-full h-[40px] sm:h-[48px] md:h-[48px] lg:h-[48px] xl:h-[48px] 2xl:h-[48px] border border-neutral-60 rounded-md p-2 bg-primary-100 dark:bg-neutral-20 dark:text-primary-100">
                    <input
                      type="text"
                    
                      className="input border-0 focus:outline-none focus:ring-0 w-full text-neutral-20 text-[10px] sm:text-[12px] md:text-[14px] lg:text-[14px]  xl:text-[14px]"
                      placeholder="Last Name"
                      required
                    />
                  </label>
                </div>
              </div> */}

              <div className="flex flex-col md:flex-row sm:gap-[140px] md:gap-[149px] lg:gap-[150px] mt-4 sm:mt-10 md:mt-10 lg:mt-10 xl:mt-10 2xl:mt-10 ">
                <div className="w-full sm:w-full md:w-[280px] lg:w-[290px] xl:w-[350px] 2xl:w-[220px]">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px]  xl:text-[14px]  font-bold text-neutral-20 dark:text-primary-100">
                      Harga
                    </h3>
                    <img
                      src={IconField}
                      alt=""
                      className="w-2 sm:w-2 md:w-4 lg:w-4 xl:w-4 2xl:w-4 h-2 h:w-2 md:h-4 lg:h-4 xl:h-4 2xl:h-4 -mt-5"
                    />
                  </div>
                  <p className="w-2/2 mb-2 text-neutral-60 dark:text-primary-100 mt-4 text-justify text-[10px] sm:text-[10px] md:text-[12px] lg:text-[14px]  xl:text-[12px]">
                    Masukkan Harga Untuk Video
                  </p>
                </div>
                <div className="flex justify-start items-start w-full  sm:-mt-40 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0">
                  <label className="input input-bordered flex items-center gap-2 w-[686px]  sm:w-[686px] md:w-[420px] lg:w-[650px] xl:w-full h-[40px] sm:h-[48px] md:h-[48px] lg:h-[48px] xl:h-[48px] 2xl:h-[48px] border border-neutral-60 rounded-md p-2 bg-primary-100 dark:bg-neutral-20 dark:text-primary-100">
                    <input
                      type="Rp"
                      className="input border-0 focus:outline-none focus:ring-0  w-full text-neutral-20 text-[10px] sm:text-[12px] md:text-[14px] lg:text-[14px]  xl:text-[14px]"
                      placeholder="Rp"
                      required
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="w-full inline-flex sm:gap-6 xl:gap-[21px] justify-center sm:justify-center md:justify-end  gap-6 mt-12 sm:mt-12 md:mt-14 lg:mt-14 xl:mt-12  ">
              <button className="btn bg-neutral-60 border-neutral-60 hover:bg-neutral-60 hover:border-neutral-60 rounded-lg  font-semibold   text-primary-100 text-center text-[10px]  sm:text-[14px] md:text-[18px] lg:text-[20px] xl:text-[14px] 2xl:text-[14px],  w-[90px] sm:w-[150px] md:w-[200px] xl:w-[200px] 2xl:w-[200px] ,  h-[30px] sm:h-[50px] md:h-[60px] lg:w-[200px] lg:h-[60px] xl:h-[60px] 2xl:h-[60px]">
                Cancel
              </button>
              <button
                type="submit"
                className="btn  bg-secondary-40 border-secondary-40 hover:bg-secondary-40 hover:border-secondary-40 rounded-lg  font-semibold leading-[24px]  text-primary-100 text-center  text-[10px]  sm:text-[14px] md:text-[18px] lg:text-[20px] xl:text-[14px] 2xl:text-[14px],  w-[90px] sm:w-[150px] md:w-[200px] xl:w-[200px] 2xl:w-[200px] ,  h-[30px] sm:h-[50px] md:h-[60px] lg:w-[200px] lg:h-[60px] xl:h-[60px] 2xl:h-[60px]">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddNewVideo;
