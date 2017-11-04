import { ModuleWithProviders } from '@angular/core';
import { StateTransferService } from './src/state-transfer.service';
export * from './src/server-state-transfer.service';
export * from './src/state-transfer.service';
export * from './src/http-transfer.service';
export declare function stateTransferFactory(stateId: string): StateTransferService;
export declare class HttpTransferModule {
    static forRoot(): ModuleWithProviders;
    constructor(parentModule: HttpTransferModule);
}
export declare class BrowserStateTransferModule {
    static forRoot(stateId?: string): ModuleWithProviders;
    constructor(parentModule: BrowserStateTransferModule);
}
export declare class ServerStateTransferModule {
    static forRoot(stateId?: string): ModuleWithProviders;
    constructor(parentModule: ServerStateTransferModule);
}
