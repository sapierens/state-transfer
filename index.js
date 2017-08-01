import { NgModule, Optional, SkipSelf } from '@angular/core';
import { DEFAULT_STATE_ID, ServerStateTransferService, STATE_ID } from './src/server-state-transfer.service';
import { HttpTransferService } from './src/http-transfer.service';
import { StateTransferService } from './src/state-transfer.service';
export * from './src/server-state-transfer.service';
export * from './src/state-transfer.service';
export * from './src/http-transfer.service';
export function stateTransferFactory(stateId) {
    var stateTransfer = new StateTransferService();
    stateTransfer.initialize(window[stateId] || {});
    return stateTransfer;
}
var HttpTransferModule = (function () {
    function HttpTransferModule(parentModule) {
        if (parentModule)
            throw new Error('HttpTransferModule already loaded; import in root module only.');
    }
    HttpTransferModule.forRoot = function () {
        return {
            ngModule: HttpTransferModule
        };
    };
    return HttpTransferModule;
}());
export { HttpTransferModule };
HttpTransferModule.decorators = [
    { type: NgModule, args: [{
                providers: [
                    HttpTransferService
                ]
            },] },
];
HttpTransferModule.ctorParameters = function () { return [
    { type: HttpTransferModule, decorators: [{ type: Optional }, { type: SkipSelf },] },
]; };
var BrowserStateTransferModule = (function () {
    function BrowserStateTransferModule(parentModule) {
        if (parentModule)
            throw new Error('BrowserStateTransferModule already loaded; import in BROWSER module only.');
    }
    BrowserStateTransferModule.forRoot = function (stateId) {
        if (stateId === void 0) { stateId = DEFAULT_STATE_ID; }
        return {
            ngModule: BrowserStateTransferModule,
            providers: [
                {
                    provide: StateTransferService,
                    useFactory: (stateTransferFactory),
                    deps: [STATE_ID]
                },
                {
                    provide: STATE_ID,
                    useValue: stateId
                }
            ]
        };
    };
    return BrowserStateTransferModule;
}());
export { BrowserStateTransferModule };
BrowserStateTransferModule.decorators = [
    { type: NgModule },
];
BrowserStateTransferModule.ctorParameters = function () { return [
    { type: BrowserStateTransferModule, decorators: [{ type: Optional }, { type: SkipSelf },] },
]; };
var ServerStateTransferModule = (function () {
    function ServerStateTransferModule(parentModule) {
        if (parentModule)
            throw new Error('ServerStateTransferModule already loaded; import in SERVER module only.');
    }
    ServerStateTransferModule.forRoot = function (stateId) {
        if (stateId === void 0) { stateId = DEFAULT_STATE_ID; }
        return {
            ngModule: ServerStateTransferModule,
            providers: [
                {
                    provide: STATE_ID,
                    useValue: stateId
                }
            ]
        };
    };
    return ServerStateTransferModule;
}());
export { ServerStateTransferModule };
ServerStateTransferModule.decorators = [
    { type: NgModule, args: [{
                providers: [
                    {
                        provide: StateTransferService,
                        useClass: ServerStateTransferService
                    }
                ]
            },] },
];
ServerStateTransferModule.ctorParameters = function () { return [
    { type: ServerStateTransferModule, decorators: [{ type: Optional }, { type: SkipSelf },] },
]; };
