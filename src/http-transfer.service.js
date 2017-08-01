import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { StateTransferService } from './state-transfer.service';
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
            return _this.http.post(urlRes, body.options);
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
            return _this.http.patch(urlRes, body.options);
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
    return HttpTransferService;
}());
export { HttpTransferService };
HttpTransferService.decorators = [
    { type: Injectable },
];
HttpTransferService.ctorParameters = function () { return [
    { type: Http, },
    { type: StateTransferService, },
]; };
