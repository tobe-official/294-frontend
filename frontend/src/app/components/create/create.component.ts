import { Component, Signal, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { redirectTo } from '../../utils/router-functions';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { AuthService } from '../../services/auth/auth.service';
import { CheatsheetService } from '../../services/cheatsheet/cheatsheet.service';
import { HeaderComponent } from '../header/header.component';
import { Cheatsheet } from '../../models/cheatsheet';

@Component({
  selector: 'app-create',
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    TranslatePipe,
    ReactiveFormsModule,
    MatButton,
    MatError,
    HeaderComponent,
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
  standalone: true,
})
export class CreateComponent {
  public touched: Signal<boolean> = signal(false);
  public readonly form = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>('', [Validators.required]),
    pdfUrl: new FormControl<string>('', [Validators.required]),
    thumbnailUrl: new FormControl<string>('', []),
  });

  constructor(
    private cheatsheetService: CheatsheetService,
    private authService: AuthService,
    private router: Router,
  ) {}
  public redirect(location: 'home') {
    redirectTo(location, this.router);
  }

  public submit() {
    this.touched = signal(true);
    const rawValue = this.form.getRawValue();
    const cheatSheet: Cheatsheet = {
      title: rawValue.title || '',
      description: rawValue.description || '',
      pdfUrl: rawValue.pdfUrl || '',
      thumbnailUrl: rawValue.thumbnailUrl || '',
      uploader: this.authService.getLoggedInUser()?.id,
    };
    this.cheatsheetService.create(cheatSheet);
    redirectTo('home', this.router);
  }
}
