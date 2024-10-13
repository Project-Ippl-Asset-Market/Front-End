import { useLocation } from "react-router-dom";
import { Breadcrumb } from "flowbite-react";
import { Link as RouterLink } from "react-router-dom";
import { nameMap } from "../breadcrumbs/PathMap";

export default function BreadcrumbComponent() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const getBreadcrumbName = (path) => {
    return nameMap[path] || "Page Not Found";
  };

  return (
    <Breadcrumb aria-label="breadcrumb">
      <Breadcrumb.Item href="/dashboard" as={RouterLink}>
        <span className="text-[8px] sm:text-[8px] md:text-[8px] lg:text-[8px] xl:text-[10px]">
          Dashboard
        </span>
      </Breadcrumb.Item>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;

        // Cek jika kita berada di halaman Edit Admin
        if (to.startsWith("/manageAdmin/edit")) {
          if (index === pathnames.length - 1) {
            return (
              <Breadcrumb.Item key={to} href={to} as={RouterLink}>
                <span className="text-[8px] sm:text-[8px] md:text-[8px] lg:text-[8px] xl:text-[10px]">
                  Edit Admin
                </span>
              </Breadcrumb.Item>
            );
          }
          return null;
        }

        // Cek jika kita berada di halaman Edit User
        if (to.startsWith("/manageUsers/edit")) {
          if (index === pathnames.length - 1) {
            return (
              <Breadcrumb.Item key={to} href={to} as={RouterLink}>
                <span className="text-[8px] sm:text-[8px] md:text-[8px] lg:text-[8px] xl:text-[10px]">
                  Edit Users
                </span>
              </Breadcrumb.Item>
            );
          }
          return null;
        }

        return (
          <Breadcrumb.Item key={to} href={to} as={RouterLink}>
            <span className="text-[8px] sm:text-[8px] md:text-[8px] lg:text-[8px] xl:text-[10px]">
              {getBreadcrumbName(to)}
            </span>
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
}
