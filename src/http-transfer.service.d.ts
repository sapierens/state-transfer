import { Http, Request, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { StateTransferService } from './state-transfer.service';
export declare class HttpTransferService {
    private readonly http;
    protected readonly stateTransfer: StateTransferService;
    constructor(http: Http, stateTransfer: StateTransferService);
    request(uri: string | Request, options?: RequestOptionsArgs): Observable<any>;
    get(url: string, options?: RequestOptionsArgs): Observable<any>;
    post(url: string, body: any, options?: RequestOptionsArgs): Observable<any>;
    put(url: string, body: any, options?: RequestOptionsArgs): Observable<any>;
    delete(url: string, options?: RequestOptionsArgs): Observable<any>;
    patch(url: string, body: any, options?: RequestOptionsArgs): Observable<any>;
    head(url: string, options?: RequestOptionsArgs): Observable<any>;
    options(url: string, options?: RequestOptionsArgs): Observable<any>;
    private getData(uri, options, callback);
    private getPostData(uri, body, options, callback);
    private resolveData(key);
    private setCache(key, data);
    private getFromCache(key);
}
