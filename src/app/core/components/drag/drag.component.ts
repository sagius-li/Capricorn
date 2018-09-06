import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-drag',
  templateUrl: './drag.component.html',
  styleUrls: ['./drag.component.css']
})
export class DragComponent implements OnInit {
  @Input()
  dragItem: any;
  @Input()
  editMode = false;

  @Output()
  resized = new EventEmitter<number[]>();
  @Output()
  deleted = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  resize(size: number[]) {
    this.resized.emit(size);
  }

  delete() {
    this.deleted.emit();
  }
}
