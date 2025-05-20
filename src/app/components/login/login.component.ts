import { Component, computed, Signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { User } from '../../models/User';

@Component({
  selector: 'app-login',
  imports: [TranslatePipe, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public dialogMode: 'login' | 'register' = 'login';
  public submitTranslation: Signal<string> = computed(
    () => 'login.form.submitLogin',
  );
  public createAccountTranslation: Signal<string> = computed(
    () => 'login.form.noAccount',
  );
  public readonly form = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    email: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', [Validators.required]),
    confirmPassword: new FormControl<string>('', [Validators.required]),
  });

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  private async redirect() {
    await this.router.navigate(['/home']);
  }
  public async login() {
    if (this.form.controls.email.valid && this.form.controls.password.valid) {
      const user: User = {
        name: '',
        email: this.form.value.email || '',
        password: this.form.value.password || '',
        passwordConfirm: '',
        emailVisibility: false,
      };
      if (await this.authService.login(user)) {
        await this.redirect();
      }
    }
  }
  public async register() {
    if (this.form.valid) {
      const user: User = {
        name: this.form.value.name || '',
        email: this.form.value.email || '',
        password: this.form.value.password || '',
        passwordConfirm: this.form.value.confirmPassword || '',
        emailVisibility: false,
      };
      await this.authService.register(user);
      if (await this.authService.login(user)) {
        await this.redirect();
      }
    }
  }

  public toggleMode() {
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
    if (this.dialogMode === 'login') {
      this.login();
    } else {
      this.register();
    }
  }
}
