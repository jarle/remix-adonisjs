import type { AdonisApplicationContext } from './src/types/main.js'

declare module 'react-router' {
  interface RouterContextProvider extends AdonisApplicationContext {}
  interface Future {
    v8_middleware: true
  }
}
