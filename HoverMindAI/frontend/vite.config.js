import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/hoverbot-umd-entry.js',
      name: 'HoverBot',
      fileName: 'hoverbot-umd',
      formats: ['umd'],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': {}
  }
}); 