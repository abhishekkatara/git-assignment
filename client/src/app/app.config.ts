import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { AppModule } from './app.module';

export const appConfig: ApplicationConfig = {
  providers: [importProvidersFrom([AppModule]), provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};
