import {User} from "./User";
/**
 * Created by tiezad on 06.02.2016.
 */
export class AppModel {

    language:string;

    deviceReady:boolean = false;

    globalization:any;

    authenticated:boolean = false;

    authData:any;

    platformReady:boolean = false;

    user:User;

    getDeviceReady():boolean {
        return this.deviceReady
    }

    setPlatformReady(platformReady:boolean):void {
        this.platformReady = platformReady
    }

    getPlatformReady():boolean {
        return this.platformReady
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


    setUser(user:User):void {
        this.user = user;
    }

    getUser():User {
        return this.user;
    }

}

export var appModel = new AppModel()

