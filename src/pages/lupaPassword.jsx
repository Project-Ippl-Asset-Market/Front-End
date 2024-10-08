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
            <div className="mt-8 sm:mt-[3%] md:mt-[4%] lg:mt-[10%] text-center">
              <h1 className="text-[24px] sm:text-[24px] md:text-[26px] lg:text-[36px] text-center font-bold text-primary-100">
                Pulihkan Akun Anda!
              </h1>
              <div className="relative flex justify-center">
                <h2 className="w-3/4 text-[14px] sm:text-[14px] md:text-[16px] lg:text-xl text-center text-neutral-90 mb-8">
                  Silahkan Masukkan Email dan Password Baru Anda
                </h2>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md">
              <div className="form-control items-start">
                <label className="label">
                  <span className="label-text text-[14px] sm:text-[14px] md:text-[14px] lg:text-[18px]  xl:text-[18px] sm:text-base text-primary-100 text-start">
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  placeholder="email"
                  onChange={handleChangeEmail}
                  className=" border border-neutral-90 rounded-md w-full h-[40px] sm:h-[48px] md:h-[48px] lg:h-[48px] xl:h-[48px] 2xl:h-[48px] input input-bordered bg-neutral-90 text-neutral-20 text-[12px] sm:text-[12px] md:text-[12px] lg:text-[14px]  xl:text-[16px]"
                  required
                  value={email}
                />
              </div>
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text text-[14px] sm:text-[14px] md:text-[14px] lg:text-[18px]  xl:text-[18px] sm:text-base text-primary-100 text-start">
                    Masukkan Password Baru
                  </span>
                </label>
                <div className="relative ">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="minimal 8 karakter"
                    onChange={handleChangeNewPassword}
                    className="border border-neutral-90 rounded-md w-full h-[40px] sm:h-[48px] md:h-[48px] lg:h-[48px] xl:h-[48px] 2xl:h-[48px] input input-bordered bg-neutral-90 text-neutral-20 text-[12px] sm:text-[12px] md:text-[12px] lg:text-[14px]  xl:text-[16px]"
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

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text text-[14px] sm:text-[14px] md:text-[14px] lg:text-[18px]  xl:text-[18px] sm:text-base text-primary-100 text-start">
                    konfirmasi Password Baru
                  </span>
                </label>
                <div className="relative ">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="minimal 8 karakter"
                    className=" border border-neutral-90 rounded-md w-full h-[40px] sm:h-[48px] md:h-[48px] lg:h-[48px] xl:h-[48px] 2xl:h-[48px] input input-bordered bg-neutral-90 text-neutral-20 text-[12px] sm:text-[12px] md:text-[12px] lg:text-[14px]  xl:text-[16px]"
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
                  className={`rounded-md w-full h-[40px] sm:h-[48px] md:h-[48px] lg:h-[48px] xl:h-[48px] 2xl:h-[48px] text-[16px] sm:text-[16px] md:text-[16px] lg:text-[18px]  xl:text-[18px] mt-4   ${
                    loading ? "bg-secondary-40 " : "bg-secondary-40  "
                  } text-primary-100`}
                  disabled={loading}>
                  {loading ? (
                    <span className="loading loading-infinity loading-lg"></span>
                  ) : (
                    "masuk"
                  )}
                </button>
              </div>
            </form>
            <div className="text-2xl text-center mt-5">
              <span className="text-primary-100 text-[14px] sm:text-[16px] md:text-[16px] lg:text-[16px] xl:text-xl">
                Sudah Ingat Password?
              </span>
              <Link
                to="/"
                className="relative ml-4 inline-block text-[16px] sm:text-[16px] md:text-[16px] lg:text-[16px] xl:text-[18px] text-primary-40 hover:text-error-1 group">
                Login ?
                <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-primary-40 transition-all duration-1000 transform group-hover:left-0 group-hover:w-1/2"></span>
                <span className="absolute bottom-0 right-1/2 w-0 h-[2px] bg-primary-40 transition-all duration-1000 transform group-hover:right-0 group-hover:w-1/2"></span>
              </Link>
            </div>
          </div>
          {errorModal && (
            <div className="modal modal-open fixed inset-0 flex items-center justify-center z-50 pr-5">
              <div className="modal-box w-[90%] max-w-[250px] sm:max-w-[350px] md:max-w-[350px] lg:max-w-[400px] xl:max-w-[450px] h-auto sm:h-[280px] md:h-[290px] lg:h-[300px] xl:h-[360px] bg-neutral-90 rounded-lg">
                <img
                  className="w-20 sm:w-24 md:w-32 lg:w-32 xl:w-32 2xl:w-32 h-20 sm:h-24 md:h-32 lg:h-32 xl:h-32 2xl:h-32 mx-auto mb-6"
                  src={IconModalError}
                  alt="icon pop up error"
                />
                <h3 className="text-center text-[12px] sm:text-[16px] md:text-[16px] lg:text-[18px] xl:text-[18px] text-primary-0 mx-auto">
                  {errorModal}
                </h3>
                <div className="modal-action flex justify-center">
                  <button
                    onClick={() => setErrorModal(null)}
                    className="btn bg-secondary-40 border-secondary-40 hover:bg-secondary-50 hover:border-secondary-50 hover:font-bold mx-auto mt-4 w-[79px] text-primary-100">
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}

          {modalMessage && (
            <div className="modal modal-open fixed inset-0 flex items-center justify-center z-50 pr-5">
              <div className="modal-box w-[90%] max-w-[250px] sm:max-w-[350px] md:max-w-[350px] lg:max-w-[400px] xl:max-w-[450px] h-auto sm:h-[280px] md:h-[290px] lg:h-[300px] xl:h-[370px] bg-neutral-90 rounded-lg">
                <img
                  className="w-20 sm:w-24 md:w-32 lg:w-32 xl:w-32 2xl:w-32 h-20 sm:h-24 md:h-32 lg:h-32 xl:h-32 2xl:h-32 mx-auto mb-6"
                  src={IconModalSuccess}
                  alt="icon pop up success"
                />
                <h3 className="text-center text-[12px] sm:text-[16px] md:text-[16px] lg:text-[18px] xl:text-[18px] text-primary-0 mx-auto">
                  {modalMessage}
                </h3>
                <div className="modal-action flex justify-center">
                  <button
                    onClick={() => setModalMessage(null)}
                    className="btn bg-secondary-40 border-secondary-40 hover:bg-secondary-50 hover:border-secondary-50 hover:font-bold mx-auto mt-4 w-[79px] text-primary-100">
                    OK
                  </button>
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
