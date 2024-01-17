"use client";
import React from "react";
import { Input } from "./ui/input";

export default function ShowHidePassword({
    password: rootPassword,
    simple = false,
}: {
    password: string;
    simple?: boolean;
}) {
    const passwordRef = React.useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = React.useState<boolean>(false);

    if (simple) {
        return (
            <span className="flex justify-center items-center w-fit font-mono">
                <span>
                    {showPassword
                        ? `${rootPassword}`
                        : `${rootPassword
                              .split("")
                              .map((c) => "*")
                              .join("")}`}
                </span>
                <button
                    onClick={() => {
                        setShowPassword(!showPassword);
                    }}
                    className="p-2 text-sm text-blue-200 rounded-md"
                >
                    {showPassword ? (
                        <HideIcon size="18px" />
                    ) : (
                        <ShowIcon size="18px" />
                    )}
                </button>
            </span>
        );
    }

    return (
        <div className="flex border border-input rounded-md w-fit">
            <Input
                type={showPassword ? "text" : "password"}
                value={rootPassword}
                className="w-48"
                ref={passwordRef}
                readOnly
            />
            <button
                onClick={() => {
                    setShowPassword(!showPassword);
                }}
                className="p-1 px-4 text-sm text-blue-200 rounded-md"
            >
                {showPassword ? <HideIcon /> : <ShowIcon />}
            </button>
        </div>
    );
}

function ShowIcon({ size = "22px" }: { size?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z"
                stroke="#ddd"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z"
                stroke="#ddd"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function HideIcon({ size = "22px" }: { size?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5"
                stroke="#ddd"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
