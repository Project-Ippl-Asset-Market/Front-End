// eslint-disable-next-line no-unused-vars
import React, { Children } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import SidebarNavItem from "../../components/sidebarDashboardAdmin/SidebarNavItemAdmin";
import IconDashboardDark from "../../assets/icon/iconSidebar/iconDashboard.png";
import IconAssetVideoDark from "../../assets/icon/iconSidebar/iconAssetVideo.png";
import IconAssetGambarDark from "../../assets/icon/iconSidebar/iconAssetGambar.png";
import IconAssetGameDark from "../../assets/icon/iconSidebar/iconAssetGame.png";
import IconAssetDatasetDark from "../../assets/icon/iconSidebar/iconAssetDataset.png";
import IconManageAdminDark from "../../assets/icon/iconSidebar/iconManageAdmin.png";
import IconManageAdminLight from "../../assets/icon/iconSidebarLigthMode/iconManageAdminDark.svg";
// Icon untuk LightMode
import IconDashboardLight from "../../assets/icon/iconSidebarLigthMode/iconDashboardLightMode.png";
import IconAssetVideoLightMode from "../../assets/icon/iconSidebarLigthMode/iconAssetVideoLightMode.png";
import IconAssetGambarLightMode from "../../assets/icon/iconSidebarLigthMode/iconAssetGambarLightMode.png";
import IconAssetDatasetLightMode from "../../assets/icon/iconSidebarLigthMode/iconAssetDatasetLightMode.png";
import IconAssetGameLightMode from "../../assets/icon/iconSidebarLigthMode/iconAssetGameLightMode.png";
import IconlogoutLightMode from "../../assets/icon/iconSidebarLigthMode/iconLogOutDarkMode.png";
import IconlogoutDarkMode from "../../assets/icon/iconSidebar/iconLogOut.svg";
import { auth } from "../../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      navigate("/homePage");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };
  const userRole = localStorage.getItem("userRole");

  const navigationItems = [
    {
      section: "Dashboard",
      items: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: darkMode ? (
            <img src={IconDashboardDark} alt="iconDashboardDark" />
          ) : (
            <img src={IconDashboardLight} alt="iconDashboardLight" />
          ),
        },
      ],
    },
    {
      section: "Manage Assets",
      items: [
        {
          href: "/manageAssetVideo",
          label: "Manage Asset Video",
          icon: darkMode ? (
            <img src={IconAssetVideoDark} alt="iconAssetVideoDark" />
          ) : (
            <img src={IconAssetVideoLightMode} alt="iconAssetVideoLightMode" />
          ),
        },
        {
          href: "/manageAssetImage",
          label: "Manage Asset Image",
          icon: darkMode ? (
            <img src={IconAssetGambarDark} alt="iconAssetGambarDark" />
          ) : (
            <img
              src={IconAssetGambarLightMode}
              alt="iconAssetGambarLightMode"
            />
          ),
        },
        {
          href: "/manageAssetDataset",
          label: "Manage Asset Dataset",
          icon: darkMode ? (
            <img src={IconAssetDatasetDark} alt="iconAssetDatasetDark" />
          ) : (
            <img
              src={IconAssetDatasetLightMode}
              alt="iconAssetDatasetLightMode"
            />
          ),
        },
        {
          type: "dropdown",
          href: "#",
          label: "Manage Asset Game",
          icon: darkMode ? (
            <img src={IconAssetGameDark} alt="iconAssetGameDark" />
          ) : (
            <img src={IconAssetGameLightMode} alt="iconAssetGameLightMode" />
          ),
          children: [
            {
              href: "/manageAsset2D",
              label: "Manage Asset 2D",
            },
            {
              href: "/manageAsset3D",
              label: "Manage Asset 3D",
            },
            {
              href: "/manageAssetAudio",
              label: "Manage Asset Audio",
            },
          ],
        },

        {
          href: "/manageUsers/sale",
          label: "Sales",
          icon: darkMode ? (
            <img src={IconAssetDatasetDark} alt="iconAssetDatasetDark" />
          ) : (
            <img
              src={IconAssetDatasetLightMode}
              alt="iconAssetDatasetLightMode"
            />
          ),
        },
        {
          href: "/manageUsers/revenue",
          label: "Revenue",
          icon: darkMode ? (
            <img src={IconAssetDatasetDark} alt="iconAssetDatasetDark" />
          ) : (
            <img
              src={IconAssetDatasetLightMode}
              alt="iconAssetDatasetLightMode"
            />
          ),
        },
      ],
    },

    (userRole === "superadmin" || userRole === "admin") && {
      section: "User Management",
      items: [
        {
          href: "/manageUsers",
          label: "Manage Users",
          icon: darkMode ? (
            <img src={IconManageAdminDark} alt="iconManageAdminDark" />
          ) : (
            <img src={IconManageAdminLight} alt="iconlightMode" />
          ),
          children: [
            {
              href: "/manageAdmin/add",
              label: "Manage Admin",
            },
          ],
        },
      ],
    },

    userRole === "superadmin" && {
      section: "Admin Management",
      items: [
        {
          href: "/manageAdmin",
          label: "Manage Admin",
          icon: darkMode ? (
            <img src={IconManageAdminDark} alt="iconManageAdminDark" />
          ) : (
            <img src={IconManageAdminLight} alt="iconlightMode" />
          ),
          children: [
            {
              href: "/manageAdmin/add",
              label: "Manage Admin",
            },
          ],
        },
      ],
    },
    {
      section: "Log Out",
      items: [
        {
          href: "/homePage",
          label: "Log Out",
          icon: darkMode ? (
            <img src={IconlogoutDarkMode} alt="iconlogoutDarkMode" />
          ) : (
            <img src={IconlogoutLightMode} alt="iconLogoutLightMode" />
          ),
          onClick: handleLogout,
        },
      ],
    },
  ].filter(Boolean); // Kita gunakan Bolean dengan memfilter untuk menghapus nilai false jika bukan superadmin

  return (
    <nav className="space-y-4 overflow-y-auto min-h-screen h-[1000vh] p-4 bg-neutral-100 dark:bg-neutral-10 font-poppins  ">
      <div className="h-[80px] flex items-center justify-center gap-4">
        <img
          alt="Logo"
          src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
          className="w-20 h-20 rounded-full"
        />
        <h1 className="text-xl text-center font-bold text-neutral-20 dark:text-primary-100 py-8">
          LOGO
        </h1>
      </div>
      {navigationItems.map((section, sectionIndex) => (
        <div key={sectionIndex} className="text-xs ">
          <h2 className="text-xs font-semibold text-neutral-10 dark:text-primary-100 mb-2 uppercase mt-8">
            {section.section}
          </h2>
          {section.items.map((item, itemIndex) => (
            <div
              key={itemIndex}
              className={section.section === "Manage Assets" ? "mb-2" : ""}>
              <SidebarNavItem
                item={item}
                isActive={false}
                onClick={item.onClick}
              />
            </div>
          ))}
        </div>
      ))}
    </nav>
  );
};

export default Sidebar;
