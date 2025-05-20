import { TranslateService } from '@ngx-translate/core';
import { EMPTY, of } from 'rxjs';
import { Provider } from '@angular/core';

export class TranslateMockService {
  public get = () => of('');

  public addLangs = () => {};

  public setDefaultLang = () => {};

  public use = () => '';

  public instant = () => '';

  public onLangChange = EMPTY;

  public onTranslationChange = EMPTY;

  public onDefaultLangChange = EMPTY;
}

/**
 * returns provider for translate service faking during tests
 */
export function provideTranslateMock(): Provider {
  return { provide: TranslateService, useClass: TranslateMockService };
}
