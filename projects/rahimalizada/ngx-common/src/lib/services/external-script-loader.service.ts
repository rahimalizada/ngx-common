import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExternalScriptLoaderService {
  private scripts: ScriptModel[] = [];

  public load(script: ScriptModel): Observable<ScriptModel> {
    return new Observable<ScriptModel>((observer: Observer<ScriptModel>) => {
      const existingScript = this.scripts.find((s) => s.name === script.name);

      // Complete if already loaded
      if (existingScript && existingScript.loaded) {
        observer.next(existingScript);
        observer.complete();
      } else {
        // Add the script
        this.scripts = [...this.scripts, script];

        // Load the script
        const scriptElement = document.createElement('script');
        scriptElement.id = `ext-${script.name}`;
        scriptElement.type = 'text/javascript';
        scriptElement.async = script.async ?? true;
        scriptElement.src = script.src;

        scriptElement.onload = () => {
          script.loaded = true;
          observer.next(script);
          observer.complete();
        };

        scriptElement.onerror = (error: any) => {
          observer.error('Could not load script ' + script.src);
        };

        const parent = script.parent ?? 'body';
        document.getElementsByTagName(parent)[0].appendChild(scriptElement);
      }
    });
  }
}

export interface ScriptModel {
  name: string;
  src: string;
  async?: boolean;
  parent?: 'head' | 'body';
  loaded?: boolean;
}
