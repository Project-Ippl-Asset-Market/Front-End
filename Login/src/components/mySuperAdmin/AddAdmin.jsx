import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import HeaderNav from "../headerNavBreadcrumbs/Header";
import Breadcrumb from "../breadcrumbs/Breadcrumbs";
import IconField from "../../assets/icon/iconField/icon.svg";

function AddAdmin() {
  const [admin, setAdmin] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    username: "",
    role: "",
  });

  const handleChange = (e) => {
    setAdmin({
      ...admin,
      [e.target.name]: e.target.value,
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        admin.email,
        admin.password
      );
      const user = userCredential.user;

      // 2. Save user details along with role to Firestore
      await addDoc(collection(db, "admins"), {
        uid: user.uid, // Store the Firebase Authentication UID
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        username: admin.username,
        role: admin.role, // Save the selected role (admin or superadmin)
      });

      alert("Admin successfully created and data saved to Firestore");
      navigate("/loginAdmin");
    } catch (error) {
      console.error("Error creating admin: ", error);
      alert("Error creating admin");
    }
  };
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

          <form
            onSubmit={handleSubmit}
            className="w-full  h-[1434px] gap-[50px] sm:p-0 md:p-0 lg:p-0 xl:p-0 2xl:p-28 overflow-hidden  mt-4 sm:mt-10 md:mt-0 lg:mt-0 xl:mt-0 2xl:-mt-20">
            <h1 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px]  xl:text-[20px] font-bold text-neutral-10 dark:text-primary-100 p-4">
              Add New Video
            </h1>
            <div className="p-8 -mt-4  bg-primary-100  dark:bg-neutral-20 rounded-sm shadow-lg">
              <h2 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px]  xl:text-[20px] font-bold text-neutral-20 dark:text-primary-100">
                Profile Information
              </h2>

              <div className="flex flex-col md:flex-row md:gap-[140px] mt-4 sm:mt-10 md:mt-10 lg:mt-10 xl:mt-10 2xl:mt-10">
                <div className="w-[200px] sm:w-[200px] md:w-[165px] lg:w-[200px] xl:w-[225px] 2xl:w-[175px]">
                  <h3 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px]  xl:text-[20px] font-bold text-neutral-20 dark:text-primary-100">
                    Photo Profile
                  </h3>
                  <p className="w-2/2 text-neutral-60 dark:text-primary-100 mt-4 text-[10px] sm:text-[10px] md:text-[12px] lg:text-[14px]  xl:text-[14px]">
                    Format foto harus .jpg, jpeg, png dan ukuran minimal 300 x
                    300 px.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-10 sm:gap-2 md:gap-2 lg:gap-6 xl:gap-6 2xl:gap-10">
                  <div className="mt-2 md:ml-0 lg:ml-4 xl:ml-0 flex justify-center items-center border border-dashed  border-neutral-60 w-[100px] h-[100px] sm:w-[100px] md:w-[120px] lg:w-[150px] sm:h-[100px] md:h-[120px] lg:h-[150px] xl:h-[150px] 2xl:h-[160px]">
                    <label
                      htmlFor="fileUpload"
                      className="flex flex-col justify-center items-center cursor-pointer text-center">
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
              </div>
              <div className="flex flex-col md:flex-row sm:gap-[140px] md:gap-[149px] lg:gap-[150px] mt-4 sm:mt-10 md:mt-10 lg:mt-10 xl:mt-10 2xl:mt-10 ">
                <div className="w-full sm:w-full md:w-[280px] lg:w-[290px] xl:w-[350px] 2xl:w-[220px] ">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px]  xl:text-[20px]  font-bold text-neutral-20 dark:text-primary-100">
                      Email
                    </h3>
                    <img
                      src={IconField}
                      alt=""
                      className="w-2 sm:w-2 md:w-4 lg:w-4 xl:w-4 2xl:w-4 h-2 sm:h-2 md:h-4 lg:h-4 xl:h-4 2xl:h-4 -mt-5"
                    />
                  </div>
                  <p className="w-2/2 text-neutral-60 dark:text-primary-100 mt-4 text-justify text-[10px] sm:text-[10px] md:text-[12px] lg:text-[14px]  xl:text-[14px] mb-2">
                    Masukan Email untuk melakukan verifikasi.
                  </p>
                </div>
                <div className="flex justify-start items-start w-full  sm:-mt-40 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0">
                  <label className="input input-bordered flex items-center gap-2 w-[686px]  sm:w-[686px] md:w-[420px] lg:w-[650px] xl:w-full h-[40px] sm:h-[48px] md:h-[48px] lg:h-[48px] xl:h-[48px] 2xl:h-[48px] border border-neutral-60 rounded-md p-2 bg-primary-100 dark:bg-neutral-20 dark:text-primary-100">
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
                      value={admin.email}
                      onChange={handleChange}
                      className="input border-0 focus:outline-none focus:ring-0 w-full text-neutral-20 text-[10px] sm:text-[12px] md:text-[14px] lg:text-[14px]  xl:text-[14px]"
                      placeholder="Email"
                      required
                    />
                  </label>
                </div>
              </div>
              <div className="flex flex-col md:flex-row sm:gap-[140px] md:gap-[149px] lg:gap-[150px] mt-4 sm:mt-10 md:mt-10 lg:mt-10 xl:mt-10 2xl:mt-10 ">
                <div className="w-full sm:w-full md:w-[280px] lg:w-[290px] xl:w-[350px] 2xl:w-[220px]">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px]  xl:text-[20px]  font-bold text-neutral-20 dark:text-primary-100">
                      Username
                    </h3>
                    <img
                      src={IconField}
                      alt=""
                      className="w-2 sm:w-2 md:w-4 lg:w-4 xl:w-4 2xl:w-4 h-2 h:w-2 md:h-4 lg:h-4 xl:h-4 2xl:h-4 -mt-5"
                    />
                  </div>
                  <p className="w-2/2 mb-2 text-neutral-60 dark:text-primary-100 mt-4 text-justify text-[10px] sm:text-[10px] md:text-[12px] lg:text-[14px]  xl:text-[14px]">
                    Nama username maximal 100 karakter dan jangan menggunakan
                    simbol atau angka.
                  </p>
                </div>
                <div className="flex justify-start items-start w-full  sm:-mt-40 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0">
                  <label className="input input-bordered flex items-center gap-2 w-[686px]  sm:w-[686px] md:w-[420px] lg:w-[650px] xl:w-full h-[40px] sm:h-[48px] md:h-[48px] lg:h-[48px] xl:h-[48px] 2xl:h-[48px] border border-neutral-60 rounded-md p-2 bg-primary-100 dark:bg-neutral-20 dark:text-primary-100">
                    <input
                      type="text"
                      value={admin.username}
                      onChange={handleChange}
                      className="input border-0 focus:outline-none focus:ring-0 w-full text-neutral-20 text-[10px] sm:text-[12px] md:text-[14px] lg:text-[14px]  xl:text-[14px]"
                      placeholder="Username"
                      required
                    />
                  </label>
                </div>
              </div>
              <div className="flex flex-col md:flex-row sm:gap-[140px] md:gap-[149px] lg:gap-[150px] mt-4 sm:mt-10 md:mt-10 lg:mt-10 xl:mt-10 2xl:mt-10 ">
                <div className="w-full sm:w-full md:w-[280px] lg:w-[290px] xl:w-[350px] 2xl:w-[220px]">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px]  xl:text-[20px]  font-bold text-neutral-20 dark:text-primary-100">
                      First Name
                    </h3>
                    <img
                      src={IconField}
                      alt=""
                      className="w-2 sm:w-2 md:w-4 lg:w-4 xl:w-4 2xl:w-4 h-2 h:w-2 md:h-4 lg:h-4 xl:h-4 2xl:h-4 -mt-5"
                    />
                  </div>
                  <p className="w-2/2 mb-2 text-neutral-60 dark:text-primary-100 mt-4 text-justify text-[10px] sm:text-[10px] md:text-[12px] lg:text-[14px]  xl:text-[14px]">
                    Nama username maximal 100 karakter.
                  </p>
                </div>
                <div className="flex justify-start items-start w-full  sm:-mt-40 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0">
                  <label className="input input-bordered flex items-center gap-2 w-[686px]  sm:w-[686px] md:w-[420px] lg:w-[650px] xl:w-full h-[40px] sm:h-[48px] md:h-[48px] lg:h-[48px] xl:h-[48px] 2xl:h-[48px] border border-neutral-60 rounded-md p-2 bg-primary-100 dark:bg-neutral-20 dark:text-primary-100">
                    <input
                      type="text"
                      value={admin.firstName}
                      onChange={handleChange}
                      className="input border-0 focus:outline-none focus:ring-0 w-full text-neutral-20 text-[10px] sm:text-[12px] md:text-[14px] lg:text-[14px]  xl:text-[14px]"
                      placeholder="First Name"
                      required
                    />
                  </label>
                </div>
              </div>
              <div className="flex flex-col md:flex-row sm:gap-[140px] md:gap-[149px] lg:gap-[150px] mt-4 sm:mt-10 md:mt-10 lg:mt-10 xl:mt-10 2xl:mt-10 ">
                <div className="w-full sm:w-full md:w-[280px] lg:w-[290px] xl:w-[350px] 2xl:w-[220px]">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px]  xl:text-[20px]  font-bold text-neutral-20 dark:text-primary-100">
                      Last Name
                    </h3>
                    <img
                      src={IconField}
                      alt=""
                      className="w-2 sm:w-2 md:w-4 lg:w-4 xl:w-4 2xl:w-4 h-2 h:w-2 md:h-4 lg:h-4 xl:h-4 2xl:h-4 -mt-5"
                    />
                  </div>
                  <p className="w-2/2 mb-2 text-neutral-60 dark:text-primary-100 mt-4 text-justify text-[10px] sm:text-[10px] md:text-[12px] lg:text-[14px]  xl:text-[14px]">
                    Nama LastName maximal 100 karakter.
                  </p>
                </div>
                <div className="flex justify-start items-start w-full  sm:-mt-40 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0">
                  <label className="input input-bordered flex items-center gap-2 w-[686px]  sm:w-[686px] md:w-[420px] lg:w-[650px] xl:w-full h-[40px] sm:h-[48px] md:h-[48px] lg:h-[48px] xl:h-[48px] 2xl:h-[48px] border border-neutral-60 rounded-md p-2 bg-primary-100 dark:bg-neutral-20 dark:text-primary-100">
                    <input
                      type="text"
                      value={admin.lastName}
                      onChange={handleChange}
                      className="input border-0 focus:outline-none focus:ring-0 w-full text-neutral-20 text-[10px] sm:text-[12px] md:text-[14px] lg:text-[14px]  xl:text-[14px]"
                      placeholder="Last Name"
                      required
                    />
                  </label>
                </div>
              </div>
              <div className="flex flex-col md:flex-row sm:gap-[140px] md:gap-[149px] lg:gap-[150px] mt-4 sm:mt-10 md:mt-10 lg:mt-10 xl:mt-10 2xl:mt-10 ">
                <div className="w-full sm:w-full md:w-[280px] lg:w-[290px] xl:w-[350px] 2xl:w-[220px]">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px]  xl:text-[20px]  font-bold text-neutral-20 dark:text-primary-100">
                      Roles
                    </h3>
                    <img
                      src={IconField}
                      alt=""
                      className="w-2 sm:w-2 md:w-4 lg:w-4 xl:w-4 2xl:w-4 h-2 h:w-2 md:h-4 lg:h-4 xl:h-4 2xl:h-4 -mt-5"
                    />
                  </div>
                  <p className="w-2/2 mb-2 text-neutral-60 dark:text-primary-100 mt-4 text-justify text-[10px] sm:text-[10px] md:text-[12px] lg:text-[14px]  xl:text-[14px]">
                    masukan Role untuk memberikan akses berdasarkan role
                    masing-masing.
                  </p>
                </div>
                <div className="flex justify-start items-start w-full  sm:-mt-40 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0">
                  <label className="input input-bordered flex items-center gap-2 w-[686px]  sm:w-[686px] md:w-[420px] lg:w-[650px] xl:w-full h-[40px] sm:h-[48px] md:h-[48px] lg:h-[48px] xl:h-[48px] 2xl:h-[48px] border border-neutral-60 rounded-md p-2 bg-primary-100 dark:bg-neutral-20 dark:text-primary-100">
                    <select
                      className="input border-0 focus:outline-none h-10 focus:ring-0 w-full text-neutral-20 text-[10px] sm:text-[12px] md:text-[14px] lg:text-[14px] xl:text-[14px] bg-primary-100 dark:bg-neutral-20 dark:text-primary-100"
                      name="role"
                      value={admin.role}
                      onChange={handleChange}
                      defaultValue="">
                      <option value="" disabled>
                        Select Role
                      </option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                  </label>
                </div>
              </div>
              <div className="flex flex-col md:flex-row sm:gap-[140px] md:gap-[149px] lg:gap-[150px] mt-4 sm:mt-10 md:mt-10 lg:mt-10 xl:mt-10 2xl:mt-10 ">
                <div className="w-full sm:w-full md:w-[280px] lg:w-[290px] xl:w-[350px] 2xl:w-[220px]">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px]  xl:text-[20px]  font-bold text-neutral-20 dark:text-primary-100">
                      Password
                    </h3>
                    <img
                      src={IconField}
                      alt=""
                      className="w-2 sm:w-2 md:w-4 lg:w-4 xl:w-4 2xl:w-4 h-2 h:w-2 md:h-4 lg:h-4 xl:h-4 2xl:h-4 -mt-5"
                    />
                  </div>
                  <p className="w-2/2 mb-2 text-neutral-60 dark:text-primary-100 mt-4 text-justify text-[10px] sm:text-[10px] md:text-[12px] lg:text-[14px]  xl:text-[14px]">
                    masukan password dengan minimal 1 huruf kapital, wajib
                    menggunakan angka dan jangan menggunakan simbol @#$%^&* :;
                    dan minimal 8 karakter.
                  </p>
                </div>
                <div className="flex justify-start items-start w-full  sm:-mt-40 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0">
                  <label className="input input-bordered flex items-center gap-2 w-[686px]  sm:w-[686px] md:w-[420px] lg:w-[650px] xl:w-full h-[40px] sm:h-[48px] md:h-[48px] lg:h-[48px] xl:h-[48px] 2xl:h-[48px] border border-neutral-60 rounded-md p-2 bg-primary-100 dark:bg-neutral-20 dark:text-primary-100">
                    <input
                      type="password"
                      value={admin.password}
                      onChange={handleChange}
                      className="input border-0 focus:outline-none focus:ring-0  w-full text-neutral-20 text-[10px] sm:text-[12px] md:text-[14px] lg:text-[14px]  xl:text-[14px]"
                      placeholder="password"
                      required
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="w-full inline-flex sm:gap-6 xl:gap-[21px] justify-center sm:justify-center md:justify-end  gap-6 mt-12 sm:mt-12 md:mt-14 lg:mt-14 xl:mt-16  ">
              <button className="btn bg-neutral-60 border-neutral-60 hover:bg-neutral-60 hover:border-neutral-60 rounded-lg  font-semibold   text-primary-100 text-center text-[10px]  sm:text-[14px] md:text-[18px] lg:text-[20px] xl:text-[20px] 2xl:text-[20px],  w-[90px] sm:w-[150px] md:w-[200px] xl:w-[200px] 2xl:w-[200px] ,  h-[30px] sm:h-[50px] md:h-[60px] lg:w-[200px] lg:h-[60px] xl:h-[60px] 2xl:h-[60px]">
                Cancel
              </button>
              <button
                type="submit"
                className="btn  bg-secondary-40 border-secondary-40 hover:bg-secondary-40 hover:border-secondary-40 rounded-lg  font-semibold leading-[24px]  text-primary-100 text-center  text-[10px]  sm:text-[14px] md:text-[18px] lg:text-[20px] xl:text-[20px] 2xl:text-[20px],  w-[90px] sm:w-[150px] md:w-[200px] xl:w-[200px] 2xl:w-[200px] ,  h-[30px] sm:h-[50px] md:h-[60px] lg:w-[200px] lg:h-[60px] xl:h-[60px] 2xl:h-[60px]">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddAdmin;
