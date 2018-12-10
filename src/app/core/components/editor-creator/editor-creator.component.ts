import { Component, OnInit, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { WidgetService } from '../../services/widget.service';

@Component({
  selector: 'app-editor-creator',
  templateUrl: './editor-creator.component.html',
  styleUrls: ['./editor-creator.component.css']
})
export class EditorCreatorComponent implements OnInit {
  editorComponents: Array<any>;

  editorType: string;
  config = {
    name: '',
    attributeName: ''
  };

  constructor(
    private svcWidget: WidgetService,
    public dialogRef: MatDialogRef<EditorCreatorComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  ngOnInit() {
    this.editorComponents = this.svcWidget.widgetDefaultConfig.filter(
      w => w.type === 'AttributeEditor'
    );
  }

  onChangeType(event) {
    const setting = this.svcWidget.widgetDefaultConfig.find(w => w.name === event.value);
    if (setting) {
      this.config = setting.defaultConfig;
    }
  }
}
