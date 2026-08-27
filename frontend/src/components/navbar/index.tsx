import { Link } from "@tanstack/react-router";
import LogoApp from "../logo";
import { Icon } from "@iconify/react";

export default function Navbar() {
  return (
    <header className="h-(--header-height) fixed top-0 left-0 z-999 w-full bg-background">
      <nav className="h-full">
        <div className="h-full max-w-[94%] mx-auto flex justify-between items-center">
          <div className="">
            <LogoApp />
          </div>

          <div className="">
            <nav className="flex justify-center items-center gap-1">
              <Link
                to={"/recarga-pontos"}
                className="text-body-14 leading-11 px-3 font-medium max-lg:text-body-18 capitalize flex items-center justify-center gap-1.5"
              >
                <Icon
                  icon={"mdi:lightning-bolt"}
                  className="text-primary text-body-18"
                />
                Recarregar pontos
              </Link>

              <hr className="w-px h-7 bg-gray-700 border-0" />

              <Link
                to={"/mixeiro"}
                className="text-body-14 leading-11 px-3 font-medium max-lg:text-body-18"
              >
                Sou mixeiro
              </Link>
              <Link
                to={"/bisno"}
                className="bg-primary text-body-16 leading-11 px-5 text-headline-24 font-heading font-normal uppercase text-background tracking-wide"
              >
                Preciso de algo
              </Link>
            </nav>
          </div>
        </div>
      </nav>
    </header>
  );
}

export function NavbarHeightElement() {
  return <div className="h-(--header-height)" />;
}
