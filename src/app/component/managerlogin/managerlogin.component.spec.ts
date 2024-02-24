import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerloginComponent } from './managerlogin.component';

describe('ManagerloginComponent', () => {
  let component: ManagerloginComponent;
  let fixture: ComponentFixture<ManagerloginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerloginComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManagerloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
