import {User} from "../models/User";
/**
 * Created by tiezad on 30.01.2016.
 */
export const fbName = 'https://resplendent-torch-9631.firebaseio.com/';
export const FB_USERS = fbName + 'users/';
export const FB_SCHEDULES = fbName + 'schedules/';
export const FB_GROUPS = fbName + 'groups/';
export const FB_TIPS = fbName + 'tips/';

var Firebase = require('firebase');

export class FireBaseService {

    getUser(userId:string):User {
        console.log('getUser ' + userId)
        var user:User = null;
        var usersRef = new Firebase(FB_USERS);
        usersRef.child(userId).once('value', function (snapshot) {
            var u = snapshot.val();

            var user = (u.name != undefined) ? u.name : "";
            var email = (u.email != undefined) ? u.email : "";
            var country = (u.country != undefined) ? u.country : "";
            var provider = (u.provider != undefined) ? u.provider : "";

            console.log('user exists = ' + user);

            this.user = new User(user, email, country, provider);
        });
        return user;
    }

    updateUser(user:User):void {
        var usersRef = new Firebase(FB_USERS);
        usersRef.onAuth(function (authData) {
            console.log(authData);
            console.log(user)
            if (authData) {
                usersRef.child(authData.uid).set(user);
            }
        });
    }

    createUser(uid:string, user:User):void {
        //implement
    }


}






