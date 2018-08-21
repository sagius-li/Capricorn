import { Component, OnInit, Input } from '@angular/core';

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

  isHovering = false;

  constructor() {}

  ngOnInit() {}

  onMouseEnter() {
    this.isHovering = true;
  }

  onMouseLeave() {
    this.isHovering = false;
  }
}
