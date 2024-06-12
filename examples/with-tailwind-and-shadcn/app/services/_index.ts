type LazyService<T = any> = () => Promise<{ default: T }>

// Register services that should be available in the container here
export const ServiceProviders = {
  hello_service: () => import('./hello_service.js'),
} satisfies Record<string, LazyService>
