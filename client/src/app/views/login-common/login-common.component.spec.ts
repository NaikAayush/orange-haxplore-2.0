import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginCommonComponent } from './login-common.component';

describe('LoginCommonComponent', () => {
  let component: LoginCommonComponent;
  let fixture: ComponentFixture<LoginCommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginCommonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
