import {Page, TranslatePipe, NavController} from 'ionic-angular';

import {fbName, FireBaseService} from "../fbConfig";
import {ControlGroup, Control, Validators} from '@angular/common';
import {MainPage} from "../main/main";

var Firebase = require('firebase');

@Page({
    templateUrl: 'build/pages/signup/signup.html',
    pipes: [TranslatePipe]
})
export class SignupPage {
    form:ControlGroup;

    errorMsg:string;

    constructor(private nav:NavController) {
        this.form = new ControlGroup({
            email: new Control("", Validators.required),
            password: new Control("", Validators.required)
        });
    }

    signup(event):void {
        var signup = this;
        var ref = new Firebase(fbName);
        ref.createUser({
            email: this.form.value.email,
            password: this.form.value.password
        }, function (error, authData) {
            console.log('provider : ' + authData.provider);
            if (error) {
                console.log("Error creating user:", error);
            } else {
                console.log("Successfully created user account with uid:", authData);
                console.log("Successfully created user account with uid:", authData.uid);

                ref.authWithPassword({
                    email: signup.form.value.email,
                    password: signup.form.value.password
                }, function (error, authData) {
                    if (error) {
                        console.log("Invalid user or password:", error);
                        signup.errorMsg = "Invalid user or password";
                    } else {
                        console.log("create user");

                        new FireBaseService().createUser(authData);
                        signup.nav.setRoot(MainPage);
                    }
                });
            }
        });

    }
}
