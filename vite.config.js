import { defineConfig } from 'vite';

export default defineConfig({
    base: '/graduate/',
    server: {
        host: true,
        port: 5173,
        open: true,
        strictPort: true,
    }
});
