import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { ResourceService } from '../../services/resource.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @ViewChild('resourceList') resourceList;

  resourceData: Array<{ displayName: string; objectType: string; objectId: string }> = [];

  selectedObject: any;

  constructor(private resource: ResourceService, private router: Router) {}

  ngOnInit() {}

  handleSearchFilter(value) {
    if (value.length >= 3) {
      this.resourceList.loading = true;
      this.resource
        .getResourceByQuery(`/Person[starts-with(DisplayName,'${value}')]`, ['DisplayName'])
        .subscribe(result => {
          this.resourceList.loading = false;
          this.resourceData = result.Resources.map(r => {
            return { displayName: r.DisplayName, objectType: r.ObjectType, objectId: r.ObjectID };
          });
        });
    } else {
      this.resourceList.toggle(false);
    }
  }

  searchValueChange(value) {
    this.router.navigate([`/app/user/${value.objectId}`]);
  }
}
