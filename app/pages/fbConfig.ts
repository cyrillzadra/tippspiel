import {User} from "../models/User";
import {Group} from "../models/Group";
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

    createUser(authData:any):void {
        var login = this;
        var ref = new Firebase(fbName);
        ref.onAuth(function (authData) {
            if (authData) {
                console.log(authData.provider);
                var user:User = new User(login.getName(authData), login.getEmail(authData), "", authData.provider);
                ref.child("users").child(authData.uid).set(user);
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
            case 'google':
                return authData.google.displayName;
            case 'facebook':
                return authData.facebook.displayName;
            case 'github':
                return (authData.github.displayName != null) ? authData.github.displayName : "";
        }
    }

    private getEmail(authData):string {
        switch (authData.provider) {
            case 'password':
                return authData.password.email;
            case 'twitter':
                return authData.twitter.email;
            case 'google':
                return authData.google.email;
            case 'facebook':
                return authData.facebook.email;
            case 'github':
                return (authData.github.email != null) ? authData.github.email : "";
        }
    }

    getMyGroups(authData:any):Array<{groupKey: boolean}> {
        console.log('getMyGroups: ', authData);
        var ref = new Firebase(FB_USERS);
        var myGroups: Array<{groupKey: boolean}>;

        ref.onAuth(function (authData) {
            var myMyGroups = myGroups;
            if (authData) {
                ref.child(authData.uid).child('mygroups').once('value',function(data) {
                    // do some stuff once
                    console.log('data ', data);
                    myMyGroups = data.val();
                });
            }
        });
        console.log('mygroups:' , myGroups);
        return myGroups;
    }

    getGroups(authData:any, groups:Array<Group>) : void {
        console.log('getMyGroups: ', authData);
        var ref = new Firebase(FB_GROUPS);
        var myGroups: Array<Group> = groups;

        ref.onAuth(function (authData) {
            var myMyGroups = myGroups;
            if (authData) {
                ref.on('value', function(list) {
                    // do some stuff once
                    console.log('list ', list.val());
                    list.forEach( function(group) {
                        myMyGroups.push(group.val());
                    });
                }, function(error) {
                    console.log("read failed", error);
                });
            }
        });
    }

    createGroup(group: Group, authData:any):void {
        var ref = new Firebase(FB_GROUPS);
        ref.onAuth(function (authData) {
            if (authData) {
                var newGroupRef = ref.push();
                console.log(newGroupRef)
                newGroupRef.set(group);
            }
        });
    }

    addMember(group: Group, authData:any):void {
        var ref = new Firebase(FB_GROUPS);
        ref.onAuth(function (authData) {
            if (authData) {
                var newGroupRef = ref.push();
                console.log(newGroupRef)
                newGroupRef.set(group);
            }
        });
    }

    removeMember(group: Group, authData:any):void {
        var ref = new Firebase(FB_GROUPS);
        ref.onAuth(function (authData) {
            if (authData) {
                var newGroupRef = ref.push();
                console.log(newGroupRef)
                newGroupRef.set(group);
            }
        });
    }


}






