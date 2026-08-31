import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { formRechargePointSchema } from "./schema";
import { cn, defaultValue } from "@src/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import { Activity, useEffect, useRef, useState } from "react";
import { verificationCodeService } from "@src/services/verification-code/index.service";
import type {
  IFormGenerateVerificationCode,
  IFormValidateVerificationCode,
} from "@src/shared/schemas/verification-code";
import { toast } from "sonner";
import { mixeiroService } from "@src/services/mixeiro/index.service";
import { subscriptionService } from "@src/services/subscriptions/index.service";

const { fieldContext, formContext } = createFormHookContexts();
const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {},
  formComponents: {},
});
const stepSchemas = {
  identification: formRechargePointSchema.pick({ identification: true }),
  subscription: formRechargePointSchema.pick({ mixeiroId: true, planId: true }),
} as const;

export type StepKey = keyof typeof stepSchemas;

interface IOTPFieldComponent {
  field1: string;
  field2: string;
  field3: string;
  field4: string;
}

interface IOTPFieldComponentProps {
  onSubmit?: (value: string) => void;
  isLoading?: boolean;
}

function OTPFieldComponent({
  onSubmit,
  isLoading = false,
}: IOTPFieldComponentProps) {
  const [fields, setFields] = useState<IOTPFieldComponent>({
    field1: "",
    field2: "",
    field3: "",
    field4: "",
  });

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = event.target.value.replace(/[^0-9]/g, "").slice(-1);

    setFields((prev) => ({
      ...prev,
      [event.target.id]: value,
    }));

    // se escreveu um valor, avança para o próximo campo
    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    const key = Object.keys(fields)[index] as keyof IOTPFieldComponent;

    if (event.key === "Backspace" && !fields[key] && index > 0) {
      // se o campo já está vazio, apaga o anterior e foca nele
      const prevKey = Object.keys(fields)[
        index - 1
      ] as keyof IOTPFieldComponent;
      setFields((prev) => ({
        ...prev,
        [prevKey]: "",
      }));
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (!pasted) return;

    const keys = Object.keys(fields) as (keyof IOTPFieldComponent)[];
    const newFields = { ...fields };

    pasted
      .slice(0, keys.length)
      .split("")
      .forEach((char, i) => {
        newFields[keys[i]] = char;
      });

    setFields(newFields);

    const lastIndex = Math.min(pasted.length, keys.length) - 1;
    inputsRef.current[lastIndex]?.focus();
  };

  useEffect(() => {
    const values = Object.values(fields);
    const allDone = values.every((value: string) => value.length);

    if (allDone) {
      onSubmit?.(values.join(""));
    }
  }, [fields]);

  return (
    <div className="grid grid-cols-4 gap-5">
      <label
        htmlFor="field1"
        className="col-span-4 text-body-16 font-semibold text-foreground"
      >
        Informe o codigo de verificação que recebeu no seu whatsapp
      </label>
      {Object.entries(fields).map((field, index) => (
        <input
          key={field[0]}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          maxLength={1}
          inputMode="numeric"
          value={field[1] || ""}
          name="verification-code"
          disabled={isLoading}
          id={`field${index + 1}`}
          placeholder="—"
          className={cn(
            "bg-background py-5 text-center text-foreground text-body-18 font-heading",
            "disabled:bg-gray-700 disabled:text-gray-400",
          )}
          onChange={(event) => handleChange(event, index)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          onPaste={index === 0 ? handlePaste : undefined}
        />
      ))}
    </div>
  );
}

export default function RechargePointComponent() {
  const [step, setStep] = useState<StepKey>("identification");

  // const {
  //   data: mixeiroSubscriptionData,
  //   mutate: createMixeiroSubscription,
  //   isPending: isMixeiroSubscriptionLoading,
  // } = useMutation({
  //   mutationFn: mixeiroSubscriptionService.create,
  // });
  const {
    data: verificationCodeData,
    reset: resetVerificationCodeData,
    mutate: generateVerificationCode,
    isPending: isverificationCodeLoading,
  } = useMutation({
    mutationFn: async (payload: IFormGenerateVerificationCode) => {
      const data = await verificationCodeService.generate(payload);
      return data?.data;
    },
    onError: (error) => {
      toast.error(error.message, { position: "top-right" });
    },
  });
  const {
    mutate: validateVerificationCode,
    isPending: isValidatingVerificationCode,
  } = useMutation({
    mutationFn: async (payload: IFormValidateVerificationCode) => {
      const data = await verificationCodeService.validate(payload);
      return data?.data;
    },
    onSuccess: (data) => {
      if (!data) return;
      setStep("subscription");
      resetVerificationCodeData();
      getMixeiro({ mobile: form.state.values.identification });
    },
    onError: (error) => {
      toast.error(error.message, { position: "top-right" });
    },
  });
  const { data: mixeiroData, mutate: getMixeiro } = useMutation({
    mutationFn: mixeiroService.getMixeiro,
    onSuccess: (data) => {
      if (!data.data?.id) {
        throw new Error("Mixeiro não encontrado");
      }
      form.setFieldValue("mixeiroId", data.data.id);
    },
  });
  const { data: subscriptions } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => subscriptionService.list(),
  });
  const form = useAppForm({
    defaultValues: {
      identification: "",
      mixeiroId: "",
      planId: "",
    },
    validators: { onSubmit: stepSchemas[step] as any },
    onSubmit: async ({ value }) => {
      if (step === "identification") {
        generateVerificationCode({ mobile: `+244${value.identification}` });
      }
    },
  });

  return (
    <div className="w-full space-y-5">
      <div className="text-background">
        <h1 className="text-headline-48 font-medium! uppercase leading-normal">
          Recarrega os teus pontos
        </h1>
        <p className="">
          <b>Pontos</b> são os bisnos que podes aceitar. Consulta o teu registo,
          escolhe o plano e recarrega.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col gap-6"
      >
        <form.Field name="identification">
          {(field) => (
            <div className="w-full p-5 bg-foreground shadow-border-style space-y-3">
              <div className="flex items-center gap-3">
                <span className="bg-background text-primary py-1 px-2 tracking-wider font-semibold font-heading text-body-16">
                  01
                </span>
                <h1 className="text-background leading-normal uppercase font-heading text-headline-20 font-normal!">
                  Identificação
                </h1>
              </div>

              <div className="space-y-1">
                <div>
                  <label
                    htmlFor={field.name}
                    className="text-body-12 font-bold uppercase text-background"
                  >
                    Nº do BI ou telemóvel do mixeiro*
                  </label>
                </div>

                <div className="flex gap-3">
                  <input
                    id={field.name}
                    name={field.name}
                    type="text"
                    maxLength={9}
                    inputMode="text"
                    placeholder="912345678"
                    value={field.state.value || ""}
                    aria-label="Numero de telefone do mixeiro"
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="flex-1 bg-foreground px-4 py-3 text-body-16 placeholder:text-gray-400 focus:outline-none text-background border-3 border-background"
                  />
                  <button
                    type="button"
                    onClick={async () => await form.handleSubmit()}
                    className="flex-none w-fit bg-background px-4 text-body-16 font-heading font-normal! text-foreground uppercase flex-center flex-nowrap text-nowrap gap-2"
                  >
                    <Activity
                      mode={!isverificationCodeLoading ? "visible" : "hidden"}
                    >
                      Consultar
                    </Activity>

                    <Activity
                      mode={isverificationCodeLoading ? "visible" : "hidden"}
                    >
                      <Icon
                        icon={"line-md:loading-twotone-loop"}
                        className=""
                      />
                      A consultar...
                    </Activity>
                  </button>
                </div>

                <Activity
                  mode={
                    !verificationCodeData && field.state.meta.errors.length > 0
                      ? "visible"
                      : "hidden"
                  }
                >
                  <p className="mt-1 text-body-12! text-(--error-700)">
                    {field.state.meta.errors[0]?.message}
                  </p>
                </Activity>

                <Activity
                  mode={
                    !verificationCodeData && field.state.meta.errors.length <= 0
                      ? "visible"
                      : "hidden"
                  }
                >
                  <p
                    className={cn("text-body-12! font-semibold text-gray-400")}
                  >
                    Aceitamos BI ou número de telemóvel
                  </p>
                </Activity>

                <Activity
                  mode={
                    verificationCodeData && field.state.meta.errors.length <= 0
                      ? "visible"
                      : "hidden"
                  }
                >
                  <p
                    className={cn(
                      "text-body-12! font-semibold text-(--success-600) flex items-center gap-0",
                    )}
                  >
                    <Icon icon={"bx:check"} className="text-lg" />
                    Registo confirmado
                  </p>
                </Activity>
              </div>

              <Activity mode={mixeiroData?.data?.id ? "visible" : "hidden"}>
                <div className="flex items-center gap-3 bg-primary border-3 border-[#17130d] px-4 py-3">
                  <div className="flex-none w-fit">
                    <Icon
                      icon={"mdi:account-check"}
                      className="leading-normal text-headline-32 text-background"
                    />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-body-18 font-heading text-background uppercase leading-normal">
                      {defaultValue(mixeiroData?.data?.customName)}
                    </h1>
                    <p className="text-body-14 font-semibold text-background">
                      {defaultValue(mixeiroData?.data?.categoryService.name)}{" "}
                      {" · "}
                      {defaultValue(mixeiroData?.data?.zone.name)} · saldo
                      actual:{" "}
                      {defaultValue(mixeiroData?.data?.subscription.points, 0)}{" "}
                      pontos
                    </p>
                  </div>
                </div>
              </Activity>

              <Activity mode={verificationCodeData ? "visible" : "hidden"}>
                <div className="flex items-center gap-3 bg-primary border-3 border-[#17130d] px-4 py-3">
                  <OTPFieldComponent
                    isLoading={isValidatingVerificationCode || false}
                    onSubmit={(value) => {
                      validateVerificationCode({
                        code: value,
                        mobile: `+244${form.state.values.identification}`,
                      });
                    }}
                  />
                </div>
              </Activity>
            </div>
          )}
        </form.Field>

        <Activity mode={mixeiroData?.data?.id ? "visible" : "hidden"}>
          <form.Field name="identification">
            {(field) => (
              <div className="w-full p-5 bg-foreground shadow-border-style space-y-3">
                <div className="flex items-center gap-3">
                  <span className="bg-primary text-primary py-1 px-2 tracking-wider font-semibold font-heading text-body-16">
                    02
                  </span>
                  <h1 className="text-background leading-normal uppercase font-heading text-headline-20 font-normal!">
                    Escolhe o plano
                  </h1>
                </div>

                <ul className="">
                  {subscriptions?.data?.map((subscription, index) => {
                    const halfPrice = subscription.price / subscription.points;

                    return (
                      <li
                        key={index}
                        className="flex items-center border-"
                        onClick={() => field.setValue(subscription.id)}
                      >
                        <div className="flex-1">
                          <h1 className="text-body-16 font-heading uppercase">
                            {subscription.name}
                          </h1>
                          <p className="text-body-14">
                            {subscription.points} pontos · {halfPrice}kz / ponto
                          </p>
                        </div>
                        <div className="flex-none w-fit">
                          <h1 className="text-body-16 font-heading uppercase">
                            {subscription.price}
                          </h1>
                          <p className="text-body-14">kz</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </form.Field>
        </Activity>
      </form>
    </div>
  );
}
