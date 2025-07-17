"use client";

import * as Select from "@radix-ui/react-select";
import { InputHTMLAttributes, TextareaHTMLAttributes, useState } from "react";
import { UseFormRegister } from "react-hook-form";
import clsx from "clsx";
import {
  CaretDownIcon,
  CheckIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@phosphor-icons/react";
import { Controller, Control } from "react-hook-form";
import { IMaskInput } from "react-imask";
import type { IMaskInputProps } from "react-imask";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>;
}

/**
 * Generic input component that adapts its paddings and colours depending
 * on whether an icon is present and whether an error exists.
 * Visual style (as per mock‑up):
 *  • black / transparent background
 *  • white 1 px border (red on error)
 *  • white text, neutral‑400 placeholder
 *  • left icon and right icon are white
 *  • 12 px radius to match rounded rectangle on design
 */
export function TextField({
  error,
  rightIcon,
  leftIcon,
  register,
  className,
  ...props
}: TextFieldProps) {
  const hasLeftIcon = Boolean(leftIcon);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="relative w-full">
        {leftIcon && (
          <span
            className={clsx(
              "absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-200",
              isFocused ? "text-zhex-base-500" : "text-neutral-400"
            )}
          >
            {leftIcon}
          </span>
        )}

        <input
          {...props}
          {...(register ? register(props.name || "") : {})}
          className={clsx(
            "w-full py-3 pr-4 transition-all duration-200", // vertical padding + right padding
            hasLeftIcon ? "pl-12" : "pl-4", // extra room when icon
            "rounded-xl border bg-transparent outline-none transition-colors",
            // colours
            error ? "border-red-secondary-500" : "border-neutral-100",
            "text-neutral-1000 placeholder:text-neutral-400",
            "focus:ring-2 focus:ring-zhex-base-500",
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {rightIcon && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
            {rightIcon}
          </span>
        )}
      </div>

      {error && <span className="text-red-secondary-500 text-sm">{error}</span>}
    </div>
  );
}

export function PasswordField({ error, ...props }: TextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      {...props}
      type={showPassword ? "text" : "password"}
      rightIcon={
        <button
          type="button"
          className="flex items-center justify-center h-full w-8"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeSlashIcon className="w-5 h-5 text-current" />
          ) : (
            <EyeIcon className="w-5 h-5 text-current" />
          )}
        </button>
      }
      error={error}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* MaskedTextField – usa react-imask                                          */
/* -------------------------------------------------------------------------- */
type BaseMaskProps = Omit<
  IMaskInputProps<any>, // Provide the required type argument here
  "mask" | "onAccept" | "inputRef" | "value" | "onChange"
>;

interface MaskedTextFieldProps extends BaseMaskProps {
  /** Máscara IMask. Ex.: '00.000.000/0000-00', '(00) 00000‑0000' */
  mask: string | RegExp | (string | RegExp)[];
  error?: string;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>;
}

export function MaskedTextField({
  mask,
  error,
  rightIcon,
  leftIcon,
  register,
  className,
  ...props
}: MaskedTextFieldProps) {
  const hasLeftIcon = Boolean(leftIcon);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="relative w-full">
        {leftIcon && (
          <span
            className={clsx(
              "absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-200",
              isFocused ? "text-zhex-base-500" : "text-neutral-400"
            )}
          >
            {leftIcon}
          </span>
        )}

        <IMaskInput
          {...(register ? (register(props.name || "") as any) : {})}
          {...props}
          mask={mask}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e as any);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e as any);
          }}
          className={clsx(
            "w-full py-3 pr-4 transition-all duration-200",
            hasLeftIcon ? "pl-12" : "pl-4",
            "rounded-xl border bg-transparent outline-none transition-colors",
            error ? "border-red-secondary-500" : "border-neutral-100",
            "text-neutral-1000 placeholder:text-neutral-400",
            "focus:ring-2 focus:ring-zhex-base-500",
            className
          )}
        />

        {rightIcon && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
            {rightIcon}
          </span>
        )}
      </div>

      {error && <span className="text-red-secondary-500 text-sm">{error}</span>}
    </div>
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  /** nome do campo no RHF */
  name: string;
  control: Control<any>; // tipar o seu form se quiser
  options: SelectOption[];
  placeholder?: string;
  /** exiba erro em vermelho igual ao TextField */
  error?: string | boolean;
}

export function SelectField({
  name,
  control,
  options,
  placeholder = "Selecione",
  error,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select.Root value={field.value} onValueChange={field.onChange}>
            <Select.Trigger
              className={clsx(
                "flex h-12 w-full items-center justify-between rounded-xl border px-4",
                "bg-transparent text-neutral-1000",
                error ? "border-red-secondary-500" : "border-neutral-100",
                "placeholder:text-neutral-400",
                "focus:ring-2 focus:ring-zhex-base-500 outline-none transition-colors"
              )}
            >
              <Select.Value placeholder={placeholder} />
              <Select.Icon>
                <CaretDownIcon size={20} className="text-zhex-base-500" />
              </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
              <Select.Content
                style={{ width: "var(--radix-select-trigger-width)" }}
                className="z-[60] w-full rounded-xl border border-neutral-100 bg-white shadow-lg overflow-y-auto"
                position="popper"
                sideOffset={4}
              >
                <Select.Viewport className="p-1">
                  {options.map((opt) => (
                    <Select.Item
                      key={opt.value}
                      value={opt.value}
                      className={clsx(
                        "flex cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2",
                        "text-neutral-1000",
                        "radix-statese-500 radix-state-checked:text-neutral-0",
                        "focus:bg-zhex-base-500 focus:text-neutral-0",
                        "transition-colors"
                      )}
                    >
                      <Select.ItemText>{opt.label}</Select.ItemText>
                      <Select.ItemIndicator>
                        <CheckIcon size={16} className="text-neutral-0" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        )}
      />

      {error && <span className="text-red-secondary-500 text-sm">{error}</span>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>;
  leftIcon?: React.ReactNode;
}

export function Textarea({
  error,
  register,
  className,
  leftIcon,
  rows = 4,
  ...props
}: TextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasLeftIcon = Boolean(leftIcon);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="relative w-full">
        {leftIcon && (
          <span
            className={clsx(
              "absolute left-4 top-4 transition-all duration-200",
              isFocused ? "text-zhex-base-500" : "text-neutral-400"
            )}
          >
            {leftIcon}
          </span>
        )}

        <textarea
          {...props}
          {...(register ? register(props.name || "") : {})}
          rows={rows}
          className={clsx(
            "w-full py-3 pr-4 transition-all duration-200",
            hasLeftIcon ? "pl-12" : "pl-4",
            "rounded-xl border bg-transparent outline-none",
            error ? "border-red-secondary-500" : "border-neutral-100",
            "text-neutral-1000 placeholder:text-neutral-400",
            "focus:ring-2 focus:ring-zhex-base-500",
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>

      {error && <span className="text-red-secondary-500 text-sm">{error}</span>}
    </div>
  );
}
