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

    constructor() {
        //TODO assign result to items
        console.log('load groups');
        this.groups = new Array<Group>();
        new FireBaseService().getGroups(appModel.getAuthData(), this.groups);
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
            worldRanking: new Control(false, Validators.required)
        });
    }

    createGroup(event):void {
        var name:string = this.form.value.name;
        var shared:boolean = this.form.value.shared;
        var password:string = this.form.value.password;
        var worldRanking:boolean = this.form.value.worldRanking;

        console.log('save name=', name);

        var group:Group = new Group(name, "", shared, password, worldRanking);
        console.log('group ', group);
        new FireBaseService().createGroup(group, appModel.getAuthData());

        this.nav.push(ListGroupContentPage);
    }
}