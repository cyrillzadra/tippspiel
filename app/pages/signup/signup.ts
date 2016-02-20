import {Page} from 'ionic-framework/ionic';

import {fbName} from "../fbConfig";
import {ControlGroup, Control, Validators} from "angular2/common";
var Firebase = require('firebase');

@Page({
    templateUrl: 'build/pages/signup/signup.html'
})
export class SignupPage {
    form:ControlGroup;

    constructor() {
        this.form = new ControlGroup({
            email: new Control("", Validators.required),
            password: new Control("", Validators.required)
        });
    }

    signup(event):void {
        var ref = new Firebase(fbName);
        ref.createUser({
            email: this.form.value.email,
            password: this.form.value.password
        }, function (error, userData) {
            if (error) {
                console.log("Error creating user:", error);
            } else {
                console.log("Successfully created user account with uid:", userData.uid);
                //TODO create User
            }
        });

    }
}
