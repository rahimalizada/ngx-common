import { ActivatedRoute, Router } from '@angular/router';

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
export function reloadPage(router: Router, activatedRoute: ActivatedRoute): void {
  router.navigated = false;
  void router.navigate(['./'], { relativeTo: activatedRoute, queryParamsHandling: 'preserve' });
}
