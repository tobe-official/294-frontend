import { Component, Signal, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
  MatHint,
} from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { redirectTo } from '../../utils/router-functions';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CheatsheetService } from '../../services/cheatsheet/cheatsheet.service';
import { HeaderComponent } from '../header/header.component';
import { Cheatsheet } from '../../models/cheatsheet';
import { RecordModel } from 'pocketbase';

@Component({
  selector: 'app-create',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatHint,
    MatError,
    TranslatePipe,
    HeaderComponent,
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
  standalone: true,
})
export class CreateComponent {
  public touched: Signal<boolean> = signal(false);

  public readonly form = new FormGroup({
    title: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(75),
      this.noSpecialCharsValidator,
    ]),
    description: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(300),
    ]),
    pdfUrl: new FormControl<string>('', [
      Validators.required,
      this.urlValidator,
      this.pdfUrlValidator,
    ]),
    thumbnailUrl: new FormControl<string>('', [
      Validators.required,
      this.urlValidator,
    ]),
  });

  private readonly loggedInUser: RecordModel | null;

  constructor(
    private readonly cheatsheetService: CheatsheetService,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.loggedInUser = this.authService.getLoggedInUser();
  }

  private noSpecialCharsValidator(
    control: AbstractControl,
  ): ValidationErrors | null {
    return /[<>{}[\]\\\/]/.test(control.value)
      ? { hasSpecialChars: true }
      : null;
  }

  private urlValidator(control: AbstractControl): ValidationErrors | null {
    const pattern = /^https:\/\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+$/;
    return pattern.test(control.value) ? null : { invalidUrl: true };
  }

  private pdfUrlValidator(control: AbstractControl): ValidationErrors | null {
    return /\.pdf$/i.test(control.value) ? null : { notPdfUrl: true };
  }

  public getFieldError(fieldName: keyof CreateFormFields): string | null {
    const control = this.form.get(fieldName);
    if (!control || !control.errors || (!control.touched && !this.touched()))
      return null;

    const errorPriority = [
      'required',
      'minlength',
      'maxlength',
      'invalidUrl',
      'notPdfUrl',
      'notImageUrl',
      'hasSpecialChars',
    ];

    for (const key of errorPriority) {
      if (control.hasError(key)) return key;
    }

    return null;
  }

  public getFieldErrorMessage(fieldName: keyof CreateFormFields): string {
    const errorType = this.getFieldError(fieldName);
    if (!errorType) return '';

    switch (errorType) {
      case 'required':
      case 'minlength':
      case 'maxlength':
        return `create.form.${fieldName}${capitalize(errorType)}`;
      case 'invalidUrl':
      case 'notPdfUrl':
      case 'notImageUrl':
      case 'hasSpecialChars':
        return `create.form.${errorType}`;
      default:
        return `create.form.${fieldName}Invalid`;
    }
  }

  public redirect(location: 'home'): void {
    redirectTo(location, this.router);
  }

  public submit(): void {
    Object.values(this.form.controls).forEach((control) =>
      control.markAsTouched(),
    );
    this.touched = signal(true);

    if (!this.form.valid || !this.loggedInUser) return;

    const { title, description, pdfUrl, thumbnailUrl } =
      this.form.getRawValue();

    const cheatSheet: Cheatsheet = {
      title: title?.trim() ?? '',
      description: description?.trim() ?? '',
      pdfUrl: pdfUrl?.trim() ?? '',
      thumbnailUrl: thumbnailUrl?.trim() ?? '',
      uploader: this.loggedInUser.id,
      stars: 1,
    };

    this.cheatsheetService.create(cheatSheet).then((record) => {
      if (record) {
        this.redirect('home');
      } else {
        console.error('Creation failed');
      }
    });
  }
}

type CreateFormFields = {
  title: FormControl<string>;
  description: FormControl<string>;
  pdfUrl: FormControl<string>;
  thumbnailUrl: FormControl<string>;
};

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
