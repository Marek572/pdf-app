import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Toolbar } from './toolbar/toolbar';
import { Sidebar } from './sidebar/sidebar';
import { PdfViewer } from './pdf-viewer/pdf-viewer';

@NgModule({
  declarations: [AppComponent, Toolbar, Sidebar, PdfViewer],
  imports: [BrowserModule, AppRoutingModule, MatIconModule, NgxExtendedPdfViewerModule],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent],
})
export class AppModule {}
