import LogoApp from "../logo";
import NavbarMobile from "./components/navbar-mobile";
import NavbarDesktop from "./components/navbar-desktop";
import { cn } from "@src/lib/utils";
import { useSelector } from "@tanstack/react-store";
import { resetNavbarStore, store } from "./store";
import { useEffect } from "react";

export default function Navbar() {
  useEffect(() => {
    return () => resetNavbarStore();
  }, []);
  return (
    <header className="relative">
      <div className="h-(--header-height) fixed top-0 left-0 z-999 w-full bg-background">
        <nav className="h-full max-w-[94%] mx-auto flex justify-between items-center">
          <div className="">
            <LogoApp />
          </div>

          <NavbarDesktop />

          <NavbarMobile />
        </nav>
      </div>
    </header>
  );
}

export function NavbarHeightElement() {
  const { isActive } = useSelector(store, (state) => state);
  return <div className={cn(isActive ? "h-62" : "h-(--header-height)")} />;
}
