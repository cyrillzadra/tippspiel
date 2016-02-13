import {Page, NavController,IONIC_DIRECTIVES} from 'ionic-framework/ionic';

import {fbName} from "../fbConfig";
import {SignupPage} from "../signup/signup";
import {ControlGroup, Validators, Control} from "angular2/common";
import {ListPage} from "../list/list";
import {appModel, AppModel} from "../../models/appModel"

var Firebase = require('firebase');

@Page({
    selector: 'login',
    templateUrl: 'build/pages/login/login.html',
    directives: [IONIC_DIRECTIVES]
})
export class LoginPage {
    form : ControlGroup;
    email : string;
    password : string;

    errorMsg : string = "";

    model : AppModel;

    constructor(private nav: NavController) {
        this.form = new ControlGroup({
            email: new Control("",Validators.required),
            password: new Control("",Validators.required)
        });
        this.model = appModel;
    }

    authGithub()  {
        var login = this;
        var fbRef = new Firebase(fbName);

        fbRef.authWithOAuthPopup("github", function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                login.nav.push(ListPage, { uid: authData.uid });
                console.log("Authenticated successfully with payload:", authData);
            }
        });
    }

    authTwitter()  {
        var login = this;
        var fbRef = new Firebase(fbName);

        fbRef.authWithOAuthPopup("twitter", function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                login.nav.push(ListPage, { uid: authData.uid });
                console.log("Authenticated successfully with payload:", authData);
            }
        });
    }

    signup() : void {
        this.nav.push(SignupPage)
    }

    signin(event) : void {
        var login = this;
        var ref = new Firebase(fbName);
        ref.authWithPassword({
            email: this.email,
            password: this.password
        }, function (error, userData) {
            if (error) {
                console.log("Invalid user or password:", error);
                login.errorMsg = "Invalid user or password";
            } else {
                console.log("Successfully created user account with uid:", userData.uid);
                login.nav.push(ListPage, { uid: userData.uid });
                //login.nav.setRoot(ListPage, { uid: userData.uid });
                //login.nav.loadPage(ListPage, { uid: userData.uid });
            }
        });
    }
}
