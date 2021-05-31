import { MatSnackBar } from '@angular/material/snack-bar';
import { PopupService } from './popup.service';

describe('PopupService', () => {
  let service: PopupService;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  beforeEach(() => {
    service = new PopupService(snackBar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
