import { mergeConfig, type UserConfig } from 'vite';

export default (config: UserConfig) => {
    // Important: always return the modified config
    return mergeConfig(config, {
        server: {
            allowedHosts: [
                'venally-regionalistic-chantay.ngrok-free.dev',
                'localhost',
            ],
        },
        resolve: {
            alias: {
                '@': '/src',
            },
        },
    });
};
