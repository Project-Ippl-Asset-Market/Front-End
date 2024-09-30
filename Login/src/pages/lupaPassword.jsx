import React, { useState } from "react";
import { Link } from "react-router-dom";
import BgLogin from "../assets/Background/bgLogin3.png";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Logo from "../assets/icon/logo.jpg";
import { auth } from "../firebase/firebaseConfig";
import { updatePassword } from "firebase/auth";
import IconModalError from "../assets/icon/iconModal/iconModalError.png";
import IconModalSuccess from "../assets/icon/iconModal/iconModalSucces.png";

function LupaPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangeNewPassword = (e) => {
    setNewPassword(e.target.value);
  };

  const handleChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalMessage("");
    setErrorModal("");
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setErrorModal("Kata sandi dan konfirmasi kata sandi tidak cocok.");
      setLoading(false);
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, newPassword);
        setModalMessage("Kata sandi berhasil diperbarui.");
      } else {
        setErrorModal("Pengguna tidak terautentikasi.");
      }
    } catch (errorModal) {
      setErrorModal(
        "Terjadi kesalahan saat memperbarui kata sandi. Silakan coba lagi."
      );
      console.errorModal(errorModal);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-20 min-h-screen h-full flex justify-center items-center font-poppins">
      <div className="flex flex-col lg:flex-row w-full max-w-[1920px] lg:h-[768px] h-auto min-h-screen">
        <div className="relative hidden sm:block lg:flex h-full text-center w-full lg:w-1/2 flex-col justify-center items-center p-6 ">
          <img
            src={BgLogin}
            alt="Login background"
            className="absolute w-full h-full inset-0 object-cover opacity-80"
          />
          <div className="relative mx-auto z-40 w-[60%] sm:w-[50%] md:w-[40%] lg:w-1/2 opacity-100 rounded-lg p-4 sm:p-6">
            <img
              src={Logo}
              alt="Logo"
              className="w-44 h-44 sm:w-40 sm:h-40 z-50 rounded-t-full mx-auto mt-6 sm:mt-5"
            />
            <h2 className="relative z-50 text-1xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary-100 mt-4">
              PixelStore
            </h2>
            <p className="text-center relative z-50 py-2 sm:py-4 lg:py-6 text-[10px] sm:text-[12px] md:text-[14px] lg:text-xl  text-primary-100">
              PixelStore, Sumber Inspirasi footage menarik di website kami untuk
              Project Anda!
            </p>
          </div>
        </div>
        <div className="card bg-neutral-90 w-full lg:w-1/2 flex justify-center items-center">
          <div className="card-body w-full px-4 sm:px-8 lg:px-16 py-8 lg:py-0 bg-neutral-20">
            <div className="mt-8 sm:mt-[3%] md:mt-[4%] lg:mt-[10%]  text-center">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary-100 mt-2 mb-2">
                Pulihkan Akun Anda!
              </h1>
            </div>
            <div className="relative w-full mx-auto ">
              <h2 className=" ml-[12px] sm:ml-[90px] md:ml-[110px] lg:ml-[80px] xl:ml-[100px] sm:w-2/3 text-[12px] sm:text-[14px] md:text-[16px] lg:text-xl text-center text-neutral-50 mb-8">
                Silahkan Masukkan Email Password Baru Anda
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 mx-auto mt-8">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-sm sm:text-base text-primary-100">
                    email
                  </span>
                </label>
                <input
                  type="email"
                  placeholder="email"
                  onChange={handleChangeEmail}
                  className="w-full h-[40px] input input-bordered bg-neutral-90 text-neutral-20 text-[16px] sm:text-[16px] md:text-[16px] lg:text-[16px] xl:text-xl sm:w-[250px] md:w-[400px] lg:w-[400px] xl:w-[500px]"
                  required
                  value={email}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-sm sm:text-base text-primary-100">
                    Masukkan Password Baru
                  </span>
                </label>
                <div className="relative ">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="minimal 8 karakter"
                    onChange={handleChangeNewPassword}
                    className="w-full h-[40px] input input-bordered bg-neutral-90 text-neutral-20 text-[16px] sm:text-[16px] md:text-[16px] lg:text-[16px] xl:text-xl sm:w-[250px] md:w-[400px] lg:w-[400px] xl:w-[500px]"
                    required
                    value={newPassword}
                  />
                  {/*  Icon mata start */}
                  <button
                    type="button"
                    className="absolute  inset-y-0 right-0 pr-5 flex items-center text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeSlashIcon className="h-6 w-6 text-gray-500" />
                    ) : (
                      <EyeIcon className="h-6 w-6 text-gray-500" />
                    )}
                  </button>
                  {/*  Icon mata End */}
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-sm sm:text-base text-primary-100">
                    Masukkan Kembali Password Baru
                  </span>
                </label>
                <div className="relative ">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="minimal 8 karakter"
                    className=" h-[40px] input input-bordered bg-neutral-90 text-neutral-20 text-[16px] sm:text-[16px] md:text-[16px] lg:text-[16px] xl:text-xl w-[300px] sm:w-[400px] md:w-[400px] lg:w-[400px] xl:w-[500px]"
                    required
                    value={confirmPassword}
                    onChange={handleChangeConfirmPassword}
                  />
                  {/*  Icon mata start */}
                  <button
                    type="button"
                    className="absolute  inset-y-0 right-0 pr-5 flex items-center text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeSlashIcon className="h-6 w-6 text-gray-500" />
                    ) : (
                      <EyeIcon className="h-6 w-6 text-gray-500" />
                    )}
                  </button>
                  {/*  Icon mata End */}
                </div>
              </div>
              <div className="form-control mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="sm:w-[250px] md:w-[400px] lg:w-[400px] xl:w-[500px] h-[45px] btn bg-secondary-40 hover:bg-secondary-50 hover:text-bold text-primary-100 font-bold mt-4">
                  {loading ? "Loading..." : "Simpan"}
                </button>
              </div>
            </form>
            <div className="text-2xl text-center mt-5">
              <span className="text-primary-100 text-2xl">
                Sudah Ingat Password?
              </span>
              <Link
                className="ml-4 text-primary-30 text-2xl hover:text-error-30"
                to="/">
                Login
              </Link>
            </div>
          </div>
          {errorModal && (
            <div className="modal modal-open ">
              <div className="modal-box sm:w-[400px] md:w-[700px] lg:w-[700px] h-[250px] bg-primary-10">
                <img
                  className="h-[90px] w-[90px] mx-auto mb-6"
                  src={IconModalError}
                  alt="icon pop up error"
                />
                <h3 className=" text-lg text-primary-3 w-3/2 mx-auto text-center">
                  {errorModal}
                </h3>
                <div className="modal-action">
                  <button
                    onClick={() => setErrorModal(null)}
                    className="btn bg-primary-1 border-primary-1 hover:bg-error-1 hover:border-error-1 hover:font-bold mx-auto mt-2 w-[79px] text-primary-100">
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}
          {modalMessage && (
            <div className="modal modal-open ">
              <div className="modal-box sm:w-[400px] md:w-[700px] lg:w-[700px] h-[250px] bg-primary-10">
                <img
                  className="h-32 w-32 mx-auto mb-6"
                  src={IconModalSuccess}
                  alt="icon pop up error"
                />
                <h3 className=" text-lg text-primary-3 w-3/2 mx-auto text-center">
                  {modalMessage}
                </h3>
                <div className="modal-action">
                  <Link
                    to="/"
                    onClick={() => setModalMessage(null)}
                    className="btn bg-success-50 border-success-1 hover:bg-success-1 hover:border-success-1 hover:font-bold mx-auto mt-4 w-[79px] text-primary-100">
                    OK
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LupaPassword;
