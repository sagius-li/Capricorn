import { Component, OnInit, Input } from '@angular/core';

import { DcComponent } from '../../models/dccomponent.interface';
import { DSAttributeConfig } from '../../models/attributeConfig.model';
import { UtilsService } from '../../services/utils.service';

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

  constructor(private utils: UtilsService) {}

  ngOnInit() {
    this.initComponent();
  }

  initComponent() {
    this.componentConfig = new EditorTextConfig();

    this.utils.CopyInto(this.data, this.componentConfig);
  }

  resize(size: number[]) {}

  configure() {}

  updateDataSource() {}
}
