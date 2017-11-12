import { Inject, Injectable, InjectionToken, NgModule, Optional, RendererFactory2, SkipSelf, ViewEncapsulation } from '@angular/core';
import { __extends } from 'tslib';
import * as tslib_1 from 'tslib';
import { PlatformState } from '@angular/platform-server';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

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
        { type: Injectable },
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
var jsonStringUnescapeMap = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&#39;': '\''
};
function jsonStringEscape(str) {
    return str.replace(/[&\<\>\\']/g, function (e) { return jsonStringEscapeMap[e]; });
}
function jsonStringUnescape(str) {
    return str.replace(/(&amp;)|(&lt;)|(&gt;)|(&#39;)/g, function (e) { return jsonStringUnescapeMap[e]; });
}

var STATE_ID = new InjectionToken('STATE_ID');
var DEFAULT_STATE_ID = 'STATE';
var ServerStateTransferService = (function (_super) {
    __extends(ServerStateTransferService, _super);
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
                encapsulation: ViewEncapsulation.None,
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
        { type: Injectable },
    ];
    ServerStateTransferService.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [STATE_ID,] },] },
        { type: PlatformState, },
        { type: RendererFactory2, },
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
        return Observable.fromPromise(Promise.resolve(data));
    };
    HttpTransferService.prototype.setCache = function (key, data) {
        return this.stateTransfer.set(key, data);
    };
    HttpTransferService.prototype.getFromCache = function (key) {
        return this.stateTransfer.get(key);
    };
    HttpTransferService.decorators = [
        { type: Injectable },
    ];
    HttpTransferService.ctorParameters = function () { return [
        { type: Http, },
        { type: StateTransferService, },
    ]; };
    return HttpTransferService;
}());

function stateTransferFactory(stateId) {
    var stateTransfer = new StateTransferService();
    var escapedState = window[stateId] || '';
    var state = JSON.parse(jsonStringUnescape(escapedState));
    stateTransfer.initialize(state);
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
        { type: NgModule, args: [{
                    providers: [
                        HttpTransferService
                    ]
                },] },
    ];
    HttpTransferModule.ctorParameters = function () { return [
        { type: HttpTransferModule, decorators: [{ type: Optional }, { type: SkipSelf },] },
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
        { type: NgModule },
    ];
    BrowserStateTransferModule.ctorParameters = function () { return [
        { type: BrowserStateTransferModule, decorators: [{ type: Optional }, { type: SkipSelf },] },
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
    return ServerStateTransferModule;
}());

export { stateTransferFactory, HttpTransferModule, BrowserStateTransferModule, ServerStateTransferModule, STATE_ID, DEFAULT_STATE_ID, ServerStateTransferService, StateTransferService, HttpTransferService };
//# sourceMappingURL=state-transfer.es5.js.map
