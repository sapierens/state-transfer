// angular
import { Injectable } from '@angular/core';
import { Http, Request, RequestOptionsArgs, Response } from '@angular/http';

// libs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

// module
import { StateTransferService } from './state-transfer.service';

@Injectable()
export class HttpTransferService {
  constructor(private readonly http: Http,
              protected readonly stateTransfer: StateTransferService) {
  }

  request(uri: string | Request, options?: RequestOptionsArgs): Observable<any> {
    return this.getData(uri, options, (urlRes: string, optionsRes: RequestOptionsArgs) => {
      return this.http.request(urlRes, optionsRes);
    });
  }

  get(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.getData(url, options, (urlRes: string, optionsRes: RequestOptionsArgs) => {
      return this.http.get(urlRes, optionsRes);
    });
  }

  post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    return this.getPostData(url, body, options, (urlRes: string) => {
      return this.http.post(urlRes, body, options);
    });
  }

  put(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    return this.getData(url, options, (urlRes: string, optionsRes: RequestOptionsArgs) => {
      return this.http.put(urlRes, optionsRes);
    });
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.getData(url, options, (urlRes: string, optionsRes: RequestOptionsArgs) => {
      return this.http.delete(urlRes, optionsRes);
    });
  }

  patch(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    return this.getPostData(url, body, options, (urlRes: string) => {
      return this.http.patch(urlRes, body, options);
    });
  }

  head(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.getData(url, options, (urlRes: string, optionsRes: RequestOptionsArgs) => {
      return this.http.head(urlRes, optionsRes);
    });
  }

  options(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.getData(url, options, (urlRes: string, optionsRes: RequestOptionsArgs) => {
      return this.http.options(urlRes, optionsRes);
    });
  }

  private getData(uri: string | Request, options: RequestOptionsArgs,
                  callback: (uri: string | Request, options?: RequestOptionsArgs) => Observable<Response>): any {

    let url = uri;

    if (typeof uri !== 'string')
      url = uri.url;

    const key = url + JSON.stringify(options);

    try {
      return this.resolveData(key);

    } catch (e) {
      return callback(uri, options)
        .map(res => res.json())
        .do(data => {
          this.setCache(key, data);
        });
    }
  }

  private getPostData(uri: string | Request, body: any, options: RequestOptionsArgs,
                      callback: (uri: string | Request, body: any, options?: RequestOptionsArgs) => Observable<Response>): any {

    let url = uri;

    if (typeof uri !== 'string')
      url = uri.url;

    const key = url + JSON.stringify(body) + JSON.stringify(options);

    try {
      return this.resolveData(key);
    } catch (e) {
      return callback(uri, body, options)
        .map(res => res.json())
        .do(data => {
          this.setCache(key, data);
        });
    }
  }

  private resolveData(key: string): any {
    const data = this.getFromCache(key);

    if (!data)
      throw new Error();

    return Observable.fromPromise(Promise.resolve(data));
  }

  private setCache(key: string, data: any): any {
    return this.stateTransfer.set(key, data);
  }

  private getFromCache(key: string): any {
    return this.stateTransfer.get(key);
  }
}
