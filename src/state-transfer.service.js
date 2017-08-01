import { Injectable } from '@angular/core';
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
    return StateTransferService;
}());
export { StateTransferService };
StateTransferService.decorators = [
    { type: Injectable },
];
StateTransferService.ctorParameters = function () { return []; };
