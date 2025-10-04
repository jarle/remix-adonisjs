import type { AdonisApplicationContext } from '@matstack/react-adonisjs/types';

declare module 'react-router' {
  interface RouterContextProvider extends AdonisApplicationContext { }
}
