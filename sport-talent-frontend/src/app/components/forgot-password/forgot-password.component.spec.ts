import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { By } from '@angular/platform-browser';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordComponent],
      imports: [FormsModule, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
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

  it('should display a success message for existent email', () => {
    const emailInput = fixture.debugElement.query(By.css('input[type="email"]'));
    const sendButton = fixture.debugElement.query(By.css('button[type="submit"]'));

    // Simulate valid email input
    emailInput.nativeElement.value = 'user@example.com';
    emailInput.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Simulate form submission
    sendButton.nativeElement.click();

    const req = httpMock.expectOne(`${component.apiUrl}/auth/forgot-password`);
    req.flush({ message: 'Reset link sent to your email' }); // Mock successful response

    fixture.detectChanges();

    const successMessage = fixture.debugElement.query(By.css('.success-message'));
    expect(successMessage).toBeTruthy(); // Ensure the success message exists
    expect(successMessage.nativeElement.textContent).toContain('Reset link sent to your email');
  });

  it('should disable the "Send Reset Link" button until a valid email is entered', () => {
    const emailInput = fixture.debugElement.query(By.css('input[type="email"]'));
    const sendButton = fixture.debugElement.query(By.css('button[type="submit"]'));
  
    // Initially, the button should be disabled (email is empty)
    expect(sendButton.nativeElement.disabled).toBeTrue();
  
    // Simulate invalid email input
    emailInput.nativeElement.value = 'invalid-email';
    emailInput.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  
    // Button should still be disabled (email is invalid)
    expect(sendButton.nativeElement.disabled).toBeTrue();
  
    // Simulate valid email input
    emailInput.nativeElement.value = 'valid@example.com';
    emailInput.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  
    // After valid input, the button should be enabled
    expect(sendButton.nativeElement.disabled).toBeFalse();
  });
});