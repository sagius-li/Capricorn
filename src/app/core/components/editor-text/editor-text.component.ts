import { Component, OnInit, Input } from '@angular/core';

import { MatDialog } from '@angular/material';

import { DcComponent } from '../../models/dccomponent.interface';
import { DSAttributeConfig } from '../../models/attributeConfig.model';
import { UtilsService } from '../../services/utils.service';
import { EditorTextConfigComponent } from './editor-text-config.component';

export class EditorTextConfig extends DSAttributeConfig {
  constructor() {
    super();
  }
}

@Component({
  selector: 'app-editor-text',
  templateUrl: './editor-text.component.html',
  styleUrls: ['./editor-text.component.css']
})
export class EditorTextComponent implements OnInit, DcComponent {
  @Input()
  data: EditorTextConfig;

  componentConfig: EditorTextConfig;

  displayName: string;
  description: string;

  constructor(private utils: UtilsService, private dialog: MatDialog) {}

  ngOnInit() {
    this.initComponent();
  }

  initComponent() {
    this.componentConfig = new EditorTextConfig();

    this.utils.CopyInto(this.data, this.componentConfig);
  }

  resize(size: number[]) {}

  configure() {
    const dialogRef = this.dialog.open(EditorTextConfigComponent, {
      data: {
        objectRef: this,
        objectConfig: this.utils.DeepCopy(this.componentConfig)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result !== 'cancel') {
        this.data = result;
        this.initComponent();
      }
    });
  }

  updateDataSource() {}
}
