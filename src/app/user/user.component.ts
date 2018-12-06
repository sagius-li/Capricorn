import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ResourceService } from '../core/services/resource.service';
import { InfoBrandConfig } from '../core/components/info-brand/info-brand.component';
import {
  InfoDetailConfig,
  InfoDetailComponent
} from '../core/components/info-detail/info-detail.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  @ViewChild(InfoDetailComponent)
  infoDetail: InfoDetailComponent;

  currentObjectId: string;
  loading = false;

  infoBrandData: InfoBrandConfig;
  infoDetailConfig: InfoDetailConfig;

  private getInitialName(data: InfoBrandConfig) {
    let initial: string;

    if (data.firstName) {
      if (data.lastName) {
        initial = data.firstName.substr(0, 1) + data.lastName.substr(0, 1);
      } else {
        initial = data.firstName.substr(0, 2);
      }
    } else {
      if (data.lastName) {
        initial = data.lastName.substr(0, 2);
      } else {
        if (data.displayName) {
          initial = data.displayName.substr(0, 2);
        }
      }
    }

    return initial;
  }

  constructor(private route: ActivatedRoute, private svcResource: ResourceService) {
    route.params.subscribe(val => {
      this.currentObjectId = this.route.snapshot.paramMap.get('id');

      this.loading = true;
      this.svcResource
        .getResourceByID(this.currentObjectId, [
          'DisplayName',
          'JobTitle',
          'FirstName',
          'LastName',
          'EmployeeType',
          'Photo',
          'Email',
          'OfficePhone',
          'Address'
        ])
        .subscribe(result => {
          if (result) {
            this.infoBrandData = {
              address: result.Attributes['Address'].Value,
              displayName: result.DisplayName,
              email: result.Attributes['Email'].Value,
              employeeType: result.Attributes['EmployeeType'].Value,
              firstName: result.Attributes['FirstName'].Value,
              lastName: result.Attributes['LastName'].Value,
              photo: result.Attributes['Photo'].Value,
              telephone: result.Attributes['OfficePhone'].Value,
              title: result.Attributes['JobTitle'].Value
            };
            this.infoBrandData.initial = this.getInitialName(this.infoBrandData);

            this.infoDetailConfig = {
              objectId: result.ObjectID
            };
            if (this.infoDetail) {
              this.infoDetail.updateDetail(this.currentObjectId);
            }

            this.loading = false;
          }
        });
    });
  }

  ngOnInit() {}
}
