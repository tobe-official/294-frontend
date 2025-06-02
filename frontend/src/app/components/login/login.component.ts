import {Component, computed, signal, Signal} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {AuthService} from '../../services/auth/auth.service';
import {TranslatePipe} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {AppValues} from '../../appvalues';
import {LoginUser} from '../../models/login-user';
import {User} from '../../models/user';
import {redirectTo} from '../../utils/router-functions';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
})
export class LoginComponent {
  public dialogMode: 'login' | 'register' = 'login';
  public touched: Signal<boolean> = signal(false);
  public isLoading: Signal<boolean> = signal(false);
  public errorMessage: Signal<string> = signal('');
  public submitTranslation: Signal<string> = computed(
    () => this.dialogMode === 'login' ? 'login.form.submitLogin' : 'login.form.submitRegister'
  );
  public createAccountTranslation: Signal<string> = computed(
    () => this.dialogMode === 'login' ? 'login.form.noAccount' : 'login.form.back'
  );

  public form = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    email: new FormControl<string>('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    confirmPassword: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
  }

  private async redirect() {
    redirectTo('home', this.router);
  }

  public async login() {
    this.errorMessage = signal('');
    this.isLoading = signal(true);

    if (this.form.controls.email.valid && this.form.controls.password.valid) {
      const rawValue = this.form.getRawValue();
      const user: LoginUser = {
        email: rawValue.email || '',
        password: rawValue.password || '',
      };

      try {
        const success = await this.authService.login(user);
        if (success) {
          await this.redirect();
        } else {
          this.errorMessage = signal('login.errors.invalidCredentials');
        }
      } catch (error) {
        this.errorMessage = signal('login.errors.networkError');
      }
    } else {
      this.errorMessage = signal('login.errors.validationFailed');
    }

    this.isLoading = signal(false);
  }

  public async register() {
    this.errorMessage = signal('');
    this.isLoading = signal(true);

    if (this.form.valid) {
      const rawValue = this.form.getRawValue();

      // Check if passwords match
      if (rawValue.password !== rawValue.confirmPassword) {
        this.errorMessage = signal('login.errors.passwordsDoNotMatch');
        this.isLoading = signal(false);
        return;
      }

      const user: User = {
        name: rawValue.name || '',
        email: rawValue.email || '',
        password: rawValue.password || '',
        passwordConfirm: rawValue.confirmPassword || '',
        emailVisibility: false,
        credits: AppValues.INITIAL_CREDITS,
      };

      try {
        await this.authService.register(user);
        const loginSuccess = await this.authService.login(user);
        if (loginSuccess) {
          await this.redirect();
        } else {
          this.errorMessage = signal('login.errors.registrationFailed');
        }
      } catch (error) {
        this.errorMessage = signal('login.errors.emailAlreadyExists');
      }
    } else {
      this.errorMessage = signal('login.errors.validationFailed');
    }

    this.isLoading = signal(false);
  }

  public toggleMode() {
    this.touched = signal(false);
    this.errorMessage = signal('');
    this.form.reset();
    this.dialogMode = this.dialogMode === 'login' ? 'register' : 'login';
  }

  public submit() {
    this.touched = signal(true);
    if (this.dialogMode === 'login') {
      this.login().then((r) => r);
    } else {
      this.register().then((r) => r);
    }
  }

  public getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field || !field.errors || !this.touched()) return '';

    if (field.errors['required']) {
      return `login.form.${fieldName}Required`;
    }
    if (field.errors['email']) {
      return 'login.form.emailInvalid';
    }
    if (field.errors['minlength']) {
      return 'login.form.passwordTooShort';
    }
    return '';
  }

  public hasFieldError(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.errors && this.touched());
  }
}
