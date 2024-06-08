import type { ApplicationService } from '@adonisjs/core/types'
import { ServiceProviders } from '../app/services/_index.js'

export default class ServiceProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    Object.entries(ServiceProviders).forEach(([key, creator]) => {
      this.app.container.singleton(key as any, async (resolver) => {
        const constructor = await creator()
        return resolver.make(constructor.default)
      })
    })
  }
}

type ProvidedServices = {
  [K in keyof typeof ServiceProviders]: InstanceType<
    Awaited<ReturnType<(typeof ServiceProviders)[K]>>['default']
  >
}

declare module '@adonisjs/core/types' {
  export interface ContainerBindings extends ProvidedServices {}
}
