import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { PopupComponent, PopupType } from '../components/popup/popup.component';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  constructor(private dialog: MatDialog, private translate: TranslateService) {}

  public show(
    type: PopupType,
    title: string,
    content: string
  ): MatDialogRef<PopupComponent> {
    return this.dialog.open(PopupComponent, {
      minWidth: '250px',
      disableClose: true,
      data: {
        type: type,
        title: this.translate.instant(title),
        content: this.translate.instant(content)
      }
    });
  }
}
