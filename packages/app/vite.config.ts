import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  envPrefix: ['MEDPLUM_', 'GOOGLE_', 'RECAPTCHA_', 'VITE_'],
  plugins: [react()],
  define: {
    'import.meta.env.VITE_MEDPLUM_SERVER_URL': JSON.stringify(process.env.VITE_MEDPLUM_SERVER_URL),
    'import.meta.env.VITE_MEDPLUM_CLIENT_ID': JSON.stringify(process.env.VITE_MEDPLUM_CLIENT_ID),
    'import.meta.env.VITE_MEDPLUM_PROJECT_ID': JSON.stringify(process.env.VITE_MEDPLUM_PROJECT_ID),
    'import.meta.env.VITE_APP_BASE_URL': JSON.stringify(process.env.VITE_APP_BASE_URL),
  },
  server: {
    port: 3000,
  },
  publicDir: 'static',
  build: {
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@medplum/core': path.resolve(__dirname, '../core/src'),
      '@medplum/react': path.resolve(__dirname, '../react/src'),
    },
  },
});
