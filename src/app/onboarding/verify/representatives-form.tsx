"use client";

import { useForm, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  TextField,
  MaskedTextField,
  SelectField,
} from "@/components/textfield";
import { brazilStates } from "@/assets/lists/brazil-states";
import { UploadIcon } from "@phosphor-icons/react";

/* -------------------------------------------------------------------------- */
/* Schema                                                                     */
/* -------------------------------------------------------------------------- */
const individualSchema = z.object({
  representativeDocument: z
    .any()
    .refine(
      (file) => file?.length > 0,
      "Documento do representante é obrigatório."
    ),
  civilFirstName: z.string().min(1, "Nome é obrigatório."),
  civilLastName: z.string().min(1, "Sobrenome é obrigatório."),
  birthDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Data inválida."),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido."),
  email: z.string().email("E‑mail inválido."),

  phone: z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido."),

  address: z.string().min(1, "Endereço é obrigatório."),
  addressNumber: z.string().min(1, "Número é obrigatório."),
  city: z.string().min(1, "Cidade é obrigatória."),
  state: z.string().length(2, "UF inválida."),
  zip: z.string().regex(/^\d{5}-\d{3}$/, "CEP inválido."),

  politicallyExposed: z.boolean().optional(),
});

type FormValues = z.infer<typeof individualSchema>;

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
export function RepresentativesForm() {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(individualSchema),
  });

  const onSubmit = (data: FormValues) => console.log(data);

  /* CEP inteligente ------------------------------------------------------- */
  const zipValue = useWatch({ control, name: "zip" });

  useEffect(() => {
    const digits = zipValue?.replace(/\D/g, "");
    if (digits && digits.length === 8) {
      fetch(`https://viacep.com.br/ws/${digits}/json/`)
        .then((r) => r.json())
        .then((d) => {
          if (!d.erro) {
            setValue("address", d.logradouro || "");
            setValue("city", d.localidade || "");
            setValue("state", d.uf || "");
          }
        })
        .catch(() => {});
    }
  }, [zipValue, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <h2 className="text-lg font-araboto font-semibold text-neutral-950">
            Documento do Representante.
          </h2>
          <p className="text-neutral-500 font-araboto max-w-xl">
            Envie um documento que comprove a identidade do representante, como
            RG, CNH ou passaporte.
          </p>
        </div>

        <label
          htmlFor="representativeDocument"
          className="flex h-[84px] w-[174px] items-center justify-center gap-2 rounded-lg bg-zhex-base-500/5 border-dashed border border-zhex-base-500/20 bg-white font-araboto"
        >
          <input
            type="file"
            id="representativeDocument"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className="hidden"
            {...register("representativeDocument")}
          />
          <span className="text-zhex-base-500 font-medium px-4 py-1.5 font-araboto items-center flex gap-2 rounded-lg bg-zhex-base-500/5 border border-zhex-base-500 hover:bg-zhex-base-500 hover:text-neutral-0 transition-all duration-300 cursor-pointer">
            <UploadIcon size={20} />
            Upload
          </span>
        </label>
      </div>

      {/* header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-araboto font-semibold text-neutral-950">
          Fundadores e Representantes.
        </h2>
        <p className="text-neutral-500 font-araboto max-w-lg">
          Adicione os dados pessoais dos fundadores ou representantes legais.
          Essas informações são necessárias para verificações de KYC.
        </p>
      </div>

      {/* grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* nome */}
        <div className="flex flex-col gap-2">
          <label className="text-neutral-950 font-araboto">
            Nome: <span className="text-red-secondary-500">*</span>
          </label>
          <TextField
            placeholder="Primeiro nome"
            {...register("civilFirstName")}
            error={errors.civilFirstName?.message}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-neutral-950 font-araboto">
            Sobrenome: <span className="text-red-secondary-500">*</span>
          </label>
          <TextField
            placeholder="Sobrenome"
            {...register("civilLastName")}
            error={errors.civilLastName?.message}
          />
        </div>
        {/* nascimento */}
        <div className="flex flex-col gap-2">
          <label className="text-neutral-950 font-araboto">
            Data de Nascimento:
          </label>
          <MaskedTextField
            mask="00/00/0000"
            placeholder="dd/mm/aaaa"
            {...register("birthDate")}
            error={errors.birthDate?.message}
          />
        </div>

        {/* CPF */}
        <div className="flex flex-col gap-2">
          <label className="text-neutral-950 font-araboto">
            CPF: <span className="text-red-secondary-500">*</span>
          </label>
          <MaskedTextField
            mask="000.000.000-00"
            placeholder="000.000.000-00"
            {...register("cpf")}
            error={errors.cpf?.message}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className="text-neutral-950 font-araboto">E‑mail:</label>
          <TextField
            type="email"
            placeholder="exemplo@email.com"
            {...register("email")}
            error={errors.email?.message}
          />
        </div>

        {/* Telefone */}
        <div className="flex flex-col gap-2">
          <label className="text-neutral-950 font-araboto">Telefone:</label>
          <MaskedTextField
            mask="(00) 00000-0000"
            placeholder="(11) 91234-5678"
            {...register("phone")}
            error={errors.phone?.message}
          />
        </div>

        {/* Endereço completo em uma linha ----------------------------------------- */}
        <div className="grid grid-cols-6 gap-4 col-span-full">
          {/* CEP */}
          <div className="flex flex-col gap-2">
            <label className="text-neutral-950 font-araboto">CEP:</label>
            <MaskedTextField
              mask="00000-000"
              placeholder="00000-000"
              {...register("zip")}
              error={errors.zip?.message}
            />
          </div>

          {/* Endereço */}
          <div className="flex flex-col gap-2 col-span-2">
            <label className="text-neutral-950 font-araboto">Endereço:</label>
            <TextField
              placeholder="Rua das Flores"
              {...register("address")}
              error={errors.address?.message}
            />
          </div>

          {/* Número */}
          <div className="flex flex-col gap-2">
            <label className="text-neutral-950 font-araboto">Número:</label>
            <TextField
              placeholder="123"
              {...register("addressNumber")}
              error={errors.addressNumber?.message}
            />
          </div>

          {/* UF */}
          <div className="flex flex-col gap-2">
            <label className="text-neutral-950 font-araboto">UF:</label>
            <SelectField
              name="state"
              control={control}
              options={brazilStates}
              placeholder="UF"
              error={errors.state?.message}
            />
          </div>

          {/* Cidade */}
          <div className="flex flex-col gap-2">
            <label className="text-neutral-950 font-araboto">Cidade:</label>
            <TextField
              placeholder="São Paulo"
              {...register("city")}
              error={errors.city?.message}
            />
          </div>
        </div>

        {/* Politicamente exposto */}
        <div className="flex items-center gap-2 col-span-full">
          <input
            type="checkbox"
            id="pep"
            {...register("politicallyExposed")}
            className="w-5 h-5 rounded border border-neutral-100 checked:bg-zhex-base-500 checked:border-zhex-base-500"
          />
          <label htmlFor="pep" className="text-neutral-950 font-araboto">
            Declaro que sou pessoa politicamente exposta
            e que os dados fornecidos são verdadeiros.
          </label>
        </div>
      </div>
    </form>
  );
}
