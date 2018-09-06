import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes
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
  @Input()
  buttons = ['refresh', 'add', 'save'];
  @Input()
  saveAndReturn = true;

  @Output()
  add = new EventEmitter();
  @Output()
  cancel = new EventEmitter();
  @Output()
  edit = new EventEmitter();
  @Output()
  refresh = new EventEmitter();
  @Output()
  save = new EventEmitter();

  editMode = 'inactive';
  mainIcon = 'edit';
  mainIconText = 'key_edit';
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
    this.mainIconText =
      this.editMode === 'inactive' ? 'key_edit' : 'key_cancel';
  }

  onAdd() {
    this.add.emit();
  }

  onMainAction() {
    this.editMode === 'inactive' ? this.edit.emit() : this.cancel.emit();
  }

  onRefresh() {
    this.refresh.emit();
  }

  onSave() {
    if (this.saveAndReturn) {
      this.toggleEditMode();
    }
    this.save.emit();
  }
}
