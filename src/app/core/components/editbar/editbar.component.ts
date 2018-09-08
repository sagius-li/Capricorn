import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes
} from '@angular/animations';

/**
 * Edit bar component to show edit options
 */
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
  /** Editbar direction (row or column) */
  @Input()
  direction = 'row';
  /** Editbar icon color */
  @Input()
  color = 'rgba(128, 128, 128, 0.8)';
  /** Editbar icon size */
  @Input()
  size = '30px';
  /** Edit bar buttons */
  @Input()
  buttons = ['refresh', 'add', 'save'];
  /** Click save button can return to non-edit mode */
  @Input()
  saveAndReturn = true;

  /** Event emitter for action add */
  @Output()
  add = new EventEmitter();
  /** Event emitter for action cancel */
  @Output()
  cancel = new EventEmitter();
  /** Event emitter for action edit */
  @Output()
  edit = new EventEmitter();
  /** Event emitter for action refresh */
  @Output()
  refresh = new EventEmitter();
  /** Event emitter for action save */
  @Output()
  save = new EventEmitter();

  /** Edit mode (inactive, active) */
  editMode = 'inactive';
  /** Main icon (edit, cancel) */
  mainIcon = 'edit';
  /** Main icon tooltip (key_edit, key_cancel) */
  mainIconText = 'key_edit';
  /** Transition for inactive state (row: translateX(150%), column: translateY(-150%)) */
  transInactive = 'translateX(150%)';
  /** Transition for active state (row: translateX(0), column: translateY(0)) */
  transActive = 'translateX(0)';

  /** @ignore */
  constructor() {}

  /** Set initial state */
  ngOnInit() {
    this.transInactive =
      this.direction === 'row' ? 'translateX(150%)' : 'translateY(-150%)';
    this.transActive =
      this.direction === 'row' ? 'translateX(0)' : 'translateY(0)';
  }

  /** Toggle state change between inactive and active */
  toggleEditMode() {
    this.editMode = this.editMode === 'inactive' ? 'active' : 'inactive';
    this.mainIcon = this.editMode === 'inactive' ? 'edit' : 'cancel';
    this.mainIconText =
      this.editMode === 'inactive' ? 'key_edit' : 'key_cancel';
  }

  /** Emit add event */
  onAdd() {
    this.add.emit();
  }

  /** Emit main action (edit, cancel) */
  onMainAction() {
    this.editMode === 'inactive' ? this.edit.emit() : this.cancel.emit();
  }

  /** Emit refresh action */
  onRefresh() {
    this.refresh.emit();
  }

  /** Emit save action */
  onSave() {
    if (this.saveAndReturn) {
      this.toggleEditMode();
    }
    this.save.emit();
  }
}
