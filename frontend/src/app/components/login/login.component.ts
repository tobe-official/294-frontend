import { Component, computed, signal, Signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { AppValues } from '../../appvalues';
import { LoginUser } from '../../models/login-user';
import { User } from '../../models/user';
import { redirectTo } from '../../utils/router-functions';

@Component({
  selector: 'app-login',
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    MatError,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
})
export class LoginComponent {
  public dialogMode: 'login' | 'register' = 'login';
  public touched: Signal<boolean> = signal(false);
  public submitTranslation: Signal<string> = computed(
    () => 'login.form.submitLogin',
  );
  public createAccountTranslation: Signal<string> = computed(
    () => 'login.form.noAccount',
  );
  public form = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    email: new FormControl<string>('', [Validators.required]),
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
  ) {}

  private async redirect() {
    redirectTo('home', this.router);
  }
  public async login() {
    if (this.form.controls.email.valid && this.form.controls.password.valid) {
      const rawValue = this.form.getRawValue();
      const user: LoginUser = {
        email: rawValue.email || '',
        password: rawValue.password || '',
      };
      if (await this.authService.login(user)) {
        await this.redirect();
      }
    }
  }
  public async register() {
    if (this.form.valid) {
      const rawValue = this.form.getRawValue();
      const user: User = {
        name: rawValue.name || '',
        email: rawValue.email || '',
        password: rawValue.password || '',
        passwordConfirm: rawValue.confirmPassword || '',
        emailVisibility: false,
        credits: AppValues.INITIAL_CREDITS,
      };
      await this.authService.register(user);
      if (await this.authService.login(user)) {
        await this.redirect();
      }
    }
  }

  public toggleMode() {
    this.touched = signal(false);
    this.dialogMode = this.dialogMode === 'login' ? 'register' : 'login';
    this.submitTranslation = computed(() => {
      return this.dialogMode === 'login'
        ? 'login.form.submitLogin'
        : 'login.form.submitRegister';
    });
    this.createAccountTranslation = computed(() => {
      return this.dialogMode === 'login'
        ? 'login.form.noAccount'
        : 'login.form.back';
    });
  }

  public submit() {
    this.touched = signal(true);
    if (this.dialogMode === 'login') {
      this.login();
    } else {
      this.register();
    }
  }
}
