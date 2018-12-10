import {
  Component,
  OnInit,
  Input,
  ComponentFactoryResolver,
  ViewChildren,
  QueryList
} from '@angular/core';

import { MatDialogRef } from '@angular/material';
import { DragulaService } from 'ng2-dragula';

import { WidgetService } from '../../services/widget.service';
import { ResourceService } from '../../services/resource.service';
import { DchostDirective } from '../../directives/dchost.directive';
import { UtilsService } from '../../services/utils.service';
import { SwapService } from '../../services/swap.service';

export class InfoDetailConfig {
  objectId?: string;
}

@Component({
  selector: 'app-info-detail',
  templateUrl: './info-detail.component.html',
  styleUrls: ['./info-detail.component.css']
})
export class InfoDetailComponent implements OnInit {
  @Input()
  config: InfoDetailConfig;

  @ViewChildren(DchostDirective)
  dcHosts: QueryList<DchostDirective>;

  currentTab: any;

  editMode = false;
  editIcon = 'settings';
  editTip = 'key_configure';

  arrangeMode = 100;
  arrangeIcon = 'view_column';
  arrangeTip = 'key_toDualColumn';

  detailConfig = [];

  detailConfigStr = `
    [
      {
        "tabName": "key_general",
        "tabOrder": 1,
        "tabData":[
          {
            "name": "txtDisplayName",
            "type": "EditorTextComponent",
            "attributeName": "DisplayName",
            "data": {
              "instanceName": "txtDisplayName"
            }
          },
          {
            "name": "txtAccountName",
            "type": "EditorTextComponent",
            "attributeName": "AccountName",
            "data": {
              "instanceName": "txtAccountName"
            }
          },
          {
            "name": "txtFirstName",
            "type": "EditorTextComponent",
            "attributeName": "FirstName",
            "data": {
              "instanceName": "txtFirstName"
            }
          },
          {
            "name": "txtLastName",
            "type": "EditorTextComponent",
            "attributeName": "LastName",
            "data": {
              "instanceName": "txtLastName"
            }
          },
          {
            "name": "txtMiddleName",
            "type": "EditorTextComponent",
            "attributeName": "MiddleName",
            "data": {
              "instanceName": "txtMiddleName"
            }
          },
          {
            "name": "txtDepartment",
            "type": "EditorTextComponent",
            "attributeName": "Department",
            "data": {
              "instanceName": "txtDepartment"
            }
          }
        ]
      }
    ]
    `;

  constructor(
    private widget: WidgetService,
    private svcResource: ResourceService,
    private cfr: ComponentFactoryResolver,
    private utils: UtilsService,
    private dragula: DragulaService,
    private swap: SwapService
  ) {
    try {
      this.dragula.createGroup('ATTRIBUTES', {
        moves: (el, container, handle) => {
          return (
            handle.classList.contains('handle') ||
            (<Element>handle.parentNode).classList.contains('handle')
          );
        }
      });
    } catch {}
  }

  ngOnInit() {
    this.config = {};

    this.detailConfig = this.widget.getWidgetConfig(this.detailConfigStr);
    this.detailConfig.sort((a, b) => a.tabOrder - b.tabOrder);

    if (this.detailConfig.length > 0) {
      this.currentTab = this.detailConfig[0];
    }

    this.swap.editorValueChanged.subscribe((config: any) => {
      const dic: { [id: string]: string } = {};
      this.currentTab.tabData.forEach(element => {
        dic[element.name] = element.componentRef.instance.getValue();
      });
      this.currentTab.tabData.forEach(element => {
        if (element.componentRef.instance.getExpression().includes(config.instanceName)) {
          element.componentRef.instance.evaluateValue(dic);
        }
      });
    });
  }

  onConfig() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.editIcon = 'save_alt';
      this.editTip = 'key_save';
    } else {
      this.editIcon = 'settings';
      this.editTip = 'key_configure';
    }
  }

  onArrange() {
    if (this.arrangeMode === 100) {
      this.arrangeMode = 50;
      this.arrangeIcon = 'reorder';
      this.arrangeTip = 'key_toSingleColumn';
    } else if (this.arrangeMode === 50) {
      this.arrangeMode = 100;
      this.arrangeIcon = 'view_column';
      this.arrangeTip = 'key_toDualColumn';
    }
  }

  updateDetail(objectId: string) {
    if (this.detailConfig && this.detailConfig.length > 0) {
      if (objectId) {
        this.config.objectId = objectId;
        const attributesToLoad = this.currentTab.tabData.map(a => a.attributeName);
        this.svcResource
          .getResourceByID(objectId, attributesToLoad, false, true)
          .subscribe(result => {
            setTimeout(() => {
              this.currentTab.tabData.forEach(widget => {
                const componentFactory = this.cfr.resolveComponentFactory(widget.type);
                const host = this.dcHosts.find(h => h.hostName === widget.name);
                if (host) {
                  const viewContainerRef = host.viewContainerRef;
                  viewContainerRef.clear();
                  const componentRef = viewContainerRef.createComponent(componentFactory);
                  widget.componentRef = componentRef;
                  const com: any = componentRef.instance;
                  com.data = widget.data;
                  com.data.attribute = result.Attributes[widget.attributeName];
                }
              });
            }, 0);
          });
      }
    }
  }

  onEditorConfig(config) {
    const con = config;
    const com = config.componentRef.instance;
    const dialogRef: MatDialogRef<any> = com.configure();
    dialogRef.afterClosed().subscribe(result => {
      if (result && result !== 'cancel') {
        com.data = result;
        com.initComponent();
        if (result.expression) {
          const instanceNames = this.currentTab.tabData.map(a => a.name);
          if (instanceNames.some(n => result.expression.indexOf(n) >= 0)) {
            const dic: { [id: string]: string } = {};
            this.currentTab.tabData.forEach(element => {
              dic[element.name] = element.componentRef.instance.getValue();
            });
            com.evaluateValue(dic);
          }
        } else {
          this.utils.CopyAttributeValue(con.data.attribute, result.attribute);
          com.data = result;
          com.initComponent();
        }
      }
    });
  }

  onEditorDelete(config) {
    const index = this.currentTab.tabData.findIndex(a => a.name === config.name);
    this.currentTab.tabData.splice(index, 1);
  }
}
