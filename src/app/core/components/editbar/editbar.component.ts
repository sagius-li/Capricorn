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
          transform: 'translateX(150%)'
        })
      ),
      state(
        'active',
        style({
          opacity: 1,
          transform: 'translateX(0)'
        })
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

  constructor() {}

  ngOnInit() {}

  toggleEditMode() {
    this.editMode = this.editMode === 'inactive' ? 'active' : 'inactive';
    this.mainIcon = this.editMode === 'inactive' ? 'edit' : 'cancel';
  }
}
