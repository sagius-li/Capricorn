import { Component, OnInit, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-editbar',
  templateUrl: './editbar.component.html',
  styleUrls: ['./editbar.component.css'],
  animations: [
    trigger('editMode', [
      state(
        'inactive',
        style({
          opacity: 0,
          transform: '{{inactiveTrans}}'
        }),
        { params: { inactiveTrans: 'translateX(150%)' } }
      ),
      state(
        'active',
        style({
          opacity: 1,
          transform: '{{activeTrans}}'
        }),
        { params: { activeTrans: 'translateX(0)' } }
      ),
      transition('inactive => active', animate(300)),
      transition('active => inactive', animate(300))
    ])
  ]
})
export class EditbarComponent implements OnInit {
  @Input()
  direction = 'row';
  @Input()
  color = 'rgba(128, 128, 128, 0.8)';
  @Input()
  size = '30px';

  editMode = 'inactive';
  mainIcon = 'edit';
  transInactive = 'translateX(150%)';
  transActive = 'translateX(0)';

  constructor() {}

  ngOnInit() {
    this.transInactive =
      this.direction === 'row' ? 'translateX(150%)' : 'translateY(-150%)';
    this.transActive =
      this.direction === 'row' ? 'translateX(0)' : 'translateY(0)';
  }

  toggleEditMode() {
    this.editMode = this.editMode === 'inactive' ? 'active' : 'inactive';
    this.mainIcon = this.editMode === 'inactive' ? 'edit' : 'cancel';
  }
}
