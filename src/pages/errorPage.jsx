import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Error() {
  const [homeLink, setHomeLink] = useState("/");
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");

    if (userRole === "admin" || userRole === "superadmin") {
      setHomeLink("/dashboard");
    }
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary-100 font-poppins">
      <div className="gap-6 flex-col justify-center text-center items-center">
        <svg
          width="133"
          height="132"
          viewBox="0 0 133 132"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto">
          <g id="FileX">
            <path
              id="Vector"
              d="M110.668 42.4566L81.7934 13.5816C81.4101 13.1986 80.955 12.895 80.4543 12.6879C79.9535 12.4809 79.4169 12.3746 78.875 12.375H29.375C27.187 12.375 25.0885 13.2442 23.5414 14.7914C21.9942 16.3385 21.125 18.437 21.125 20.625V111.375C21.125 113.563 21.9942 115.661 23.5414 117.209C25.0885 118.756 27.187 119.625 29.375 119.625H103.625C105.813 119.625 107.911 118.756 109.459 117.209C111.006 115.661 111.875 113.563 111.875 111.375V45.375C111.875 44.8331 111.769 44.2965 111.562 43.7957C111.355 43.295 111.051 42.8399 110.668 42.4566ZM83 26.4567L97.7933 41.25H83V26.4567ZM103.625 111.375H29.375V20.625H74.75V45.375C74.75 46.469 75.1846 47.5182 75.9582 48.2918C76.7318 49.0654 77.781 49.5 78.875 49.5H103.625V111.375ZM81.7934 68.9184L72.3317 78.375L81.7934 87.8316C82.1767 88.2148 82.4807 88.6698 82.6881 89.1706C82.8955 89.6713 83.0023 90.208 83.0023 90.75C83.0023 91.292 82.8955 91.8287 82.6881 92.3294C82.4807 92.8302 82.1767 93.2852 81.7934 93.6684C81.4102 94.0517 80.9552 94.3557 80.4544 94.5631C79.9537 94.7705 79.417 94.8773 78.875 94.8773C78.333 94.8773 77.7963 94.7705 77.2956 94.5631C76.7948 94.3557 76.3398 94.0517 75.9566 93.6684L66.5 84.2067L57.0434 93.6684C56.6602 94.0517 56.2052 94.3557 55.7044 94.5631C55.2037 94.7705 54.667 94.8773 54.125 94.8773C53.583 94.8773 53.0463 94.7705 52.5456 94.5631C52.0448 94.3557 51.5898 94.0517 51.2066 93.6684C50.8233 93.2852 50.5193 92.8302 50.3119 92.3294C50.1045 91.8287 49.9977 91.292 49.9977 90.75C49.9977 90.208 50.1045 89.6713 50.3119 89.1706C50.5193 88.6698 50.8233 88.2148 51.2066 87.8316L60.6683 78.375L51.2066 68.9184C50.4325 68.1444 49.9977 67.0946 49.9977 66C49.9977 64.9054 50.4325 63.8556 51.2066 63.0816C51.9806 62.3075 53.0304 61.8727 54.125 61.8727C55.2196 61.8727 56.2694 62.3075 57.0434 63.0816L66.5 72.5433L75.9566 63.0816C76.3398 62.6983 76.7948 62.3943 77.2956 62.1869C77.7963 61.9795 78.333 61.8727 78.875 61.8727C79.417 61.8727 79.9537 61.9795 80.4544 62.1869C80.9552 62.3943 81.4102 62.6983 81.7934 63.0816C82.1767 63.4648 82.4807 63.9198 82.6881 64.4206C82.8955 64.9213 83.0023 65.458 83.0023 66C83.0023 66.542 82.8955 67.0787 82.6881 67.5794C82.4807 68.0802 82.1767 68.5352 81.7934 68.9184Z"
              fill="black"
            />
          </g>
        </svg>
        <h1 className="text-primary-30 lg:text-[44px] font-bold lg:leading-[58px]">
          404 ERROR
        </h1>
        <p className="text-neutral-20 lg:text-4xl lg:leading-[46px]">
          Sorry, page not found.
        </p>
      </div>

      <button
        className="btn btn-form-secondary bg-secondary-40 border-primary-100 text-primary-100 font-semobold hover:bg-secondary-30 hover:font-bold text-xs mt-[46px] w-90 h-16"
        onClick={handleBack}>
        Go Back
      </button>
    </div>
  );
}