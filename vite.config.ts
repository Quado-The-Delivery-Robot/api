import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vite";
import { resolve } from "path";

const config: UserConfig = {
    resolve: {
        alias: {
            $houdini: resolve(".", "$houdini"),
        },
    },
    server: {
        port: 1000,
        fs: {
            allow: [".."],
        },
    },
    plugins: [sveltekit()],
};

export default config;