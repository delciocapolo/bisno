import { createFileRoute } from "@tanstack/react-router";
import Navbar, { NavbarHeightElement } from "@src/components/navbar";
import RechargePointComponent from "@src/components/recharge-points";

export const Route = createFileRoute("/recarga-pontos/")({
  component: RouteComponent,
});

export default function RouteComponent() {
  return (
    <>
      <Navbar />

      <main className="">
        <header>
          <NavbarHeightElement />
        </header>

        <section className="py-10 bg-primary space-y-3 max-lg:px-3">
          <article className="container mx-auto max-w-2xl">
            <RechargePointComponent />
          </article>
        </section>
      </main>
    </>
  );
}
