// eslint-disable-next-line no-unused-vars
import React from "react";
import SidebarNavItem from "./SidebarNavItemAdmin";
import IconDashboard from "../../assets/icon/iconSidebar/iconDashboard.png";
import IconAssetVideo from "../../assets/icon/iconSidebar/iconAssetVideo.png";
import IconAssetGambar from "../../assets/icon/iconSidebar/iconAssetGambar.png";
import IconAssetGame from "../../assets/icon/iconSidebar/iconAssetGame.png";
import IconAssetDataset from "../../assets/icon/iconSidebar/iconAssetDataset.png";
import IconLogout from "../../assets/icon/iconSidebar/iconLogOut.svg";
import { auth } from "../../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const navigationItems = (onLogout) => [
  {
    section: "Dashboard",
    items: [
      {
        href: "/superAdminDashboard",
        label: "Dashboard",
        icon: <img src={IconDashboard} alt="iconDashboard" />,
      },
    ],
  },
  {
    section: "Manage Assets",
    items: [
      {
        href: "/manageAssetVideo",
        label: "Manage Asset Video",
        icon: <img src={IconAssetVideo} alt="iconAssetVideo" />,
      },
      {
        href: "/manageAssetGambar",
        label: "Manage Asset Gambar",
        icon: <img src={IconAssetGambar} alt="iconAssetGambar" />,
      },
      {
        href: "/manageAssetDataset",
        label: "Manage Asset Dataset",
        icon: <img src={IconAssetDataset} alt="iconAssetDataset" />,
      },
      {
        type: "dropdown",
        label: "Manage Asset Game",
        icon: <img src={IconAssetGame} alt="iconAssetGame" />,
        children: [
          { href: "/asset-2d", label: "Add Asset 2D" },
          { href: "/asset-3d", label: "Add Asset 3D" },
          { href: "/asset-audio", label: "Add Asset Audio" },
        ],
      },
    ],
  },
  {
    section: "Log Out",
    items: [
      {
        // nnati kita ubah/ganti (/) jadi (/login) mengarah ke halman login jika sudah membuat home pagenya
        href: "/",
        label: "Log Out",
        icon: <img src={IconLogout} alt="iconLogout" />,
        onClick: onLogout,
      },
    ],
  },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      // nnati kita ubah/ganti (/) jadi (/login) mengarah ke halman login jika sudah membuat home pagenya
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <nav className="space-y-4">
      {navigationItems(handleLogout).map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <h2 className="text-xs font-semibold text-primary-12 mb-4 uppercase mt-10">
            {section.section}
          </h2>
          {section.items.map((item, itemIndex) => (
            <div
              className={section.section === "Manage Assets" ? "mb-2" : ""}
              key={itemIndex}>
              <SidebarNavItem
                item={item}
                isActive={false}
                onClick={item.onClick} // Pass onClick prop
              />
            </div>
          ))}
        </div>
      ))}
    </nav>
  );
};

export default Sidebar;
