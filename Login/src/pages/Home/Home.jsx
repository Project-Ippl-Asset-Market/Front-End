import React, { useState } from 'react';
import IconUser from "../../assets/icon/iconHeader/iconUser.png";
import IconCart from "../../assets/icon/iconHeader/iconCart.png";
import IconDarkMode from "../../assets/icon/iconHeader/iconDarkMode.png";
import Logo from "../../assets/icon/logo.png";
import IconSearch from "../../assets/icon/iconHeader/iconSearch.png";
import Dataset from "../../assets/icon/iconSidebar/dataset.png";
import IconLike from "../../assets/icon/iconSidebar/iconLike.png";
import Banner from "../../assets/icon/iconAsset/banner.png";
function Home() {
  
  return (
    <div>
      {/* Header */}
      <header className="navbar bg-[#171717] flex justify-between items-center ">
        <div className="flex items-center">
          <img src={Logo} alt="Logo" className="h-20 w-20 mr-10 ml-10" />
          <span className="text-2xl font-semibold text-white">PixelStore</span>
        </div>
        <div className="ml-28 w-[660px] h-[40px] bg-[#FFFFFF] rounded-[5px]">
            <p className="ml-4 w-16 h-[43.93px] pt-2">Search |</p>
          <input 
            type="text" 
            placeholder="type" 
            className="input input-bordered w-[510px] h-[23px] ml-2 pt-1 bg-[#FFFFFF] border-none" 
          />
          <div className="w-[59.96px] h-[40px] bg-[#2563EB] pt-2 ml-12 rounded-r  -[5px] ">
            <img className="w-[25px] h-[28px] ml-4" src={IconSearch} />
          </div>
        </div>
        <div className="flex gap-2 space-x-4">
          <div className="w-10 h-10 bg-[#F2F2F2] rounded-[5px] flex items-center justify-center -mr-6">
            <img src={IconDarkMode} alt=""></img>
          </div>
        </div>
        <div className="bg-[#F2F2F2] w-[75.95] h-[40px] flex rounded-[5px] pl-2 pr-2 -mr-6">
            <img alt="" src={IconCart} />
            <h1 className="ml-2">Cart</h1>
        </div>
        <div className="dropdown dropdown-end ">
            <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar flex-col mr-6 w-[140px] h-[40px] rounded-[7px] bg-[#F2F2F2] hover:bg-[white]">
            <div className="w-[24.98px] h-[25px] rounded-full ml-2 ">
                <img alt="" src={IconUser} />
            </div>
            <div className="w-[130px] h-[30px] pt-2 -ml-7">Hello, Sign in</div>
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
      </header>

      {/* Navigation */}
      <nav className="bg-[#201E43] text-white py-4">
        <ul className="flex justify-start">
          <li className='ml-10'><a href="#" className="border-b-4 border-[#2563EB] pb-1">Telusuri Semua</a></li>
          <li className='ml-8'><a> | </a></li>
          <li  className='ml-10'><a href="#" className="hover:underline">Asset Video</a></li>
          <li className='ml-10'><a href="#" className="hover:underline">Asset Gambar</a></li>
          <li className='ml-10'><a href="#" className="hover:underline">Asset Dataset</a></li>
          <li className='ml-10'><a href="#" className="hover:underline">Asset Game</a></li>
          <li className='ml-auto '><a> | </a></li>
          <li className='ml-8 mr-10'><a href="#" className="hover:underline">Asset Gratis</a></li>
        </ul>
      </nav>
      <div className='w-full h-[180px] border-b'>
        <img src={Banner} alt="Banner" />
      </div>



    </div>
  )
}

export default Home;
