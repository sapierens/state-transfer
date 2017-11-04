(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('tslib'), require('@angular/platform-server'), require('@angular/http'), require('rxjs/Observable'), require('rxjs/add/observable/fromPromise'), require('rxjs/add/operator/do'), require('rxjs/add/operator/map')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'tslib', '@angular/platform-server', '@angular/http', 'rxjs/Observable', 'rxjs/add/observable/fromPromise', 'rxjs/add/operator/do', 'rxjs/add/operator/map'], factory) :
	(factory((global.ngxUniversal = global.ngxUniversal || {}, global.ngxUniversal.stateTransfer = global.ngxUniversal.stateTransfer || {}),global.ng.core,global.tslib,global.ng.platformServer,global.ng.http,global.Rx.Observable));
}(this, (function (exports,_angular_core,tslib_1,_angular_platformServer,_angular_http,rxjs_Observable) { 'use strict';

var StateTransferService = (function () {
    function StateTransferService() {
        this.state = new Map();
    }
    StateTransferService.prototype.initialize = function (state) {
        var _this = this;
        Object.keys(state)
            .forEach(function (key) {
            _this.set(key, state[key]);
        });
    };
    StateTransferService.prototype.get = function (key) {
        return this.state.get(key);
    };
    StateTransferService.prototype.set = function (key, value) {
        return this.state.set(key, value);
    };
    StateTransferService.prototype.inject = function () {
    };
    StateTransferService.prototype.toJson = function () {
        var _this = this;
        var obj = {};
        Array.from(this.state.keys())
            .forEach(function (key) {
            obj[key] = _this.get(key);
        });
        return obj;
    };
    StateTransferService.decorators = [
        { type: _angular_core.Injectable },
    ];
    StateTransferService.ctorParameters = function () { return []; };
    return StateTransferService;
}());

var jsonStringEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '\\': '\\\\',
    '\'': '&#39;'
};
function jsonStringEscape(str) {
    return str.replace(/[&\<\>\\']/g, function (e) { return jsonStringEscapeMap[e]; });
}

var STATE_ID = new _angular_core.InjectionToken('STATE_ID');
var DEFAULT_STATE_ID = 'STATE';
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
            var escapedState = jsonStringEscape(state);
            var renderer = this.rendererFactory.createRenderer(document_1, {
                id: '-1',
                encapsulation: _angular_core.ViewEncapsulation.None,
                styles: [],
                data: {}
            });
            var body = document_1.body;
            if (!body)
                throw new Error('<body> not found in the document');
            var script = renderer.createElement('script');
            renderer.setValue(script, "window['" + this.stateId + "'] = '" + escapedState + "'");
            renderer.appendChild(body, script);
        }
        catch (e) {
            console.error(e);
        }
    };
    ServerStateTransferService.decorators = [
        { type: _angular_core.Injectable },
    ];
    ServerStateTransferService.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: _angular_core.Inject, args: [STATE_ID,] },] },
        { type: _angular_platformServer.PlatformState, },
        { type: _angular_core.RendererFactory2, },
    ]; };
    return ServerStateTransferService;
}(StateTransferService));

