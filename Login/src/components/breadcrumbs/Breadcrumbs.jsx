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
        Dashboard
      </Breadcrumb.Item>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        return (
          <Breadcrumb.Item key={to} href={to} as={RouterLink}>
            {getBreadcrumbName(to)}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
}
