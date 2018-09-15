import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

/**
 * Component provides other components built in it drag & drop capability
 */
@Component({
  selector: 'app-drag',
  templateUrl: './drag.component.html',
  styleUrls: ['./drag.component.css']
})
export class DragComponent implements OnInit {
  /** Any data used for drag data */
  @Input()
  dragItem: any;
  /** Switch between edit and read mode */
  @Input()
  editMode = false;

  /** Event emitter for window resized */
  @Output()
  resiz = new EventEmitter<number[]>();
  /** Event emitter for configure */
  @Output()
  configure = new EventEmitter();
  /** Event emitter for content deleted */
  @Output()
  delete = new EventEmitter();

  /** @ignore */
  constructor() {}

  /** @ignore */
  ngOnInit() {}

  /**
   * Emit the resized event with the new size
   * @param size Size[colSpan, rowSpan]
   */
  onResize(size: number[]) {
    this.resiz.emit(size);
  }

  /**
   * Emit the configure event
   */
  onConfigure() {
    this.configure.emit();
  }

  /**
   * Emit the deleted event
   */
  onDelete() {
    this.delete.emit();
  }
}
