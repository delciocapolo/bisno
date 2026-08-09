import { Activity, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "@tanstack/react-store";
import { Icon } from "@iconify/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zoneService } from "@src/services/zones/index.service";
import { changeStep, store, updateStepWhatState } from "../../store";
import { cn, defaultValue } from "@src/lib/utils";
import { serviceService } from "@src/services/service/index.service";

export default function StepWhat() {
  const { step, ...state } = useSelector(store, (state) => state);
  const [isFieldFocused, setIsFieldFocused] = useState({
    searchService: false,
    searchZone: false,
  });
  const [field, setField] = useState({
    searchService: "",
    searchZone: "",
  });
  // refs
  const fieldSearchCategoryRef = useRef<HTMLInputElement | null>(null);
  const fieldSearchZoneRef = useRef<HTMLInputElement | null>(null);
  // use-queries and mutations
  const {
    mutate: searchService,
    data: searchedService,
    isPending: isLoadingSearchServices,
  } = useMutation({
    mutationFn: serviceService.list,
  });
  const {
    mutate: searchZones,
    data: searchedZones,
    isPending: isLoadingSearchZones,
  } = useMutation({
    mutationFn: zoneService.list,
  });
  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data } = await serviceService.list({ pageSize: 12 });
      return data;
    },
  });
  const { data: zones } = useQuery({
    queryKey: ["zones"],
    queryFn: async () => {
      const { data } = await zoneService.list({ pageSize: 12 });
      return data;
    },
  });

  // handlers
  const foundedService = useMemo(
    () =>
      searchedService?.data?.find(
        (service) =>
          service.id === state.stepWhat?.serviceId &&
          !services?.some((s) => s.id === state.stepWhat?.serviceId),
      ),
    [searchedService?.data, state.stepWhat?.serviceId],
  );

  const foundedZone = useMemo(
    () =>
      searchedZones?.data?.find(
        (zone) =>
          zone.id === state.stepWhat?.zoneId &&
          !zones?.some((z) => z.id === state.stepWhat?.zoneId),
      ),
    [searchedZones?.data, state.stepWhat?.zoneId],
  );

  const currentService = useMemo(
    () =>
      foundedService ||
      services?.find((service) => service.id === state.stepWhat?.serviceId),
    [foundedService, state.stepWhat?.serviceId],
  );

  const currentZone = useMemo(
    () =>
      foundedZone || zones?.find((zone) => zone.id === state.stepWhat?.zoneId),
    [foundedZone, state.stepWhat?.zoneId],
  );

  useEffect(() => {
    searchService({ serviceName: field.searchService });
  }, [field.searchService]);

  useEffect(() => {
    searchZones({ zoneName: field.searchZone });
  }, [field.searchZone]);

  return (
    <div className="w-full space-y-7">
      <div className="space-y-3">
        <div className="">
          <h1 className="text-headline-40 text-background uppercase">
            O que precisas?
          </h1>
        </div>

        <nav className="grid grid-cols-4 gap-2 max-lg:grid-cols-3">
          {services?.map((service, index) => {
            const isActive = state.stepWhat?.serviceId === service?.id;

            return (
              <button
                key={index}
                onClick={() => updateStepWhatState({ serviceId: service.id })}
                className={cn(
                  "inline-flex items-start justify-center flex-col gap-3 p-3 w-full transition-transform duration-200",
                  isActive
                    ? "shadow-border-style bg-primary -translate-x-0.5 -translate-y-0.5"
                    : "border-3 border-[#17130d]",
                )}
              >
                <Icon
                  icon={service?.icon}
                  className="text-background text-xl"
                />
                <span className="font-sans text-body-12 font-extrabold text-background uppercase text-start">
                  {service?.name}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="relative">
          <div className="flex items-center border-3 border-background h-11.5">
            <div className="flex-none w-fit">
              <label
                htmlFor="search-category"
                className="flex-center py-2.5 pl-2.5"
              >
                {isLoadingSearchServices ? (
                  <Icon
                    icon={"line-md:loading-loop"}
                    className="text-red-700 text-xl"
                  />
                ) : (
                  <Icon
                    icon={"si:search-duotone"}
                    className="text-red-700 text-xl"
                  />
                )}
              </label>
            </div>
            <div className="flex-1 h-full">
              <input
                type="text"
                id="search-category"
                ref={fieldSearchCategoryRef}
                value={field.searchService}
                placeholder="Não encontras? Pesquisa aqui..."
                autoComplete="off"
                onChange={(event) =>
                  setField((prev) => ({
                    ...prev,
                    searchService: event.target.value,
                  }))
                }
                onFocus={() =>
                  setIsFieldFocused((prev) => ({
                    ...prev,
                    searchService: true,
                  }))
                }
                onBlur={() =>
                  setIsFieldFocused((prev) => ({
                    ...prev,
                    searchService: false,
                  }))
                }
                className="px-2 text-body-14 text-background size-full focus-within:outline-none"
              />
            </div>
          </div>

          <Activity mode={isFieldFocused.searchService ? "visible" : "hidden"}>
            <ul
              className={cn(
                "absolute z-1 w-full h-fit max-h-48 overflow-y-auto bg-foreground",
                "shadow-[5px_5px_0_#17130d] border-x-3 border-x-[#17130d] border-b-3 border-b-[#17130d]",
              )}
            >
              {!isLoadingSearchServices &&
              !(searchedService?.data && searchedService?.data?.length > 0) ? (
                <li
                  className={cn(
                    "flex items-center justify-start px-3 py-2 gap-3",
                    "not-last-of-type:border-b not-last-of-type:border-b-gray-100",
                    "text-gray-400! text-body-12 font-medium",
                  )}
                >
                  Não encontrámos esse serviço. Tenta selecionar um parecido.
                </li>
              ) : (
                searchedService?.data?.map((category, index) => (
                  <li
                    key={index}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      updateStepWhatState({ serviceId: category.id });
                      setIsFieldFocused((prev) => ({
                        ...prev,
                        searchService: false,
                      }));
                      setField((prev) => ({ ...prev, searchService: "" }));
                      fieldSearchCategoryRef.current?.blur();
                    }}
                    className={cn(
                      "flex items-center justify-start bg-foreground px-3 py-2 gap-3",
                      "not-last-of-type:border-b not-last-of-type:border-b-gray-100 cursor-pointer",
                    )}
                  >
                    <Icon
                      icon={"mdi:arrow-right-thin"}
                      className="text-red-700 text-xl"
                    />
                    <span className="text-body-14 font-semibold text-background">
                      {category.name}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </Activity>

          <Activity mode={foundedService ? "visible" : "hidden"}>
            <div className="mt-3 flex items-center justify-start gap-1 text-primary bg-background w-fit px-3 py-2">
              <Icon icon={"fe:check"} className="text-xl font-semibold" />
              <span className="uppercase text-body-12 font-semibold">
                {defaultValue(foundedService?.name)}
              </span>
              <button
                className="pl-1"
                onClick={() => updateStepWhatState({ serviceId: undefined })}
              >
                <Icon
                  icon={"ion:close-sharp"}
                  className="text-xl text-foreground"
                />
              </button>
            </div>
          </Activity>
        </div>
      </div>

      <div className="space-y-3">
        <div className="">
          <h1 className="text-body-14 text-background uppercase leading-none">
            A tua zona
          </h1>
        </div>

        <nav className="flex flex-wrap gap-2">
          {zones?.map((zone, index) => {
            const isActive = state.stepWhat?.zoneId === zone?.id;

            return (
              <button
                key={index}
                onClick={() => updateStepWhatState({ zoneId: zone.id })}
                className={cn(
                  "inline-flex items-start justify-center flex-col gap-3 px-3 py-1 transition-transform duration-200 border-3 border-[#17130d]",
                  isActive ? "bg-background text-primary!" : undefined,
                  "font-sans text-sm font-bold text-background capitalize",
                )}
              >
                {zone?.name}
              </button>
            );
          })}
        </nav>

        <div className="relative">
          <div className="flex items-center border-3 border-background h-11.5">
            <div className="flex-1 h-full">
              <input
                type="text"
                id="search-category"
                ref={fieldSearchCategoryRef}
                value={field.searchZone}
                placeholder="A tua zona não está listada? Escreve o nome."
                autoComplete="off"
                onChange={(event) =>
                  setField((prev) => ({
                    ...prev,
                    searchZone: event.target.value,
                  }))
                }
                onFocus={() =>
                  setIsFieldFocused((prev) => ({
                    ...prev,
                    searchZone: true,
                  }))
                }
                onBlur={() =>
                  setIsFieldFocused((prev) => ({
                    ...prev,
                    searchZone: false,
                  }))
                }
                className="px-2 text-body-14 text-background size-full focus-within:outline-none"
              />
            </div>
          </div>

          <Activity mode={isFieldFocused.searchZone ? "visible" : "hidden"}>
            <ul
              className={cn(
                "absolute z-1 w-full h-fit max-h-48 overflow-y-auto bg-foreground",
                "shadow-[5px_5px_0_#17130d] border-x-3 border-x-[#17130d] border-b-3 border-b-[#17130d]",
              )}
            >
              {!isLoadingSearchZones &&
              !(searchedZones?.data && searchedZones?.data?.length > 0) ? (
                <li
                  className={cn(
                    "flex items-center justify-start px-3 py-2 gap-3",
                    "not-last-of-type:border-b not-last-of-type:border-b-gray-100",
                    "text-gray-400! text-body-12 font-medium",
                  )}
                >
                  Não encontrámos esse serviço. Tenta selecionar um parecido.
                </li>
              ) : (
                searchedZones?.data?.map((zone, index) => (
                  <li
                    key={index}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      updateStepWhatState({ zoneId: zone.id });
                      setIsFieldFocused((prev) => ({
                        ...prev,
                        searchZone: false,
                      }));
                      setField((prev) => ({ ...prev, searchZone: "" }));
                      fieldSearchZoneRef.current?.blur();
                    }}
                    className={cn(
                      "flex items-center justify-start bg-foreground px-3 py-2 gap-3",
                      "not-last-of-type:border-b not-last-of-type:border-b-gray-100 cursor-pointer",
                    )}
                  >
                    <Icon
                      icon={"mdi:arrow-right-thin"}
                      className="text-red-700 text-xl"
                    />
                    <span className="text-body-14 font-semibold text-background">
                      {zone.name}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </Activity>

          <Activity mode={foundedZone ? "visible" : "hidden"}>
            <div className="mt-3 flex items-center justify-start gap-1 text-primary bg-background w-fit px-3 py-2">
              <Icon icon={"fe:check"} className="text-xl font-semibold" />
              <span className="uppercase text-body-12 font-semibold">
                {foundedZone?.name || "DELCIO"}
              </span>
              <button
                className="pl-1"
                onClick={() => updateStepWhatState({ zoneId: undefined })}
              >
                <Icon
                  icon={"ion:close-sharp"}
                  className="text-xl text-foreground"
                />
              </button>
            </div>
          </Activity>
        </div>
      </div>

      <div className="space-y-3">
        <button
          disabled={!(state.stepWhat?.serviceId && state.stepWhat?.zoneId)}
          onClick={() => changeStep(2)}
          className={cn(
            "w-fit inline-flex items-center justify-center gap-2 uppercase text-headline-20 font-medium font-heading bg-background text-foreground py-3 px-5 h-13.5",
            "disabled:bg-gray-300 disabled:text-gray-500",
          )}
        >
          Continuar
          <Icon icon={"mdi:arrow-right"} fontSize={"1.25rem"} />
        </button>

        <p className="flex items-center justify-start text-body-14 text-gray-400 font-medium">
          <Activity
            mode={
              state.stepWhat?.serviceId && state.stepWhat?.zoneId
                ? "hidden"
                : "visible"
            }
          >
            Escolhe um serviço e a tua zona, para continuar.
          </Activity>

          <Activity
            mode={
              state.stepWhat?.serviceId && state.stepWhat?.zoneId
                ? "visible"
                : "hidden"
            }
          >
            <Icon icon={"material-symbols:done"} className="" />
            {`${currentService?.name} em ${currentZone?.name}`}
          </Activity>
        </p>
      </div>
    </div>
  );
}
