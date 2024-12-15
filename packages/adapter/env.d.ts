import type { LoaderContext } from './src/types/main.js';

declare module 'react-router' {
  interface AppLoadContext extends LoaderContext { }
}