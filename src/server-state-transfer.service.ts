// angular
import { Inject, Injectable, InjectionToken, RendererFactory2, ViewEncapsulation } from '@angular/core';
import { PlatformState } from '@angular/platform-server';

// module
import { StateTransferService } from './state-transfer.service';

// utils
import { jsonStringEscape } from './utils/json-string-tools';

export const STATE_ID = new InjectionToken<string>('STATE_ID');
export const DEFAULT_STATE_ID = 'STATE';

@Injectable()
export class ServerStateTransferService extends StateTransferService {
  constructor(@Inject(STATE_ID) private readonly stateId: string,
              private readonly platformState: PlatformState,
              private readonly rendererFactory: RendererFactory2) {
    super();
  }

  inject(): void {
    try {
      const document: any = this.platformState.getDocument();
      const state = JSON.stringify(this.toJson());
      const escapedState = jsonStringEscape(state);
      const renderer = this.rendererFactory.createRenderer(document, {
        id: '-1',
        encapsulation: ViewEncapsulation.None,
        styles: [],
        data: {}
      });

      const body = document.body;

      if (!body)
        throw new Error('<body> not found in the document');

      const script = renderer.createElement('script');
      renderer.setValue(script, `window['${this.stateId}'] = '${escapedState}'`);
      renderer.appendChild(body, script);
    } catch (e) {
      console.error(e);
    }
  }
}
