import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  template: `
    <ng-template #sidebar>
      <div id="sidebarContainer">
        <pdf-sidebar-content>
          <div id="thumbnailView"></div>
        </pdf-sidebar-content>
      </div>
    </ng-template>
  `,
  styles: `
    #sidebarContainer {
      top: 20px;
    }
  `,
  imports: [NgxExtendedPdfViewerModule],
})
export class Sidebar {
  @ViewChild('sidebar', { static: true }) sidebar!: TemplateRef<void>;
}
