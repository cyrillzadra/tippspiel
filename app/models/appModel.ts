/**
 * Created by tiezad on 06.02.2016.
 */
export class AppModel {

    language:string;

    deviceReady:boolean = false;

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

}

export var appModel = new AppModel()