import {App, IonicApp, Platform, Translate} from 'ionic-framework/ionic';

import {HelloIonicPage} from './pages/hello-ionic/hello-ionic';
import {ListPage} from './pages/list/list';
import {LoginPage} from './pages/login/login';

// https://angular.io/docs/ts/latest/api/core/Type-interface.html
import {Type} from 'angular2/core';

import {team_de} from "./locales/teams/de";
import {team_en} from "./locales/teams/en";

import {appModel} from "./models/appModel"

@App({
    templateUrl: 'build/app.html',
    config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
class MyApp {
    // make HelloIonicPage the root (or first) page
    rootPage:Type = LoginPage;
    pages:Array<{title: string, component: Type}>;

    constructor(private app:IonicApp, private platform:Platform, private trans:Translate) {

        document.addEventListener("deviceready", function () {
            this.I18n(trans);
        }, false);

        this.initializeApp(trans);

        // set our app's pages
        this.pages = [
            {title: 'Hello Ionic', component: HelloIonicPage},
            {title: 'My First List', component: ListPage},
            {title: 'Login', component: LoginPage}
        ];
    }

    initializeApp() {
        this.platform.ready().then(() => {
            // The platform is now ready. Note: if this callback fails to fire, follow
            // the Troubleshooting guide for a number of possible solutions:
            //
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            //
            // First, let's hide the keyboard accessory bar (only works natively) since
            // that's a better default:
            //
            // Keyboard.setAccessoryBarVisible(false);
            //
            // For example, we might change the StatusBar color. This one below is
            // good for dark backgrounds and light text:
            //if (typeof StatusBar !== 'undefined') {
            //  StatusBar.styleDefault();
            //}
        });
    }

    private I18n(trans:Translate) {
        if (typeof navigator.globalization !== "undefined") {
            navigator.globalization.getPreferredLanguage(
                function (language) {
                    alert('language: ' + language.value + '\n');
                    appModel.setLanguage(language.value)
                },
                function () {
                    alert('Error getting language\n');
                }
            );
        } else {
            appModel.setLanguage("de")
        }

        //load locale
        trans.setLanguage(appModel.getLanguage);
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