/**
 * Created by tiezad on 06.02.2016.
 */
export class AppModel {

    language : string;

    getLanguage() : string { return this.language }

    setLanguage(language : string) : void { this.language = language }

}

export var appModel = new AppModel()