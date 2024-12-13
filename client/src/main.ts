import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

ModuleRegistry.registerModules([ ClientSideRowModelModule ]);
