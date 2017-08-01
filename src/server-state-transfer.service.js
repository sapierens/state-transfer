import * as tslib_1 from "tslib";
import { Inject, Injectable, InjectionToken, RendererFactory2, ViewEncapsulation } from '@angular/core';
import { PlatformState } from '@angular/platform-server';
import { StateTransferService } from './state-transfer.service';
export var STATE_ID = new InjectionToken('STATE_ID');
export var DEFAULT_STATE_ID = 'STATE';
var ServerStateTransferService = (function (_super) {
    tslib_1.__extends(ServerStateTransferService, _super);
    function ServerStateTransferService(stateId, platformState, rendererFactory) {
        var _this = _super.call(this) || this;
        _this.stateId = stateId;
        _this.platformState = platformState;
        _this.rendererFactory = rendererFactory;
        return _this;
    }
    ServerStateTransferService.prototype.inject = function () {
        try {
            var document_1 = this.platformState.getDocument();
            var state = JSON.stringify(this.toJson());
            var renderer = this.rendererFactory.createRenderer(document_1, {
                id: '-1',
                encapsulation: ViewEncapsulation.None,
                styles: [],
                data: {}
            });
            var body = document_1.body;
            if (!body)
                throw new Error('<body> not found in the document');
            var script = renderer.createElement('script');
            renderer.setValue(script, "window['" + this.stateId + "'] = " + state);
            renderer.appendChild(body, script);
        }
        catch (e) {
            console.error(e);
        }
    };
    return ServerStateTransferService;
}(StateTransferService));
export { ServerStateTransferService };
ServerStateTransferService.decorators = [
    { type: Injectable },
];
ServerStateTransferService.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Inject, args: [STATE_ID,] },] },
    { type: PlatformState, },
    { type: RendererFactory2, },
]; };
