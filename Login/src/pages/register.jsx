import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import BgLogin from "../assets/Background/bgLogin3.png";
import Logo from "../assets/icon/logo.jpg";
import IconModalError from "../assets/icon/iconModal/iconModalError.png";
import IconModalSuccess from "../assets/icon/iconModal/iconModalSucces.png";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalMessage, setModalMessage] = useState(null);
  const [errorModal, setErrorModal] = useState(false);
  const navigate = useNavigate();

  const registerAction = async (e) => {
    e.preventDefault();
    setModalMessage("");
    setErrorModal("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        firstName,
        lastName,
        username,
        email,
        createdAt: new Date(),
      });

      setModalMessage("User data added to Firestore");
      setTimeout(() => {
        navigate("/");
      }, 5000);
    } catch (error) {
      setErrorModal("Registration failed. Please try again.");
    }
  };

  return (
    <div className="font-poppins bg-primary-10 min-h-screen flex justify-center items-center">
      <div className="flex flex-col lg:flex-row w-full max-w-[1920px] lg:h-[768px] h-auto">
        <div className="relative text-center w-full lg:w-1/2 bg-primary-10 flex flex-col justify-center items-center p-6">
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
        <div className="card bg-[#E3E3E3] w-full lg:w-1/2 flex justify-center items-center">
          <div className="card-body w-full px-4 sm:px-8 lg:px-16 py-8 lg:py-0 bg-[#212121]">
            <div className="mt-8 sm:mt-[3%] md:mt-[4%] lg:mt-[10%]  text-center">
              <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-12 mt-2 mb-2">
                Register
              </h1>
            </div>
            <div className="relative w-full mx-auto ">
              <h2 className=" ml-[12px] sm:ml-[90px] md:ml-[110px] lg:ml-[80px] xl:ml-[100px] sm:w-2/3 text-[12px] sm:text-[14px] md:text-[16px] lg:text-xl text-center text-primary-12 mb-10">
                Ayo Selesaikan Pendaftaran dan Segera bergabung Ke Tomb Oati
                Market
              </h2>
            </div>

            <form onSubmit={registerAction} className="space-y-4 mx-auto">
              <div className="flex flex-col space-x-0 mx-auto lg:flex-row lg:space-x-2 ">
                <div className="form-control flex-1">
                  <label className="label">
                    <span className="label-text text-sm sm:text-base text-primary-12">
                      First Name
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-[245px] sm:w-[100%] md:w-[450px] lg:w-[215px] h-[45px] input input-bordered bg-primary-12 text-[#212121]"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="form-control flex-1 ">
                  <label className="label">
                    <span className="label-text text-sm sm:text-base text-primary-12">
                      Last Name
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-[245px] sm:w-[100%] md:w-[450px] lg:w-[215px] h-[45px] input input-bordered bg-primary-12 text-[#212121]"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-sm sm:text-base text-primary-12">
                    Username
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Username"
                  className="w-[450px] max-sm:w-[250px] min-md:w-[400px] min-lg:w-[400px] h-[45px] input input-bordered bg-primary-12 text-[#212121]"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-sm sm:text-base text-primary-12">
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-[450px] max-sm:w-[250px] min-md:w-[400px] min-lg:w-[400px] h-[45px] input input-bordered bg-primary-12 text-[#212121]"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-sm sm:text-base text-primary-12">
                    Password
                  </span>
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-[450px] max-sm:w-[250px] min-md:w-[400px] min-lg:w-[400px] h-[45px] input input-bordered bg-primary-12 text-[#212121]"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="w-[450px] max-sm:w-[250px] min-md:w-[400px] min-lg:w-[400px] h-[45px] btn bg-secondary-8 hover:bg-secondary-7 text-primary-12 font-bold mt-4">
                  Register
                </button>
              </div>
            </form>
            <div className="text-2xl text-center mt-5">
              <span className="text-primary-12 text-2xl">
                Sudah Punya Akun?
              </span>
              <Link
                className="ml-4 text-primary-1 text-2xl hover:text-error-1"
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
                    className="btn bg-primary-1 border-primary-1 hover:bg-error-1 hover:border-error-1 hover:font-bold mx-auto mt-2 w-[79px] text-primary-12">
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
                    className="btn bg-success-1 border-success-1 hover:bg-success-1 hover:border-success-1 hover:font-bold mx-auto mt-4 w-[79px] text-primary-12">
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

export default Register;
