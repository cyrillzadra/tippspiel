/**
 * Created by tiezad on 06.02.2016.
 */
export class AppModel {

    language:string;

    deviceReady:boolean = false;

    globalization:any;

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

    setGlobalization(globalization:any):void {
        this.globalization = globalization;
    }

    getGlobalization():any {
        return this.globalization;
    }

}

export var appModel = new AppModel()

