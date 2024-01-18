import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const protocol = "https";
const host = process.env.HOSTNAME || "wpdev.website";

export function getUrl(subdomain?: string) {
    if (subdomain) {
        return `${protocol}://${subdomain}.${host}`;
    }
    return protocol + "://" + host;
}
