import IconUser from "../../assets/icon/iconHeader/iconUser.png";
import IconCart from "../../assets/icon/iconHeader/iconCart.png";
import IconDarkMode from "../../assets/icon/iconHeader/iconDarkMode.png";
import Logo from "../../assets/icon/logo.png";
import IconSearch from "../../assets/icon/iconHeader/iconSearch.png";

function AssetVideo() {
  return (
    <>
      <div>
        <div className="navbar bg-[#171717] gap-8">
          <div className="flex-1 items-center">
            <img className=" w-14 h-14" src={Logo} />
            <a className="btn btn-ghost text-xl text-white">PixelStore</a>
          </div>
          <div className="w-[660px] h-[43.93px] bg-[#FFFFFF] rounded-[10px]">
            <p className="ml-4 w-16 h-[43.93px] pt-2">Search |</p>
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-[510px] h-[23px] ml-2  bg-[#FFFFFF] border-none"
            />
            <div className="w-[59.96px] h-[43.93px] bg-[#2563EB] pt-2 ml-12 rounded-r-[10px] ">
              <img className="w-[25px] h-[28px] ml-4" src={IconSearch} />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="bg-blue-500">
              <img src={IconDarkMode} alt="" />
            </div>
            <div className="dropdown dropdown-end ">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar flex-col w-40 h-10 rounded-[10px] bg-[#F2F2F2] hover:bg-[#F2F2F2] ">
                <div className=" rounded-full ml-4">
                  <img alt="" src={IconUser} />
                </div>
                <div className="w-40 pt-4 -ml-10">Hello, Sign in</div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-[#F2F2F2] rounded-box z-[1] mt-3 w-52 p-2 shadow ">
                <li>
                  <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a>Logout</a>
                </li>
              </ul>
            </div>

            <div className="bg-blue-500 w-[65.95] h-10 -right-10 flex">
              <img alt="" src={IconCart} />
              <h1 className="ml-4">Hello Cart</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AssetVideo;
