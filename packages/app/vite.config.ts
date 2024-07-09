import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_MEDPLUM_SERVER_URL': JSON.stringify(process.env.VITE_MEDPLUM_SERVER_URL),
    'import.meta.env.VITE_MEDPLUM_CLIENT_ID': JSON.stringify(process.env.VITE_MEDPLUM_CLIENT_ID),
    'import.meta.env.VITE_MEDPLUM_PROJECT_ID': JSON.stringify(process.env.VITE_MEDPLUM_PROJECT_ID),
  },
})