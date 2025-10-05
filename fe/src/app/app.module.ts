import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // DragDropModule,
    MatIconModule,
    NgxExtendedPdfViewerModule,
  ],
  providers: [
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
