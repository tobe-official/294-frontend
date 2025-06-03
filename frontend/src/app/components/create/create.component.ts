import { Component, Signal, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';

import { redirectTo } from '../../utils/router-functions';
import { AuthService } from '../../services/auth/auth.service';
import { CheatsheetService } from '../../services/cheatsheet/cheatsheet.service';
import { HeaderComponent } from '../header/header.component';
import { CheatsheetCreatePayload } from '../../models/CheatsheetCreatePayload';


@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    MatButton,
    HeaderComponent,
  ],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
  /** Mark the form as “touched” after the first submit attempt */
  public touched: Signal<boolean> = signal(false);

  /**
   * Our reactive form now has:
   *  - title (string)
   *  - description (string)
   *  - pdf (File | null)
   *  - thumbnail (File | null)
   */
  public readonly form = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>('', [Validators.required]),

    // These two controls will hold the actual File objects
    pdf: new FormControl<File | null>(null, [Validators.required]),
    thumbnail: new FormControl<File | null>(null, [Validators.required]),
  });

  constructor(
    private cheatsheetService: CheatsheetService,
    private authService: AuthService,
    private router: Router
  ) {}

  /** Utility to redirect back to “home” if needed */
  public redirect(location: 'home') {
    redirectTo(location, this.router);
  }

  /**
   * When the user picks a file from <input type="file">, we store it into the form control.
   *
   * In the template, you would do something like:
   *   <input type="file" accept="application/pdf"
   *          (change)="onFileChange($event, 'pdf')" />
   *   <input type="file" accept="image/*"
   *          (change)="onFileChange($event, 'thumbnail')" />
   */
  public onFileChange(
    event: Event,
    controlName: 'pdf' | 'thumbnail'
  ): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file: File = input.files[0];
      this.form.get(controlName)?.setValue(file);
    } else {
      this.form.get(controlName)?.setValue(null);
    }
  }

  /**
   * Called when the user clicks “Submit.” We check validity,
   * pull out the two File objects + text fields, then call
   * cheatsheetService.create(...) with a CheatsheetCreatePayload.
   */
  public submit(): void {
    // Mark the form as “touched” so that any validators start showing errors
    this.touched = signal(true);

    if (!this.form.valid) {
      return;
    }

    const title = this.form.controls.title.value as string;
    const description = this.form.controls.description.value as string;

    // These will be non-null, because we marked them Validators.required
    const pdfFile = this.form.controls.pdf.value as File;
    const thumbnailFile = this.form.controls.thumbnail.value as File;

    const currentUser = this.authService.getLoggedInUser();
    if (!currentUser) {
      console.error('User is not logged in – cannot upload.');
      return;
    }

    // Build our “create” payload
    const payload: CheatsheetCreatePayload = {
      title,
      description,
      uploader: currentUser.id,
      stars: 0,
      pdf: pdfFile,
      thumbnail: thumbnailFile,
    };

    // This returns a RecordModel if successful, or throws otherwise
    this.cheatsheetService
      .create(payload)
      .then((record) => {
        if (record) {
          // On success, redirect back to home
          redirectTo('home', this.router);
        } else {
          console.error('Cheatsheet creation returned null');
        }
      })
      .catch((err) => {
        console.error('Error while creating cheatsheet:', err);
      });
  }
}
