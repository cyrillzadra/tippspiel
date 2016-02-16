import {Page, NavController, NavParams, TranslatePipe} from "ionic-framework/ionic";
import {Validators, ControlGroup, Control} from "angular2/common";
import {User} from "../../models/User";
import {appModel} from "../../models/appModel";
import {FireBaseService} from "../fbConfig";

var Firebase = require('firebase');

@Page({
    templateUrl: 'build/pages/settings/settings.html',
    pipes: [TranslatePipe]
})
export class SettingsPage {

    form:ControlGroup;

    user:User = appModel.getUser();

    constructor(private nav:NavController, navParams:NavParams) {
        this.form = new ControlGroup({
            ame: new Control("", Validators.required),
            email: new Control("", Validators.required),
            country: new Control("", Validators.required)
        });
    }

    save(event):void {
        console.log('save');
        new FireBaseService().updateUser(this.user);
    }
}