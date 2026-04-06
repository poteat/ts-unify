import { CONFIG_BRAND } from "@/config/config-type";
/** Create a named config slot. */
export const C = ((name) => {
    return Object.freeze({
        [CONFIG_BRAND]: true,
        name,
    });
});
