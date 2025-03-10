import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparePlanComponent } from './compare-plan.component';

describe('ComparePlanComponent', () => {
  let component: ComparePlanComponent;
  let fixture: ComponentFixture<ComparePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparePlanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
