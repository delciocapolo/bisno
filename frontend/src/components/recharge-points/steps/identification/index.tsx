import { cn } from "@src/lib/utils";
import { useState } from "react";

interface IField {
  identification: string;
}

const INITIAL_VALUES: IField = {
  identification: "",
};

export default function IdentificationBox() {
  const [field, setField] = useState<IField>(INITIAL_VALUES);

  return (
    <form className="w-full p-5 bg-foreground shadow-border-style space-y-3">
      <div className="flex items-center gap-3 text-background">
        <span className="bg-primary py-1 px-2 tracking-wider font-semibold font-heading text-body-16">
          01
        </span>
        <h1 className="leading-normal uppercase font-heading text-headline-20 font-normal!">
          Identificação
        </h1>
      </div>

      <div className="space-y-1">
        <div>
          <label
            htmlFor={"identification"}
            className="text-body-12 font-bold uppercase text-background"
          >
            Nº do BI ou telemóvel do mixeiro*
          </label>
        </div>

        <div className="flex gap-3">
          <input
            id={"identification"}
            name="identification"
            type="text"
            inputMode="text"
            aria-label="Numero de telefone do mixeiro"
            value={field.identification || ""}
            onChange={(e) =>
              setField((prev) => ({ ...prev, identification: e.target.value }))
            }
            placeholder="003456789LA042 ou 923 456 789"
            maxLength={11}
            className="w-full bg-foreground px-4 py-3 text-body-16 placeholder:text-gray-400 focus:outline-none text-background border-2 border-background"
          />
          <button
            type="submit"
            className="bg-background px-4 text-body-16 font-heading font-normal! text-foreground uppercase"
          >
            Consultar
          </button>
        </div>

        <p className={cn("text-body-14! font-semibold text-gray-400")}>
          Aceitamos BI ou número de telemóvel
        </p>
      </div>
    </form>
  );
}
