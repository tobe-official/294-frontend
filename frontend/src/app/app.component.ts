import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  public title = 'cheatsheetDB';
  constructor(private translateService: TranslateService) {}

  public ngOnInit() {
    this.translateService.addLangs(environment.languages);
    this.setLanguage('en');
  }

  private setLanguage(lang: string) {
    this.translateService.use(lang);
  }
}
