import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // for docker:
  server: {
   // watch: {
    // usePolling: true,
   // },
    host: true, // Here
    //strictPort: true,
   // port: 5173, 
  
  }
})
