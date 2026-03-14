import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        host: true,
        port: 5173,
        open: true,
        strictPort: true,
        base: 'jiwooleeer/graduate/', // repo 이름으로
    }
});
