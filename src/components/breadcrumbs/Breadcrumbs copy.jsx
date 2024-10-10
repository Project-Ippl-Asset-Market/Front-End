import { useLocation } from "react-router-dom";
import { Breadcrumb } from "flowbite-react";
import { Link as RouterLink } from "react-router-dom";
import { nameMap } from "./PathMap";

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
