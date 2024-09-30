import HeaderNav from "../headerNavBreadcrumbs/Header";
import Breadcrumb from "../breadcrumbs/Breadcrumbs";
import IconField from "../../assets/icon/iconField/icon.svg";

function AddAdmin() {
  return (
    <>
      <div className="bg-primary-100 dark:bg-neutral-20 font-poppins  h-auto min-h-screen">
        <div className="bg-primary-100 p-4 mt-12">
          <HeaderNav />
        </div>

        <div className="bg-primary-100 dark:bg-neutral-20 dark:text-primary-100 flex flex-col">
          <div className="text-2xl dark:text-primary-100 p-4">
            <Breadcrumb />
          </div>
        </div>

        <div className="sm:w-[640px] md:w-[750px] lg:w-[1000px] xl:w-[1180px] 2xl:w-[1250px]  h-[1434px] gap-[50px] mx-auto  overflow-hidden  mt-10">
          <div>
            <h1 className="text-[24px] font-bold text-neutral-10 dark:text-primary-100 p-4">
              Add New Video
            </h1>
          </div>
          <div className="p-8 mt-2  bg-primary-100  dark:bg-neutral-20 rounded-sm shadow-lg">
            <h2 className="text-[20px] font-bold text-neutral-20 dark:text-primary-100">
              Profile Information
            </h2>
            <div className="flex flex-col md:flex-row md:gap-[149px] mt-10">
              <div className="w-full sm:w-full md:w-[135px] lg:w-[155px] xl:w-[235px] 2xl:w-full">
                <h3 className="text-[20px] font-bold text-neutral-20 dark:text-primary-100">
                  Photo Profile
                </h3>
                <p className="w-2/2 text-neutral-60 dark:text-primary-100 mt-4">
                  Format foto harus .jpg, jpeg, png dan ukuran minimal 300 x 300
                  px.
                </p>
              </div>
              <div className="mt-2 flex justify-center items-center border border-dashed border-neutral-60 w-full md:w-[150px] h-[150px] ">
                <label
                  htmlFor="fileUpload"
                  className="flex flex-col justify-center items-center cursor-pointer text-center ">
                  <img alt="" className="w-6 h-6" src="path_to_your_icon" />
                  <span className="text-primary-0 text-xs font-light mt-2 dark:text-primary-100">
                    Upload Foto
                  </span>
                  <input
                    type="file"
                    id="fileUpload"
                    name="product_images.image_url"
                    multiple
                    accept="image/jpeg,image/png,image/jpg"
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <div className="flex flex-col md:flex-row sm:gap-[140px] md:gap-[149px] lg:gap-[150px] mt-10 ">
              <div className="w-full sm:w-full md:w-[280px] lg:w-[290px] xl:w-[350px] 2xl:w-[220px] ">
                <div className="flex items-center gap-2">
                  <h3 className="text-[20px]  font-bold text-neutral-20 dark:text-primary-100">
                    Email
                  </h3>
                  <img src={IconField} alt="" className="w-4 h-4 -mt-5" />
                </div>
                <p className="w-2/2 text-neutral-60 dark:text-primary-100 mt-4 text-justify">
                  Masukan Email terdaftar untuk melakukan verifikasi atau yang
                  lainnya
                </p>
              </div>
              <div className="flex justify-start items-start w-full  sm:-mt-40 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0">
                <label className="input input-bordered flex items-center gap-2 w-[686px]  sm:w-[686px] md:w-[420px] lg:w-[650px] xl:w-full h-[48px]  border border-neutral-60 rounded-md p-2 bg-primary-100 dark:bg-neutral-20 dark:text-primary-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70">
                    <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                    <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                  </svg>
                  <input
                    type="email"
                    className="input border-0 focus:outline-none focus:ring-0 w-full"
                    placeholder="Email"
                    required
                  />
                </label>
              </div>
            </div>
            <div className="flex flex-col md:flex-row sm:gap-[140px] md:gap-[149px] lg:gap-[150px] mt-10 ">
              <div className="w-full sm:w-full md:w-[280px] lg:w-[290px] xl:w-[350px] 2xl:w-[220px]">
                <div className="flex items-center gap-2">
                  <h3 className="text-[20px]  font-bold text-neutral-20 dark:text-primary-100">
                    Username
                  </h3>
                  <img src={IconField} alt="" className="w-4 h-4 -mt-5" />
                </div>
                <p className="w-2/2 text-neutral-60 dark:text-primary-100 mt-4 text-justify">
                  Nama username maximal 100 karakter dan jangan menggunakan
                  simbol Disarankan untuk tidak menggunakan huruf kapital
                  berlebih.
                </p>
              </div>
              <div className="flex justify-start items-start w-full  sm:-mt-40 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0">
                <label className="input input-bordered flex items-center gap-2 w-[686px]  sm:w-[686px] md:w-[420px] lg:w-[650px] xl:w-full h-[48px]  border border-neutral-60 rounded-md p-2 bg-primary-100 dark:bg-neutral-20 dark:text-primary-100">
                  <input
                    type="text"
                    className="input border-0 focus:outline-none focus:ring-0 w-full"
                    placeholder="Username"
                    required
                  />
                </label>
              </div>
            </div>
            <div className="flex flex-col md:flex-row sm:gap-[140px] md:gap-[149px] lg:gap-[150px] mt-10 ">
              <div className="w-full sm:w-full md:w-[280px] lg:w-[290px] xl:w-[350px] 2xl:w-[220px]">
                <div className="flex items-center gap-2">
                  <h3 className="text-[20px]  font-bold text-neutral-20 dark:text-primary-100">
                    First Name
                  </h3>
                  <img src={IconField} alt="" className="w-4 h-4 -mt-5" />
                </div>
                <p className="w-2/2 text-neutral-60 dark:text-primary-100 mt-4 text-justify">
                  Nama username maximal 100 karakter dan jangan menggunakan
                  simbol Disarankan untuk tidak menggunakan huruf kapital
                  berlebih.
                </p>
              </div>
              <div className="flex justify-start items-start w-full  sm:-mt-40 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0">
                <label className="input input-bordered flex items-center gap-2 w-[686px]  sm:w-[686px] md:w-[420px] lg:w-[650px] xl:w-full h-[48px]  border border-neutral-60 rounded-md p-2 bg-primary-100 dark:bg-neutral-20 dark:text-primary-100">
                  <input
                    type="text"
                    className="input border-0 focus:outline-none focus:ring-0 w-full "
                    placeholder="First Name"
                    required
                  />
                </label>
              </div>
            </div>
            <div className="flex flex-col md:flex-row sm:gap-[140px] md:gap-[149px] lg:gap-[150px] mt-10 ">
              <div className="w-full sm:w-full md:w-[280px] lg:w-[290px] xl:w-[350px] 2xl:w-[220px]">
                <div className="flex items-center gap-2">
                  <h3 className="text-[20px]  font-bold text-neutral-20 dark:text-primary-100">
                    Last Name
                  </h3>
                  <img src={IconField} alt="" className="w-4 h-4 -mt-5" />
                </div>
                <p className="w-2/2 text-neutral-60 dark:text-primary-100 mt-4 text-justify">
                  Nama LastName maximal 100 karakter dan jangan menggunakan
                  simbol Disarankan untuk tidak menggunakan huruf kapital
                  berlebih.
                </p>
              </div>
              <div className="flex justify-start items-start w-full  sm:-mt-40 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0">
                <label className="input input-bordered flex items-center gap-2 w-[686px]  sm:w-[686px] md:w-[420px] lg:w-[650px] xl:w-full h-[48px]  border border-neutral-60 rounded-md p-2 bg-primary-100 dark:bg-neutral-20 dark:text-primary-100">
                  <input
                    type="text"
                    className="input border-0 focus:outline-none focus:ring-0 w-full"
                    placeholder="Last Name"
                    required
                  />
                </label>
              </div>
            </div>
            <div className="flex flex-col md:flex-row sm:gap-[140px] md:gap-[149px] lg:gap-[150px] mt-10 ">
              <div className="w-full sm:w-full md:w-[280px] lg:w-[290px] xl:w-[350px] 2xl:w-[220px]">
                <div className="flex items-center gap-2">
                  <h3 className="text-[20px]  font-bold text-neutral-20 dark:text-primary-100">
                    Password
                  </h3>
                  <img src={IconField} alt="" className="w-4 h-4 -mt-5" />
                </div>
                <p className="w-2/2 text-neutral-60 dark:text-primary-100 mt-4 text-justify">
                  masukan password dengan minimal 1 huruf kapital, wajib
                  menggunakan angka dan jangan menggunakan simbol
                </p>
              </div>
              <div className="flex justify-start items-start w-full  sm:-mt-40 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0">
                <label className="input input-bordered flex items-center gap-2 w-[686px]  sm:w-[686px] md:w-[420px] lg:w-[650px] xl:w-full h-[48px]  border border-neutral-60 rounded-md p-2 bg-primary-100 dark:bg-neutral-20 dark:text-primary-100">
                  <input
                    type="password"
                    className="input border-0 focus:outline-none focus:ring-0  w-full"
                    placeholder="password"
                    required
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="w-full inline-flex sm:gap-6 xl:gap-[21px] justify-center sm:justify-center md:justify-end mt-10 gap-6 sm:mt-10 md:mt-10 lg:mt-16 xl:mt-20  ">
            <button className="btn bg-neutral-60 border-neutral-60 hover:bg-neutral-60 hover:border-neutral-60 rounded-lg  font-semibold text-[18px] leading-[24px]  text-primary-100 text-center xl:w-[200px] xl:h-[60px] lg:w-[200px] lg:h-[60px] md:w-[200px] md:h-[60px] sm:w-[150px] sm:h-[50px] w-[120px] h-[45px]">
              Cancel
            </button>
            <button
              type="submit"
              className="btn  bg-secondary-40 border-secondary-40 hover:bg-secondary-40 hover:border-secondary-40 rounded-lg  font-semibold text-[18px] leading-[24px]  text-primary-100 text-center xl:w-[200px] xl:h-[60px] lg:w-[200px] lg:h-[60px] md:w-[200px] md:h-[60px] sm:w-[150px] sm:h-[50px] w-[120px] h-[45px]">
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddAdmin;
