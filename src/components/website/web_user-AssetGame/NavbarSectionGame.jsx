import BradcrumbsWeb from "../../breadcrumbsWeb/BreadcrumbsWeb";

const NavbarSectionGame = () => {
  return (
    <>
      <nav className="flex w-full dark:bg-neutral-5 dark:text-primary-100 text-neutral-10 fixed font-poppins bg-neutral-90 bg-opacity-90">
        <BradcrumbsWeb />
      </nav>
    </>
  );
};

export default NavbarSectionGame;
