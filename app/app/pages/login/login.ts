import {Page, NavController,IONIC_DIRECTIVES} from 'ionic-framework/ionic';

import {fbName} from "../fbConfig";
import {SignupPage} from "../signup/signup";
import {ControlGroup, Validators, Control} from "angular2/common";

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

    constructor(private nav: NavController) {
        this.form = new ControlGroup({
            email: new Control("",Validators.required),
            password: new Control("",Validators.required)
        });
    }

    authGithub()  {
        var fbRef = new Firebase(fbName);

        fbRef.authWithOAuthPopup("github", function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
            }
        });
    }

    signup() : void {
        this.nav.push(SignupPage)
    }

    signin(event) : void {
        var ref = new Firebase(fbName);
        ref.createUser({
            email: this.email,
            password: this.password
        }, function (error, userData) {
            if (error) {
                console.log("Error creating user:", error);
            } else {
                console.log("Successfully created user account with uid:", userData.uid);
            }
        });
    }
}
