import { ActivatedRoute, Router } from '@angular/router';

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
export function reloadPage(router: Router, activatedRoute: ActivatedRoute): void {
  // const reuseStrategy = router.routeReuseStrategy.shouldReuseRoute;
  // router.routeReuseStrategy.shouldReuseRoute = () => false;
  // router.onSameUrlNavigation = 'reload';
  router.navigated = false;
  void router.navigate(['./'], { relativeTo: activatedRoute, queryParamsHandling: 'preserve' });
  // router.routeReuseStrategy.shouldReuseRoute = reuseStrategy;
}
