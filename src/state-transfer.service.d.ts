export declare class StateTransferService {
    private readonly state;
    constructor();
    initialize(state: Map<string, any>): void;
    get(key: string): any;
    set(key: string, value: any): Map<string, any>;
    inject(): void;
    protected toJson(): any;
}
