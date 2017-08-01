import { InjectionToken, RendererFactory2 } from '@angular/core';
import { PlatformState } from '@angular/platform-server';
import { StateTransferService } from './state-transfer.service';
export declare const STATE_ID: InjectionToken<string>;
export declare const DEFAULT_STATE_ID = "STATE";
export declare class ServerStateTransferService extends StateTransferService {
    private readonly stateId;
    private readonly platformState;
    private readonly rendererFactory;
    constructor(stateId: string, platformState: PlatformState, rendererFactory: RendererFactory2);
    inject(): void;
}
