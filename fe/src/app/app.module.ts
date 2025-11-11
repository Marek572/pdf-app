import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Toolbar } from './components/toolbar/toolbar';
import { PdfViewer } from './components/pdf-viewer/pdf-viewer';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    NgxExtendedPdfViewerModule,
    Toolbar,
    PdfViewer,
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent],
})
export class AppModule {}
