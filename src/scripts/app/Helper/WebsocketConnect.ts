import { EntryPoint } from "app/EntryPoint";

export const protocol = 'ws';
export const host = '127.0.0.1';
export const port = '8090'
export class WebsocketConnect extends PIXI.utils.EventEmitter {
    private _wSocket: WebSocket;
    private _session: string;
    private _action: string;
    private _game: EntryPoint;
    constructor() {
        super();
        this._game = EntryPoint.instance;
    }

    public connectWebSocket(): void { 
        this.websocketConnect(protocol + "://" + host + ":" + port + "/");
    }

    public websocketConnect(websocketUrl: string): void {
        this._wSocket = new WebSocket(websocketUrl);
        this._wSocket.onopen = this.websocketOpen.bind(this);
        this._wSocket.onclose = this.websocketError.bind(this);
        this._wSocket.onerror = this.websocketError.bind(this);
        this._wSocket.onmessage = this.websocketResponse.bind(this);
    }

    private websocketOpen(event: any): void { 
        this.emit("status", "true");
    }

    private websocketError(): void {
        this.emit("status", "false");
    }

    private websocketResponse(data: any): void {
        let response: any = JSON.parse(data.data);
        switch (response) {
            case "init":
                this.emit("init", response);
                break;
            case "pong":
                //we dont need.
                break;
            default:
                this.emit("response", response);
                break;
        }
    }

    public websocketRequest(action: string, requestParameters: any): void {
        this._action = action;
        requestParameters.action = this._action;
        requestParameters.session = this._session;
        this._wSocket.send(JSON.stringify(requestParameters));
    }

    public sendPing(): void {
        setInterval(() => {
            this._wSocket.send(JSON.stringify({ action: "ping", session: this._session }));
        }, 5000);
    }
}  