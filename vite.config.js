import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd(), '')};
  return {
    plugins: [vue()],
    server: {
      proxy: {
        '/api': {
          target: 'https://api.myanimelist.net/v2',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              proxyReq.setHeader('X-MAL-CLIENT-ID', process.env.MAL_CLIENT_ID);
              proxyReq.setHeader('Content-Type', 'application/json');
            })
          }
        }
      }
    }
  }
});
