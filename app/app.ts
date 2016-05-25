import {App, IonicApp, Platform, Translate, TranslatePipe} from 'ionic-angular';

import {SchedulesPage} from './pages/schedules/schedules';
import {SettingsPage} from './pages/settings/settings';
import {MainPage} from './pages/main/main';
import {LoginPage} from './pages/login/login';
import {AboutPage} from './pages/about/about';
import {RulesPage} from './pages/rules/rules';

// https://angular.io/docs/ts/latest/api/core/Type-interface.html
import {Type} from '@angular/core';

import {team_de} from "./locales/teams/de";
import {team_en} from "./locales/teams/en";

import {appModel} from "./models/appModel"

@App({
    templateUrl: 'build/app.html',
    config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
    pipes: [TranslatePipe]
})
export class MyApp {
    // make HelloIonicPage the root (or first) page
    rootPage:Type = LoginPage;
    pages:Array<{title: string, component: Type}>;

    constructor(private app:IonicApp, private platform:Platform, private trans:Translate) {

        document.addEventListener("deviceready", function () {
            appModel.setDeviceReady(true)
            appModel.setGlobalization(navigator.globalization)
        }, false);

        this.initializeApp(trans);

        // set our app's pages
        this.pages = [
            {title: 'menu.start', component: MainPage},
            {title: 'menu.rules', component: RulesPage},
            {title: 'menu.schedules', component: SchedulesPage},
            {title: 'menu.settings', component: SettingsPage},
            {title: 'menu.about', component: AboutPage},
    ];
    }

    initializeApp(trans:Translate) {
        this.platform.ready().then(() => {
            this.I18n(trans);
            appModel.setPlatformReady(true)
            appModel.setGlobalization(navigator.globalization)
        });
    }

    private I18n(trans:Translate) {
        if (typeof navigator.globalization !== "undefined") {
            navigator.globalization.getPreferredLanguage(
                function (language) {
                    var lang : string = "";
                    if(device.platform == "Android") {
                        lang =  language.value;
                        lang = lang.substring(0,2);
                    } else {
                        lang =  language.value;
                    }
                    console.log('language: ' + lang + '\n');
                    appModel.setLanguage(lang)
                },
                function () {
                    appModel.setLanguage("en");
                    console.log('Error getting language\n');
                }
            );
        } else {
            appModel.setLanguage("de")
        }

        //load locale
        trans.setLanguage(appModel.getLanguage());
        trans.translations('de', team_de);
        trans.translations('en', team_en);
    };

    openPage(page) {
        // close the menu when clicking a link from the menu
        this.app.getComponent('leftMenu').close();
        // navigate to the new page if it is not the current page
        let nav = this.app.getComponent('nav');
        nav.setRoot(page.component);
    }
}