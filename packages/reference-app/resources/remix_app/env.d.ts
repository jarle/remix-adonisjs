import type { AdonisApplicationContext } from '@matstack/remix-adonisjs/types';

declare module 'react-router' {
  interface AppLoadContext extends AdonisApplicationContext { }
}
