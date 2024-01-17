"use client";
import React from "react";
import ShowHidePassword from "./ShowHidePassword";

export default function ProjectListCredentials({
    username,
    password,
}: {
    username: string;
    password: string;
}) {
    if (!username || !password) {
        return <div>no credentials</div>;
    }

    return (
        <div className="w-fit">
            <div className="text-sm text-gray-500 flex items-center">
                username: {username}
                <span className="flex items-center ml-auto">
                    <CopyButton text={username} />
                </span>
            </div>
            <div className="text-sm text-gray-500 flex gap-2 items-center">
                password:{" "}
                <span className="flex items-center">
                    <ShowHidePassword password={password} simple />
                    <CopyButton text={password} />
                </span>
            </div>
        </div>
    );
}

function CopyButton({ text }: { text: string }) {
    return (
        <button
            onClick={() => {
                navigator.clipboard.writeText(text);
            }}
            className="p-2 text-sm text-blue-200 rounded-md"
        >
            <CopyIcon />
        </button>
    );
}

function CopyIcon({ size = "18px" }: { size?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M21 8C21 6.34315 19.6569 5 18 5H10C8.34315 5 7 6.34315 7 8V20C7 21.6569 8.34315 23 10 23H18C19.6569 23 21 21.6569 21 20V8ZM19 8C19 7.44772 18.5523 7 18 7H10C9.44772 7 9 7.44772 9 8V20C9 20.5523 9.44772 21 10 21H18C18.5523 21 19 20.5523 19 20V8Z"
                fill="#ddd"
            />
            <path
                d="M6 3H16C16.5523 3 17 2.55228 17 2C17 1.44772 16.5523 1 16 1H6C4.34315 1 3 2.34315 3 4V18C3 18.5523 3.44772 19 4 19C4.55228 19 5 18.5523 5 18V4C5 3.44772 5.44772 3 6 3Z"
                fill="#ddd"
            />
        </svg>
    );
}
