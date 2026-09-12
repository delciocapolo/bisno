import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";
import { store } from "../store";
import { useSelector } from "@tanstack/react-store";
import { cn } from "@src/lib/utils";

export default function NavbarMobile() {
  const { isActive } = useSelector(store, (state) => state);

  const onToggleMenu = () => {
    store.setState((prev) => ({
      ...prev,
      isActive: !prev.isActive,
    }));
  };

  return (
    <div className="hidden max-lg:block">
      <button
        type="button"
        className="size-11 p-1.5 flex-center border-2 border-primary"
        onClick={onToggleMenu}
      >
        {isActive ? (
          <Icon icon={"mdi:close"} className="text-primary text-5xl" />
        ) : (
          <Icon icon={"mdi:menu"} className="text-primary text-5xl" />
        )}
      </button>

      <div
        className={cn(
          "w-full overflow-hidden absolute left-0 top-(--header-height) bg-background transition-transform duration-300",
          isActive ? "h-fit" : "h-0",
        )}
      >
        <div className="">
          <Link
            to="/bisno"
            className="flex justify-between items-center py-3 px-3 bg-primary text-headline-32 text-background font-normal uppercase"
          >
            Preciso de algo
            <Icon icon={"mdi:arrow-right"} className="text-2xl" />
          </Link>
          <Link
            to="/mixeiro"
            className="flex justify-start items-center gap-3 py-5 px-3 text-body-16 text-foreground font-semibold"
          >
            <Icon
              icon={"mdi:account-hard-hat"}
              className="text-xl text-primary"
            />
            Sou mixeiro
          </Link>

          <hr className="w-full h-px bg-gray-700/65 border-0" />

          <Link
            to="/recarga-pontos"
            className="flex justify-start items-center gap-3 py-5 px-3 text-body-16 text-foreground font-semibold"
          >
            <Icon
              icon={"mdi:lightning-bolt"}
              className="text-xl text-primary"
            />
            Recarregar pontos
          </Link>
        </div>
      </div>
    </div>
  );
}
