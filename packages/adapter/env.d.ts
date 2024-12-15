import type { AdonisApplicationContext } from './src/types/main.js'

declare module 'react-router' {
  interface AppLoadContext extends AdonisApplicationContext {}
}
