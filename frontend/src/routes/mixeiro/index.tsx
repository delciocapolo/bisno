import { Icon } from "@iconify/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import Navbar, { NavbarHeightElement } from "@src/components/navbar";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { cn, formatMobile } from "@src/lib/utils";
import { formCreateMixeiroSchema } from "@src/lib/schemas";
import FloatingWhatsappButton from "@src/components/floating-whatsapp-button";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@src/services/category/index.service";
import { zoneService } from "@src/services/zones/index.service";
import { channelService } from "@src/services/channels/index.service";

export const Route = createFileRoute("/mixeiro/")({
  component: RouteComponent,
});

const { fieldContext, formContext } = createFormHookContexts();
const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {},
  formComponents: {},
});

const CANAIS = [
  { value: "whatsapp", label: "WhatsApp", icon: "ic:baseline-whatsapp" },
  { value: "mobile", label: "SMS", icon: "mdi:message-text-outline" },
] as const;

function RouteComponent() {
  const { data: categories } = useQuery({
    queryKey: ["all-categories"],
    queryFn: async () => {
      const { data } = await categoryService.list();
      return data;
    },
  });
  const { data: zones } = useQuery({
    queryKey: ["all-zones"],
    queryFn: async () => {
      const { data } = await zoneService.list();
      return data;
    },
  });
  const { data: channels } = useQuery({
    queryKey: ["all-channels"],
    queryFn: async () => {
      return await channelService.list();
    },
  });
  const form = useAppForm({
    defaultValues: {
      customName: "",
      bi: "",
      mobile: "",
      hasWhatsapp: true,
      categoryId: "",
      zoneId: "",
      channel: "whatsapp" as (typeof CANAIS)[number]["value"],
    },
    validators: { onSubmit: formCreateMixeiroSchema },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <>
      <Navbar />

      <main>
        <header>
          <NavbarHeightElement />
        </header>

        <section className="py-10 bg-foreground space-y-3 max-lg:px-3">
          <article className="container mx-auto max-w-2xl">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 capitalize text-body-14 font-medium bg-transparent text-gray-700 pt-3 pr-5"
            >
              <Icon icon={"mdi:arrow-left"} fontSize={"1.15rem"} />
              Voltar
            </Link>
          </article>

          <article className="container mx-auto max-w-2xl">
            <h1 className="text-headline-40 font-heading uppercase text-background">
              Quero receber bisnos
            </h1>
            <p className="text-body-16 text-gray-700">
              Cadastra-te uma vez. Os bisnos da tua zona chegam-te directamente
              e tu é que falas com o cliente.
            </p>
          </article>

          <article className="container mx-auto max-w-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="flex flex-col gap-6"
            >
              <form.Field name="customName">
                {(field) => (
                  <div className="space-y-2">
                    <label
                      htmlFor={field.name}
                      className="text-body-12 font-bold uppercase text-background"
                    >
                      Nome completo*
                    </label>
                    <input
                      id={field.name}
                      name="customName"
                      inputMode="text"
                      type="text"
                      aria-label="Nome de mixeiro"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Ex: Domingos Cassoma"
                      className="w-full border-2 border-background bg-foreground px-4 py-3 text-body-16 placeholder:text-gray-400 focus:outline-none text-background"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="mt-1 text-body-14 text-(--error-500)">
                        {field.state.meta.errors[0]?.message}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field name="bi">
                {(field) => (
                  <div className="space-y-2">
                    <label
                      htmlFor={field.name}
                      className="text-body-12 font-bold uppercase text-background"
                    >
                      Número do BI*
                    </label>
                    <input
                      id={field.name}
                      name="bi"
                      inputMode="text"
                      type="text"
                      aria-label="Numero do bilhete de identidade do mixeiro"
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(e.target.value.toUpperCase())
                      }
                      onBlur={field.handleBlur}
                      placeholder="EX: 003456789LA042"
                      className="w-full border-2 border-background bg-foreground px-4 py-3 text-body-16 uppercase placeholder:text-gray-400 placeholder:normal-case focus:outline-none text-background"
                    />
                    <p className="flex items-center gap-2 text-body-14 text-gray-700">
                      <Icon
                        icon="mdi:shield-check"
                        fontSize="1.1rem"
                        className="text-green-600"
                      />
                      Usamos o BI só para validar quem és. Cria confiança com os
                      clientes.
                    </p>
                    {field.state.meta.errors.length > 0 && (
                      <p className="mt-1 text-body-14 text-(--error-500)">
                        {field.state.meta.errors[0]?.message}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field name="mobile">
                {(field) => (
                  <div className="space-y-2">
                    <label
                      htmlFor={field.name}
                      className="text-body-12 font-bold uppercase text-background"
                    >
                      Telemóvel*
                    </label>
                    <div className="flex border-2 border-background">
                      <span className="flex items-center bg-background px-4 text-body-16 font-black text-foreground">
                        +244
                      </span>
                      <input
                        id={field.name}
                        name="mobile"
                        type="text"
                        aria-label="Numero de telefone do mixeiro"
                        value={formatMobile(field.state.value)}
                        onChange={(e) => {
                          const mobileHandled = e.target.value
                            .split(" ")
                            .join("")
                            .replace(/\D/g, "");
                          field.handleChange(mobileHandled);
                        }}
                        onBlur={field.handleBlur}
                        placeholder="9XX XXX XXX"
                        inputMode="tel"
                        maxLength={11}
                        className="w-full bg-foreground px-4 py-3 text-body-16 placeholder:text-gray-400 focus:outline-none text-background"
                      />
                    </div>
                    {field.state.meta.errors.length > 0 && (
                      <p className="mt-1 text-body-14 text-(--error-500)">
                        {field.state.meta.errors[0]?.message}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field name="hasWhatsapp">
                {(field) => (
                  <label className="flex w-fit cursor-pointer items-center gap-3 select-none">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={field.state.value}
                      onClick={() => field.handleChange(!field.state.value)}
                      className={cn(
                        "border-3 border-background",
                        "relative h-[25px] w-12 shrink-0 transition-colors",
                        field.state.value ? "bg-[#3ADB76]" : "bg-gray-300",
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 left-0.5 size-3.75 bg-background transition-transform",
                          field.state.value
                            ? "translate-x-5.5"
                            : "translate-x-0",
                        )}
                      />
                    </button>
                    <span className="text-body-14 font-bold text-background">
                      Este número tem WhatsApp
                    </span>
                  </label>
                )}
              </form.Field>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <form.Field name="categoryId">
                  {(field) => (
                    <div className="space-y-2">
                      <label
                        htmlFor={field.name}
                        className="text-body-12 font-bold uppercase text-background"
                      >
                        Serviço*
                      </label>
                      <select
                        id={field.name}
                        name="categoryId"
                        aria-label="Categoria de serviço do mixeiro"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className="w-full border-2 border-background bg-foreground px-4 py-3 text-body-16 focus:outline-none text-background"
                      >
                        <option value="">Escolhe...</option>
                        {categories?.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </form.Field>

                <form.Field name="zoneId">
                  {(field) => (
                    <div className="space-y-2">
                      <label
                        htmlFor={field.name}
                        className="text-body-12 font-bold uppercase text-background"
                      >
                        Zona onde operas*
                      </label>
                      <select
                        id={field.name}
                        name="zoneId"
                        aria-label="Zona de actuação do mixeiro"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className="w-full border-2 border-background bg-foreground px-4 py-3 text-body-16 focus:outline-none text-background"
                      >
                        <option value="">Escolhe...</option>
                        {zones?.map((zone) => (
                          <option key={zone.id} value={zone.id}>
                            {zone.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </form.Field>
              </div>

              <form.Field name="channel">
                {(field) => (
                  <div className="space-y-2">
                    <label className="text-body-12 font-bold uppercase text-background">
                      Onde queres receber os bisnos?
                    </label>
                    <div className="grid grid-cols-2 divide-x-2 divide-background border-2 border-background">
                      {channels?.map((channel) => {
                        const active = field.state.value === channel.id;

                        return (
                          <button
                            type="button"
                            key={channel.id}
                            disabled={channel.id === "mobile"}
                            onClick={() => field.handleChange(channel.id)}
                            className={cn(
                              "group flex items-center justify-center gap-2 py-3 font-bold text-body-14",
                              active
                                ? "bg-background text-primary"
                                : "bg-foreground text-background",
                              "disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed",
                            )}
                          >
                            <Icon
                              icon={channel.icon}
                              fontSize="1.25rem"
                              className={cn(
                                active ? "text-primary" : undefined,
                                "group-disabled:text-gray-500",
                              )}
                            />
                            {channel.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </form.Field>

              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <div className="space-y-4">
                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className={cn(
                        "w-full py-4 text-body-18 font-black font-heading uppercase transition-colors",
                        canSubmit
                          ? "bg-background text-foreground"
                          : "cursor-not-allowed bg-gray-300 text-gray-600",
                      )}
                    >
                      {isSubmitting
                        ? "A enviar..."
                        : "Começar a receber bisnos"}
                    </button>
                    {/* <p className="text-body-14 text-gray-500">
                      Preenche nome, BI, telemóvel, serviço e zona
                    </p> */}
                  </div>
                )}
              </form.Subscribe>
            </form>
          </article>
        </section>
      </main>

      <FloatingWhatsappButton />
    </>
  );
}
