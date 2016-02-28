import {Page, NavController, NavParams, TranslatePipe} from "ionic-framework/ionic";
import {ControlGroup, Validators, Control} from "angular2/common";
import {Group} from "../../models/Group";
import {FireBaseService} from "../fbConfig";
import {appModel} from "../../models/appModel";

@Page({
    templateUrl: 'build/pages/main/main.html',
    pipes: [TranslatePipe]
})

export class MainPage {

    tab1:ListGroupContentPage;
    tab2:AddGroupContentPage;

    constructor(private nav:NavController, navParams:NavParams) {
        this.tab1 = ListGroupContentPage;
        this.tab2 = AddGroupContentPage;
    }

}

@Page({
    templateUrl: 'build/pages/main/listgroup.html',
    pipes: [TranslatePipe]
})
class ListGroupContentPage {

    groups:Array<Group>;

    constructor(private nav:NavController) {
        //TODO assign result to items
        console.log('load groups');
        this.groups = new Array<Group>();
        new FireBaseService().getGroups(appModel.getAuthData(), this.groups);
    }

    openGroupDetails(event, group) {
        this.nav.push(GroupDetailsPage, { group: group });
    }
}

@Page({
    templateUrl: 'build/pages/main/groupdetails.html',
    pipes: [TranslatePipe]
})
class GroupDetailsPage {
    group:Group;

    constructor(params: NavParams) {
        this.group = params.data.group;
        console.log(this.group);

    }
}

@Page({
    templateUrl: 'build/pages/main/addgroup.html',
    pipes: [TranslatePipe]
})
class AddGroupContentPage {

    form:ControlGroup;

    constructor(private nav:NavController, navParams:NavParams) {
        this.form = new ControlGroup({
            name: new Control("", Validators.required),
            shared: new Control(false, Validators.required),
            password: new Control("", Validators.required),
            worldRanking: new Control(false, Validators.required),
            description: new Control("")
        });
    }

    createGroup(event):void {
        var name:string = this.form.value.name;
        var shared:boolean = this.form.value.shared;
        var password:string = this.form.value.password;
        var worldRanking:boolean = this.form.value.worldRanking;
        var description:string = this.form.value.description;


        console.log('save name=', name);

        var group:Group = new Group(name, description, shared, password, worldRanking, appModel.getAuthData().uid);
        console.log('group ', group);
        new FireBaseService().createGroup(group, appModel.getAuthData());

        this.nav.push(ListGroupContentPage);
    }
}