var HttpTransferService = (function () {
    function HttpTransferService(http, stateTransfer) {
        this.http = http;
        this.stateTransfer = stateTransfer;
    }
    HttpTransferService.prototype.request = function (uri, options) {
        var _this = this;
        return this.getData(uri, options, function (urlRes, optionsRes) {
            return _this.http.request(urlRes, optionsRes);
        });
    };
    HttpTransferService.prototype.get = function (url, options) {
        var _this = this;
        return this.getData(url, options, function (urlRes, optionsRes) {
            return _this.http.get(urlRes, optionsRes);
        });
    };
    HttpTransferService.prototype.post = function (url, body, options) {
        var _this = this;
        return this.getPostData(url, body, options, function (urlRes) {
            return _this.http.post(urlRes, body, options);
        });
    };
    HttpTransferService.prototype.put = function (url, body, options) {
        var _this = this;
        return this.getData(url, options, function (urlRes, optionsRes) {
            return _this.http.put(urlRes, optionsRes);
        });
    };
    HttpTransferService.prototype.delete = function (url, options) {
        var _this = this;
        return this.getData(url, options, function (urlRes, optionsRes) {
            return _this.http.delete(urlRes, optionsRes);
        });
    };
    HttpTransferService.prototype.patch = function (url, body, options) {
        var _this = this;
        return this.getPostData(url, body, options, function (urlRes) {
            return _this.http.patch(urlRes, body, options);
        });
    };
    HttpTransferService.prototype.head = function (url, options) {
        var _this = this;
        return this.getData(url, options, function (urlRes, optionsRes) {
            return _this.http.head(urlRes, optionsRes);
        });
    };
    HttpTransferService.prototype.options = function (url, options) {
        var _this = this;
        return this.getData(url, options, function (urlRes, optionsRes) {
            return _this.http.options(urlRes, optionsRes);
        });
    };
    HttpTransferService.prototype.getData = function (uri, options, callback) {
        var _this = this;
        var url = uri;
        if (typeof uri !== 'string')
            url = uri.url;
        var key = url + JSON.stringify(options);
        try {
            return this.resolveData(key);
        }
        catch (e) {
            return callback(uri, options)
                .map(function (res) { return res.json(); })
                .do(function (data) {
                _this.setCache(key, data);
            });
        }
    };
    HttpTransferService.prototype.getPostData = function (uri, body, options, callback) {
        var _this = this;
        var url = uri;
        if (typeof uri !== 'string')
            url = uri.url;
        var key = url + JSON.stringify(body) + JSON.stringify(options);
        try {
            return this.resolveData(key);
        }
        catch (e) {
            return callback(uri, body, options)
                .map(function (res) { return res.json(); })
                .do(function (data) {
                _this.setCache(key, data);
            });
        }
    };
    HttpTransferService.prototype.resolveData = function (key) {
        var data = this.getFromCache(key);
        if (!data)
            throw new Error();
        return rxjs_Observable.Observable.fromPromise(Promise.resolve(data));
    };
    HttpTransferService.prototype.setCache = function (key, data) {
        return this.stateTransfer.set(key, data);
    };
    HttpTransferService.prototype.getFromCache = function (key) {
        return this.stateTransfer.get(key);
    };
    HttpTransferService.decorators = [
        { type: _angular_core.Injectable },
    ];
    HttpTransferService.ctorParameters = function () { return [
        { type: _angular_http.Http, },
        { type: StateTransferService, },
    ]; };
    return HttpTransferService;
}());

function stateTransferFactory(stateId) {
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
    HttpTransferModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    providers: [
                        HttpTransferService
                    ]
                },] },
    ];
    HttpTransferModule.ctorParameters = function () { return [
        { type: HttpTransferModule, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.SkipSelf },] },
    ]; };
    return HttpTransferModule;
}());
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
    BrowserStateTransferModule.decorators = [
        { type: _angular_core.NgModule },
    ];
    BrowserStateTransferModule.ctorParameters = function () { return [
        { type: BrowserStateTransferModule, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.SkipSelf },] },
    ]; };
    return BrowserStateTransferModule;
}());
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
    ServerStateTransferModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    providers: [
                        {
                            provide: StateTransferService,
                            useClass: ServerStateTransferService
                        }
                    ]
                },] },
    ];
    ServerStateTransferModule.ctorParameters = function () { return [
        { type: ServerStateTransferModule, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.SkipSelf },] },
    ]; };
    return ServerStateTransferModule;
}());

exports.stateTransferFactory = stateTransferFactory;
exports.HttpTransferModule = HttpTransferModule;
exports.BrowserStateTransferModule = BrowserStateTransferModule;
exports.ServerStateTransferModule = ServerStateTransferModule;
exports.STATE_ID = STATE_ID;
exports.DEFAULT_STATE_ID = DEFAULT_STATE_ID;
exports.ServerStateTransferService = ServerStateTransferService;
exports.StateTransferService = StateTransferService;
exports.HttpTransferService = HttpTransferService;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=state-transfer.umd.js.map
