import { Component, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: false,
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
})
export class Sidebar {
  @ViewChild('sidebar', { static: true }) sidebar!: TemplateRef<void>;
}
