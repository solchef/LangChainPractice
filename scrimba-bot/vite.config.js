export default defineConfig({
  define: {
    global: {},
  },
  optimizeDeps: {
    include: ['crypto'],
  },
});
