import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ResetPasswordComponent } from './reset-password.component';
import { ActivatedRoute, Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResetPasswordComponent],
      imports: [FormsModule, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: () => 'valid-token',
              },
            },
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: () => {},
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding HTTP requests
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display success message on valid token', () => {
    component.token = 'valid-token';
    component.newPassword = 'NewPassword123!';
    component.onSubmit();

    const req = httpMock.expectOne(`${component.apiUrl}/auth/reset-password`);
    req.flush({ message: 'Password reset successfully' }); // Mock successful response

    fixture.detectChanges();

    const successMessage = fixture.debugElement.query(By.css('.success-message'));
    expect(successMessage).toBeTruthy(); // Ensure the success message exists
    expect(successMessage.nativeElement.textContent).toContain('Password reset successfully');
  });

  it('should display error message on invalid token', () => {
    component.token = 'invalid-token';
    component.newPassword = 'NewPassword123!';
    component.onSubmit();

    const req = httpMock.expectOne(`${component.apiUrl}/auth/reset-password`);
    req.flush({ message: 'Invalid or expired token' }, { status: 400, statusText: 'Bad Request' }); // Mock error response

    fixture.detectChanges();

    const errorMessage = fixture.debugElement.query(By.css('.error-message'));
    expect(errorMessage).toBeTruthy(); // Ensure the error message exists
    expect(errorMessage.nativeElement.textContent).toContain('Invalid or expired token');
  });
});