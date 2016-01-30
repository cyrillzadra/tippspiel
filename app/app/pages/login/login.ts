import {Page} from 'ionic-framework/ionic';

import {fbName} from "../fbConfig";

var Firebase = require('firebase');

@Page({
    templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {

    constructor() {

    }

    authenticate()  {
        var fbRef = new Firebase(fbName);

        fbRef.authWithOAuthPopup("github", function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
            }
        });
    }
}
