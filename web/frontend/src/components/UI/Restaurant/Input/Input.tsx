"use client";
import Link from "next/link";
import React from "react";

interface InputProps {
  type?: string;
  name?: string;
  placeholder?: string;
  ref?: React.RefObject<HTMLInputElement | null>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  label?: string;
  showPassword?: boolean;
  showForgotPasswordText?: boolean;
  disableInput?: boolean;
  inputValue?: any,
  readOnly?: boolean,
  labelColor?: boolean,
}

export const Input: React.FC<InputProps> = ({
  type = "text",
  name = "input",
  placeholder = "Enter your text here",
  ref,
  onKeyDown,
  onChange,
  onClick,
  label = "Text label",
  showPassword = false,
  showForgotPasswordText = false,
  disableInput = false,
  inputValue,
  readOnly = false,
  labelColor = false

}) => {
  return (
    <div className={`${disableInput && `opacity-65`}`}>
      {label && (
        <label className={`block mb-2 font-semibold text-[var(--white)] ${labelColor && `text-black`}`}>
          {label}
        </label>
      )}

      <div
        className={`flex items-center border border-[var(--gray)] rounded-md bg-white ${type === "password" ? "pr-2" : ""
          }`}
      >
        <input
          type={showPassword && type === "password" ? "text" : type}
          name={name}
          placeholder={placeholder}
          className={`w-full border-none p-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[var(--green)] ${type == "password" && "focus:ring-0 "}`}
          ref={ref}
          onKeyDown={onKeyDown}
          onChange={onChange}
          disabled={disableInput}
          value={inputValue || ""}
          readOnly={readOnly}
        />

        {type == "password" && (
          <button
            type="button"
            className="p-2 cursor-pointer"
            onClick={onClick}
          >
            <img
              src={showPassword ? "/icons/eye.svg" : "/icons/close-eye.svg"}
              alt="password-icon"
              className="w-5 h-5"
            />
          </button>
        )}
      </div>

      {showForgotPasswordText && type === "password" && (
        <Link
          href="/auth/forgot-password"
          className="text-[var(--white)] mt-2 block"
        >
          Forgot password?
        </Link>
      )}
    </div>
  );
};
