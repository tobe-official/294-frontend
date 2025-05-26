import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { provideTranslateMock } from '../../utils/translate-tests.function.spec';
import { AuthService } from '../../services/auth/auth.service';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: SpyObj<AuthService>;

  beforeEach(waitForAsync(() => {
    mockAuthService = createSpyObj<AuthService>('AuthService', ['login'], {});
  }));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideTranslateMock()],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call login when form is invalid', () => {
    component.form.setValue({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

    component.submit();

    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('should change modes', () => {
    component.dialogMode = 'login';
    expect(component.submitTranslation()).toEqual('login.form.submitLogin');
    expect(component.createAccountTranslation()).toEqual(
      'login.form.noAccount',
    );
    component.toggleMode();

    expect(component.dialogMode).toEqual('register');
    expect(component.submitTranslation()).toEqual('login.form.submitRegister');
    expect(component.createAccountTranslation()).toEqual('login.form.back');
  });

  it('should submit correctly', () => {
    spyOn(component, 'login');
    spyOn(component, 'register');
    component.submit();

    expect(component.touched()).toEqual(true);
    expect(component.dialogMode).toEqual('login');
    expect(component.login).toHaveBeenCalled();

    component.toggleMode();
    expect(component.dialogMode).toEqual('register');
    component.submit();
    expect(component.login).toHaveBeenCalled();
  });
});
