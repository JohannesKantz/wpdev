import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const protocol = "http";
const host = "localhost:3000";

export function getUrl(subdomain?: string) {
    if (subdomain) {
        return `${protocol}://${subdomain}.${host}`;
    }
    return protocol + "://" + host;
}
