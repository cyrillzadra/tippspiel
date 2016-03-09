import {Page, NavController, IONIC_DIRECTIVES, TranslatePipe} from 'ionic-angular';

import {appModel, AppModel} from "../../models/appModel"
import {fbName} from "../fbConfig";
import {SignupPage} from "../signup/signup";
import {ControlGroup, Validators, Control} from "angular2/common";
import {MainPage} from "../main/main";
import {User} from "../../models/User";

var Firebase = require('firebase');

@Page({
    templateUrl: 'build/pages/login/login.html',
    directives: [IONIC_DIRECTIVES],
    pipes: [TranslatePipe]
})
export class LoginPage {
    form:ControlGroup;
    email:string;
    password:string;

    errorMsg:string = "";

    model:AppModel;

    constructor(private nav:NavController) {
        this.form = new ControlGroup({
            email: new Control("", Validators.required),
            password: new Control("", Validators.required)
        });
        this.model = appModel;
    }

    authGithub() {
        var login = this;
        var fbRef = new Firebase(fbName);

        fbRef.authWithOAuthPopup("github", function (error, authData) {
            if (error) {
                if (error.code === "TRANSPORT_UNAVAILABLE") {
                    fbRef.authWithOAuthRedirect("github", function(error) {
                        console.log("error auth", error);
                    });
                }
            } else if(authData) {
                appModel.setAuthData(authData);
                login.checkIfUserExists(authData);
                console.log("Authenticated successfully with payload:", authData);
            }
        });
    }

    authTwitter() {
        var login = this;
        var fbRef = new Firebase(fbName);
        fbRef.authWithOAuthRedirect("twitter", function (error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                appModel.setAuthData(authData);
                login.checkIfUserExists(authData);
                console.log("Authenticated successfully with payload:", authData);
            }
        });
    }

    signup():void {
        this.nav.push(SignupPage)
    }

    signin(event):void {
        var login = this;
        var ref = new Firebase(fbName);
        ref.authWithPassword({
            email: this.form.value.email,
            password: this.form.value.password
        }, function (error, authData) {
            if (error) {
                console.log("Invalid user or password:", error);
                login.errorMsg = "Invalid user or password";
            } else {
                appModel.setAuthData(authData);
                console.log("Successfully created user account with uid:", authData.uid);
                login.nav.setRoot(MainPage);
            }
        });
    }

    createUser(authData:any):void {
        var login = this;
        var ref = new Firebase(fbName);
        ref.onAuth(function (authData) {
            if (authData) {
                // save the user's profile into the database so we can list users,
                // use them in Security and Firebase Rules, and show profiles
                console.log(authData.provider);
                var user:User = new User(login.getName(authData), "", "", authData.provider);
                ref.child("users").child(authData.uid).set(user);
                appModel.setUser(user);
                login.nav.setRoot(MainPage);
            }
        });
    }

    // Tests to see if /users/<userId> has any data.
    checkIfUserExists(authData:any):void {
        var login = this;
        var userId:string = authData.uid;
        var usersRef = new Firebase(fbName + "/users/");
        var userExists:boolean = false;
        usersRef.child(userId).once('value', function (snapshot) {
            console.log('user exists (snapshot.val())= ' + snapshot.val());
            userExists = (snapshot.val() !== null);
            console.log('user exists = ' + userExists);
            if(!userExists) {
                this.createUser(authData);
            } else {
                appModel.setUser(snapshot.val());
                login.nav.setRoot(MainPage);
            }
        });
    }


    // find a suitable name based on the meta info given by each provider
    getName(authData):string {
        switch (authData.provider) {
            case 'password':
                return authData.password.email.replace(/@.*/, '');
            case 'twitter':
                return authData.twitter.displayName;
            case 'facebook':
                return authData.facebook.displayName;
            case 'github':
                return (authData.github.displayName != null) ? authData.github.displayName : "";
        }
    }
}
