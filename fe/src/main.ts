import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

const routes: Routes = [];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    importProvidersFrom(MatIconModule, NgxExtendedPdfViewerModule),
  ],
}).catch((err) => console.error(err));
