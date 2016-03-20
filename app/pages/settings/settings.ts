import {Page, NavController, NavParams, TranslatePipe} from 'ionic-angular';
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

    countries:Array<string> = [
        'FRA', 'ROU', 'SUI', 'ALB', 'WAL', 'SVK',
        'RUS', 'ENG', 'POL', 'NIR', 'UKR', 'GER',
        'TUR', 'ESP', 'CZE', 'CRO', 'IRL', 'BEL',
        'SWE', 'ITA', 'AUT', 'HUN', 'ISL', 'POR'];


    constructor(private nav:NavController, navParams:NavParams) {
        this.form = new ControlGroup({
            name: new Control("", Validators.required),
            email: new Control("", Validators.required),
            country: new Control("", Validators.required)
        });
    }

    save(event):void {
        console.log('save');
        new FireBaseService().updateUser(this.user);
    }
}