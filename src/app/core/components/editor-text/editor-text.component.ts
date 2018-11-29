import { Component, OnInit, Input } from '@angular/core';

import { MatDialog } from '@angular/material';

import { DcComponent } from '../../models/dccomponent.interface';
import { DSAttributeConfig } from '../../models/attributeConfig.model';
import { UtilsService } from '../../services/utils.service';
import { EditorTextConfigComponent } from './editor-text-config.component';
import { SwapService } from '../../services/swap.service';

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

  constructor(private utils: UtilsService, private dialog: MatDialog, private swap: SwapService) {}

  ngOnInit() {
    this.initComponent();
  }

  initComponent() {
    this.componentConfig = new EditorTextConfig();

    this.utils.CopyInto(this.data, this.componentConfig);
  }

  resize(size: number[]) {}

  configure() {
    return this.dialog.open(EditorTextConfigComponent, {
      data: {
        objectRef: this,
        objectConfig: this.utils.DeepCopy(this.componentConfig)
      }
    });
  }

  updateDataSource() {}

  onValueChange() {
    this.swap.changeEditorValue(this.componentConfig);
  }

  getValue() {
    return this.componentConfig.attribute ? this.componentConfig.attribute.Value : undefined;
  }

  setValue(value: string) {
    if (this.componentConfig.attribute) {
      this.componentConfig.attribute.Value = value;
    }
  }

  getExpression() {
    return this.componentConfig.value ? this.componentConfig.value : '';
  }

  setExpression(expression: string) {
    this.componentConfig.value = expression;
  }

  evaluateValue(dic: { [id: string]: string }) {
    if (this.componentConfig.value) {
      let expression = this.componentConfig.value;
      if (this.componentConfig.value.startsWith('<') && this.componentConfig.value.endsWith('>')) {
        Object.keys(dic).forEach(key => {
          expression = expression.replace(new RegExp(key, 'g'), `"${dic[key]}"`);
        });
        expression = expression.substring(1, expression.length - 1);
        // tslint:disable-next-line:no-eval
        this.componentConfig.attribute.Value = eval(expression);
      } else {
        Object.keys(dic).forEach(key => {
          expression = expression.replace(new RegExp(key, 'g'), dic[key]);
        });
        this.componentConfig.attribute.Value = expression;
      }
    }
  }
}
