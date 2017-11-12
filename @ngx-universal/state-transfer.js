import { Inject, Injectable, InjectionToken, NgModule, Optional, RendererFactory2, SkipSelf, ViewEncapsulation } from '@angular/core';
import { PlatformState } from '@angular/platform-server';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

class StateTransferService {
    constructor() {
        this.state = new Map();
    }
    initialize(state) {
        Object.keys(state)
            .forEach(key => {
            this.set(key, state[key]);
        });
    }
    get(key) {
        return this.state.get(key);
    }
    set(key, value) {
        return this.state.set(key, value);
    }
    inject() {
    }
    toJson() {
        const obj = {};
        Array.from(this.state.keys())
            .forEach((key) => {
            obj[key] = this.get(key);
        });
        return obj;
    }
}
StateTransferService.decorators = [
    { type: Injectable },
];
StateTransferService.ctorParameters = () => [];

const jsonStringEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '\\': '\\\\',
    '\'': '&#39;'
};
const jsonStringUnescapeMap = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&#39;': '\''
};
function jsonStringEscape(str) {
    return str.replace(/[&\<\>\\']/g, e => jsonStringEscapeMap[e]);
}
function jsonStringUnescape(str) {
    return str.replace(/(&amp;)|(&lt;)|(&gt;)|(&#39;)/g, e => jsonStringUnescapeMap[e]);
}

const STATE_ID = new InjectionToken('STATE_ID');
const DEFAULT_STATE_ID = 'STATE';
class ServerStateTransferService extends StateTransferService {
    constructor(stateId, platformState, rendererFactory) {
        super();
        this.stateId = stateId;
        this.platformState = platformState;
        this.rendererFactory = rendererFactory;
    }
    inject() {
        try {
            const document = this.platformState.getDocument();
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
        }
        catch (e) {
            console.error(e);
        }
    }
}
ServerStateTransferService.decorators = [
    { type: Injectable },
];
ServerStateTransferService.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [STATE_ID,] },] },
    { type: PlatformState, },
    { type: RendererFactory2, },
];

class HttpTransferService {
    constructor(http, stateTransfer) {
        this.http = http;
        this.stateTransfer = stateTransfer;
    }
    request(uri, options) {
        return this.getData(uri, options, (urlRes, optionsRes) => {
            return this.http.request(urlRes, optionsRes);
        });
    }
    get(url, options) {
        return this.getData(url, options, (urlRes, optionsRes) => {
            return this.http.get(urlRes, optionsRes);
        });
    }
    post(url, body, options) {
        return this.getPostData(url, body, options, (urlRes) => {
            return this.http.post(urlRes, body, options);
        });
    }
    put(url, body, options) {
        return this.getData(url, options, (urlRes, optionsRes) => {
            return this.http.put(urlRes, optionsRes);
        });
    }
    delete(url, options) {
        return this.getData(url, options, (urlRes, optionsRes) => {
            return this.http.delete(urlRes, optionsRes);
        });
    }
    patch(url, body, options) {
        return this.getPostData(url, body, options, (urlRes) => {
            return this.http.patch(urlRes, body, options);
        });
    }
    head(url, options) {
        return this.getData(url, options, (urlRes, optionsRes) => {
            return this.http.head(urlRes, optionsRes);
        });
    }
    options(url, options) {
        return this.getData(url, options, (urlRes, optionsRes) => {
            return this.http.options(urlRes, optionsRes);
        });
    }
    getData(uri, options, callback) {
        let url = uri;
        if (typeof uri !== 'string')
            url = uri.url;
        const key = url + JSON.stringify(options);
        try {
            return this.resolveData(key);
        }
        catch (e) {
            return callback(uri, options)
                .map(res => res.json())
                .do(data => {
                this.setCache(key, data);
            });
        }
    }
    getPostData(uri, body, options, callback) {
        let url = uri;
        if (typeof uri !== 'string')
            url = uri.url;
        const key = url + JSON.stringify(body) + JSON.stringify(options);
        try {
            return this.resolveData(key);
        }
        catch (e) {
            return callback(uri, body, options)
                .map(res => res.json())
                .do(data => {
                this.setCache(key, data);
            });
        }
    }
    resolveData(key) {
        const data = this.getFromCache(key);
        if (!data)
            throw new Error();
        return Observable.fromPromise(Promise.resolve(data));
    }
    setCache(key, data) {
        return this.stateTransfer.set(key, data);
    }
    getFromCache(key) {
        return this.stateTransfer.get(key);
    }
}
HttpTransferService.decorators = [
    { type: Injectable },
];
HttpTransferService.ctorParameters = () => [
    { type: Http, },
    { type: StateTransferService, },
];

function stateTransferFactory(stateId) {
    const stateTransfer = new StateTransferService();
    const escapedState = window[stateId] || '';
    const state = JSON.parse(jsonStringUnescape(escapedState));
    stateTransfer.initialize(state);
    return stateTransfer;
}
class HttpTransferModule {
    constructor(parentModule) {
        if (parentModule)
            throw new Error('HttpTransferModule already loaded; import in root module only.');
    }
    static forRoot() {
        return {
            ngModule: HttpTransferModule
        };
    }
}
HttpTransferModule.decorators = [
    { type: NgModule, args: [{
                providers: [
                    HttpTransferService
                ]
            },] },
];
HttpTransferModule.ctorParameters = () => [
    { type: HttpTransferModule, decorators: [{ type: Optional }, { type: SkipSelf },] },
];
class BrowserStateTransferModule {
    constructor(parentModule) {
        if (parentModule)
            throw new Error('BrowserStateTransferModule already loaded; import in BROWSER module only.');
    }
    static forRoot(stateId = DEFAULT_STATE_ID) {
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
    }
}
BrowserStateTransferModule.decorators = [
    { type: NgModule },
];
BrowserStateTransferModule.ctorParameters = () => [
    { type: BrowserStateTransferModule, decorators: [{ type: Optional }, { type: SkipSelf },] },
];
class ServerStateTransferModule {
    constructor(parentModule) {
        if (parentModule)
            throw new Error('ServerStateTransferModule already loaded; import in SERVER module only.');
    }
    static forRoot(stateId = DEFAULT_STATE_ID) {
        return {
            ngModule: ServerStateTransferModule,
            providers: [
                {
                    provide: STATE_ID,
                    useValue: stateId
                }
            ]
        };
    }
}
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
ServerStateTransferModule.ctorParameters = () => [
    { type: ServerStateTransferModule, decorators: [{ type: Optional }, { type: SkipSelf },] },
];

export { stateTransferFactory, HttpTransferModule, BrowserStateTransferModule, ServerStateTransferModule, STATE_ID, DEFAULT_STATE_ID, ServerStateTransferService, StateTransferService, HttpTransferService };
//# sourceMappingURL=state-transfer.js.map
