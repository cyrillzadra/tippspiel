/**
 * Created by tiezad on 06.02.2016.
 */
export class AppModel {

    language:string;

    deviceReady:boolean = false;

    globalization:any;

    authenticated:boolean = false;

    authData:any;

    getDeviceReady():boolean {
        return this.deviceReady
    }

    setDeviceReady(deviceReady:boolean):void {
        this.deviceReady = deviceReady
    }

    getLanguage():string {
        return this.language
    }

    setLanguage(language:string):void {
        this.language = language
    }

    setGlobalization(globalization:string):void {
        this.globalization = globalization;
    }

    getGlobalization():string {
        return this.globalization;
    }

    setAuthenticated():void {
        this.authenticated = true;
    }

    isAuthenticated():boolean {
        return this.authenticated;
    }

    setAuthData(authData:any):void {
        this.authData = authData;
    }

    getAuthData():any {
        return this.authData;
    }

}

export var appModel = new AppModel()

