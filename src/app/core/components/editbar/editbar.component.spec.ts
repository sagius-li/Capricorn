import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditbarComponent } from './editbar.component';

import { LocalizationModule } from '../../modules/localization.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTooltipModule, MatIconModule } from '@angular/material';

describe('EditbarComponent', () => {
  let component: EditbarComponent;
  let fixture: ComponentFixture<EditbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditbarComponent],
      imports: [
        BrowserAnimationsModule,
        FlexLayoutModule,
        LocalizationModule,
        MatTooltipModule,
        MatIconModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
