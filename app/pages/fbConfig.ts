import {User} from "../models/User";
import {Group} from "../models/Group";
import {appModel} from "../models/appModel";
/**
 * Created by tiezad on 30.01.2016.
 */
export const fbName = 'https://resplendent-torch-9631.firebaseio.com/';
export const FB_USERS = fbName + 'users/';
export const FB_SCHEDULES = fbName + 'schedules/';
export const FB_GROUPS = fbName + 'groups/';
export const FB_TIPS = fbName + 'tips/';

var Firebase = require('firebase');

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCoUwSmTf4YNfgEK6cDp70VeoJCxE8ksZU",
    authDomain: "resplendent-torch-9631.firebaseapp.com",
    databaseURL: "https://resplendent-torch-9631.firebaseio.com",
    storageBucket: "resplendent-torch-9631.appspot.com",
};
firebase.initializeApp(config);

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
                usersRef.child(authData.uid).update(user);
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

    getMyGroups(authData:any, groups:Array<Group>) : void {
        console.log('getMyGroups: ', authData);
        var ref = new Firebase(FB_USERS);
        var myGroups: Array<Group> = groups;

        ref.onAuth(function (authData) {
            var myMyGroups = myGroups;
            if (authData) {
                ref.child(authData.uid).child('mygroups').once('value', function(list) {
                    console.log('list ', list.val());
                    list.forEach( function(groupData) {
                        var g : Group = new Group(groupData.val().name, groupData.val().description,
                            groupData.val().shared, groupData.val().password, groupData.val().wordlRanking, groupData.val().admin);
                        g.id = groupData.key();
                        myMyGroups.push(g);
                    });
                }, function(error) {
                    console.log("read failed", error);
                });
            }
        });
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

    searchGroup(authData:any, searchTerm:string, groups:Array<Group>) : void {
        console.log('searchGroup: ', authData);
        console.log('searchTerm', searchTerm);
        var ref = new Firebase(FB_GROUPS);
        var myGroups: Array<Group> = groups;
        var searchT : string = searchTerm;
        //asdf

        ref.onAuth(function (authData) {
            var myMyGroups = myGroups;
            var searchT2 : string = searchT;
            if (authData) {
                ref.orderByChild("name").startAt(searchT2).limitToFirst(50).once('value', function(list) {
                    console.log('list ', list.val());
                    list.forEach( function(groupData) {
                        var g : Group = new Group(groupData.val().name, groupData.val().description,
                            groupData.val().shared, groupData.val().password, groupData.val().worldRanking, groupData.val().admin);
                        g.id = groupData.key();
                        myMyGroups.push(g);
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
                newGroupRef.child('members').child(authData.uid).set(appModel.getUser());
                var groupId = newGroupRef.key();
                console.log('groupId ', groupId);

                var userRef = new Firebase(FB_USERS);
                userRef.onAuth(function (authData) {
                    if(authData) {
                        userRef.child(authData.uid).child('mygroups').child(groupId).set(group);
                    }
                });
            }
        });
    }

    joinGroup(authData:any, group: Group):void {
        var groupBaseRef = new Firebase(FB_GROUPS);
        groupBaseRef.onAuth(function (authData) {
            if (authData) {
                var groupRef = groupBaseRef.child(group.id)
                groupRef.child('members').child(authData.uid).set( appModel.getUser() );
            }
        });

        var userBaseRef = new Firebase(FB_USERS);
        userBaseRef.onAuth(function (authData) {
            if (authData) {
                var userRef = userBaseRef.child(authData.uid);
                    userRef.child('mygroups').child(group.id).set(group);
            }
        });
    }

    leaveGroup(group: Group, authData:any):void {
        var ref = new Firebase(FB_GROUPS);
        ref.onAuth(function (authData) {
            if (authData) {
                var newGroupRef = ref.push();
                console.log(newGroupRef)
                newGroupRef.set(group);
            }
        });
    }

    getMembersOfGroup(authData:any, members:Array<User>, group:Group) : void {
        console.log('getMembersOfGroup: ', authData);
        var ref = new Firebase(FB_GROUPS);
        var membersOfGroup: Array<User> = members;

        ref.onAuth(function (authData) {
            var myMembersOfGroup : Array<User> = membersOfGroup;
            if (authData) {
                ref.child(group.id).child('members').once('value', function(list) {
                    console.log('list ', list.val());
                    list.forEach( function(user) {
                        myMembersOfGroup.push(user.val());
                    });
                }, function(error) {
                    console.log("read failed", error);
                });
            }
        });
    }


}






