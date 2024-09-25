import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import IconGoogle from "../assets/icon/iconGoogle.png";
import BgLogin from "../assets/Background/bgLogin3.png";
import Logo from "../assets/icon/logo.jpg";
import IconModalError from "../assets/icon/iconModal/iconModalError.png";
import IconModalSuccess from "../assets/icon/iconModal/iconModalSucces.png";

function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [modalMessage, setModalMessage] = useState(null);
  const [errorModal, setErrorModal] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "email") {
      setLoginEmail(e.target.value);
    } else if (e.target.name === "password") {
      setLoginPassword(e.target.value);
    }
  };

  const checkAdminRole = async (email) => {
    const adminsRef = collection(db, "admins");
    const q = query(adminsRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const adminDoc = querySnapshot.docs[0];
      return adminDoc.data().role;
    }
    return null;
  };

  const loginAction = async (e) => {
    e.preventDefault();
    setErrorModal("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      const user = userCredential.user;

      // Get token
      const token = await user.getIdToken();
      localStorage.setItem("authToken", token);

      const adminRole = await checkAdminRole(user.email);
      console.log("Admin Role:", adminRole); // Debugging line

      if (adminRole === "superadmin") {
        setModalMessage("Login sebagai Superadmin berhasil!");
        setTimeout(() => {
          setModalMessage(null); // Hide modal before navigating
          localStorage.setItem("userRole", "superadmin");
          navigate("/superAdminDashboard");
        }, 2000);
      } else if (adminRole === "admin") {
        setModalMessage("Login sebagai Admin berhasil!");
        setTimeout(() => {
          setModalMessage(null);
          localStorage.setItem("userRole", "admin");
          navigate("/adminDashboard");
        }, 2000);
      } else {
        setModalMessage("Login sebagai pengguna biasa berhasil!");
        setTimeout(() => {
          setModalMessage(null);
          localStorage.setItem("userRole", "user");
          navigate("/landingPage");
        }, 2000);
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      setErrorModal("Email atau password tidak valid. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Get token
      const token = await user.getIdToken();
      localStorage.setItem("authToken", token);

      const adminRole = await checkAdminRole(user.email);
      console.log("Admin Role:", adminRole);

      if (adminRole === "superadmin") {
        setModalMessage("Login sebagai Superadmin dengan Google berhasil!");
        setTimeout(() => {
          setModalMessage(null);
          localStorage.setItem("userRole", "superadmin");
          navigate("/superAdminDashboard");
        }, 2000);
      } else if (adminRole === "admin") {
        setModalMessage("Login sebagai Admin dengan Google berhasil!");
        setTimeout(() => {
          setModalMessage(null);
          localStorage.setItem("userRole", "admin");
          navigate("/adminDashboard");
        }, 2000);
      } else {
        setModalMessage("Login sebagai pengguna biasa berhasil!");
        setTimeout(() => {
          setModalMessage(null);
          localStorage.setItem("userRole", "user");
          navigate("/landingPage");
        }, 2000);
      }
    } catch {
      setErrorModal("Google sign-in gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary-10 min-h-screen h-full flex justify-center items-center font-poppins">
      <div className="flex flex-col lg:flex-row w-full max-w-[1920px] lg:h-[768px] h-auto min-h-screen">
        <div className="relative h-full text-center w-full lg:w-1/2 bg-primary-10 flex flex-col justify-center items-center p-6 ">
          <img
            src={BgLogin}
            alt="Login background"
            className="absolute w-full h-full inset-0 object-cover opacity-80"
          />
          <div className="bg-primary-10 relative z-40 w-[60%] sm:w-[50%] md:w-[40%] lg:w-1/2 opacity-60 rounded-lg p-4 sm:p-6">
            <img
              src={Logo}
              alt="Logo"
              className="w-44 h-44 sm:w-40 sm:h-40 z-50 rounded-t-full mx-auto mt-6 sm:mt-5"
            />
            <h2 className="relative z-50 text-1xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary-5 mt-4">
              PixelStore
            </h2>
            <p className="text-justify relative z-50 py-2 sm:py-4 lg:py-6 text-[10px] sm:text-[12px] md:text-[14px] lg:text-xl  text-primary-6">
              PixelStore, Sumber Inspirasi footage menarik di website kami untuk
              Project Anda!
            </p>
          </div>
        </div>
        <div className="card bg-primary-9 w-full lg:w-1/2 flex justify-center items-center min-h-screen">
          <div className="card-body w-full px-4 sm:px-8 lg:px-16 py-8 lg:py-0 bg-primary-6">
            <div className="mt-8 sm:mt-[3%] md:mt-[4%] lg:mt-[10%]  text-center">
              <h1 className="text-xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-primary-12 mt-2 mb-2">
                LOGIN
              </h1>
            </div>
            <div className="relative w-full mx-auto ">
              <h2 className=" ml-[12px] sm:ml-[90px] md:ml-[110px] lg:ml-[80px] xl:ml-[100px] sm:w-2/3 text-[12px] sm:text-[14px] md:text-[16px] lg:text-xl text-center text-primary-12 mb-10">
                Selamat Datang di PixelStore, Surga Kreatif untuk Asset
                Berkualitas!
              </h2>
            </div>

            <form onSubmit={loginAction} className="mx-auto">
              <div className="form-control items-start">
                <label className="label">
                  <span className="label-text text-sm sm:text-base text-primary-12 text-start">
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  className="w-[500px] max-sm:w-[250px] min-md:w-[400px] lg:w-[400px] h-[45px] input input-bordered bg-primary-12 text-primary-6"
                  required
                  value={loginEmail}
                  onChange={handleChange}
                />
              </div>
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text text-sm sm:text-base text-primary-12">
                    Password
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    className="w-[500px] max-sm:w-[250px] min-md:w-[400px] lg:w-[400px] h-[45px] input input-bordered bg-primary-12 text-primary-6  pr-10"
                    required
                    value={loginPassword}
                    onChange={handleChange}
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
                <div className="flex justify-between items-center mt-2">
                  <label className="label cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-md  rounded-[2px] bg-primary-12 border-primary-12"
                    />
                    <span className="label-text text-sm text-primary-12 ml-2">
                      Remember me
                    </span>
                  </label>
                  <Link
                    to="/lupaPassword"
                    className="text-sm text-primary-1 hover:text-error-1 ">
                    Lupa Password?
                  </Link>
                </div>
              </div>
              <button
                type="button"
                onClick={signInWithGoogle}
                className="w-[500px] max-sm:w-[250px] min-md:w-[400px] lg:w-[400px] h-[45px]  input input-bordered btn btn-outline  mt-6 bg-primary-7 hover:bg-primary-8 hover:font-bold text-primary-3">
                <img src={IconGoogle} alt="Google" className="w-5 h-5 mr-2" />
                Masuk menggunakan google
              </button>

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="w-[500px] max-sm:w-[250px] min-md:w-[400px] lg:w-[400px] h-[45px] btn bg-primary-2 hover:bg-secondary-7 text-primary-12 font-bold"
                  disabled={loading}>
                  {loading ? "Loading..." : "masuk"}
                </button>
              </div>
            </form>
            <div className="text-2xl text-center mt-5">
              <span className="text-primary-12 text-2xl">
                Belum Punya Akun?
              </span>
              <Link to="/register"
                className="ml-4 text-primary-1 text-2xl hover:text-error-1">
                Daftar
              </Link>
            </div>
          </div>
          {errorModal && (
            <div className="modal modal-open ">
              <div className="modal-box sm:w-[400px] md:w-[700px] lg:w-[700px] h-[250px] bg-primary-10">
                <img
                  className="h-32 w-32 mx-auto mb-6"
                  src={IconModalError}
                  alt="icon pop up error"
                />
                <h3 className=" text-lg text-primary-3 w-3/2 mx-auto text-center">
                  {errorModal}
                </h3>
                <div className="modal-action">
                  <button
                    onClick={() => setErrorModal(null)}
                    className="btn bg-primary-1 border-primary-1 hover:bg-error-1 hover:border-error-1 hover:font-bold mx-auto mt-4 w-[79px] text-primary-12">
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
                  <button
                    onClick={() => setModalMessage(null)}
                    className="btn bg-success-1 border-success-1 hover:bg-success-1 hover:border-success-1 hover:font-bold mx-auto mt-4 w-[79px] text-primary-12">
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

export default Login;
