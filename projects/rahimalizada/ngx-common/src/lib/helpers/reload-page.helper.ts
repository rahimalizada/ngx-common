import { ActivatedRoute, Router } from '@angular/router';

export const reloadPage = (router: Router, activatedRoute: ActivatedRoute): void => {
  router.navigated = false;
  void router.navigate(['./'], { relativeTo: activatedRoute, queryParamsHandling: 'preserve' });
};
