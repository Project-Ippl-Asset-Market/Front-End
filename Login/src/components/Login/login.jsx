import IconGoogle from "../../assets/icon/iconGoogle.png";
import BgLogin from "../../assets/icon/bgLogin3.png";
import Logo from "../../assets/icon/logo.jpg";
function Login() {
  return (
    <>
      <div className="bg-base-200 min-h-screen flex justify-center items-center">
        <div className="flex flex-col lg:flex-row w-full max-w-[1366px] lg:h-[768px] h-auto">
          <div className="relative text-center w-full lg:w-1/2 bg-[#ECECEC] flex flex-col justify-center items-center p-6">
            <img
              src={BgLogin}
              alt="bg-login"
              className="absolute w-full h-full inset-0 object-cover opacity-80"
            />
            <div className="bg-[#ECECEC] relative z-40 w-[90%] sm:w-[80%] md:w-[70%] lg:w-1/2 opacity-60 rounded-lg p-4 sm:p-6">
              <img
                src={Logo}
                alt="bg-login"
                className="w-40 h-40 sm:w-20 sm:h-20 z-50 rounded-full mx-auto mt-6 sm:mt-10"
              />
              <h2 className="relative z-50 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#171717] mt-4">
                Nama WebSite
              </h2>
              <p className="relative z-50 py-2 sm:py-4 lg:py-6 text-sm sm:text-base lg:text-lg text-[#212121]">
                Jelajahi ribuan footage menarik di website kami!
              </p>
            </div>
          </div>

          <div className="card bg-[#E3E3E3] w-full lg:w-1/2 flex justify-center items-center">
            <form className="card-body w-full px-4 sm:px-8 lg:px-16 py-8 lg:py-0 bg-[#212121]">
              <div className="mt-20 mb-10 text-center">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-[#FFFFFF]">
                  Selamat Datang!
                </h1>
                <p className=" mt-8 text-[#FFFFFF]">
                  Jelajahi ribuan footage menarik di website kami!
                </p>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-sm sm:text-base text-[#FFFFFF]">
                    Email / username
                  </span>
                </label>
                <input
                  type="email"
                  placeholder="Masukkan email"
                  className="input input-bordered bg-[#FFFFFF] text-[#212121]"
                  required
                />
              </div>
              <div className="form-control mt-4 ">
                <label className="label">
                  <span className="label-text text-sm sm:text-base text-[#FFFFFF]">
                    Password
                  </span>
                </label>
                <input
                  type="password"
                  placeholder="Masukkan password"
                  className="input input-bordered bg-[#FFFFFF] text-[#212121]"
                  required
                />
                <div>
                  <label className="label mt-2">
                    <form className="max-w-sm mx-auto -ml-1 w-[130px]">
                      <select
                        id="countries"
                        className="bg-[#346EF1]  text-gray-900 text-sm rounded-lg focus:ring-[#346EF1] focus:border-[#346EF1] block w-full p-2.5 dark:bg-[#346EF1] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#346EF1] dark:focus:border-[#346EF1]">
                        <option selected>Pilih Role</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Super Admin</option>
                      </select>
                    </form>
                    <a
                      href="#"
                      className="label-text-alt link link-hover text-xs sm:text-lg text-[#980019]">
                      Forgot password?
                    </a>
                  </label>
                </div>
              </div>
              <div className="flex form-control mt-6 bg-[#9B9B9B] w-full h-[40px] rounded-[10px] items-center">
                <div className="flex justify-center items-center gap-6 mt-2">
                  <img
                    className=""
                    src={IconGoogle}
                    alt="google"
                    width="20"
                    height="20"
                  />
                  <p className="text-[#FFFFFFFF] ">Masuk menggunakan google</p>
                </div>
              </div>
              <div className="form-control mt-6">
                <button className="btn bg-[#346EF1] btn-primary hover:bg-[#487cf5] rounded-[10px] text-[#FFFFFF] font-bold">
                  Masuk
                </button>
              </div>
              <div className="flex wrap text-center mt-4 w-full justify-center">
                <label className="text-center justify-end text-[#FFFFFF] text-2xl">
                  Belum Punya Akun?
                </label>
                <a
                  href="#"
                  className="label-text-alt link link-hover text-xl sm:text-2xl text-[#980019] ml-4">
                  Daftar
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
