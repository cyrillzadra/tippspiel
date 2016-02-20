import {Page, NavController, NavParams, TranslatePipe} from "ionic-framework/ionic";
import {ControlGroup, Validators, Control} from "angular2/common";

@Page({
    templateUrl: 'build/pages/main/main.html',
    pipes: [TranslatePipe]
})

export class MainPage {

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

    items:Array<{group: string}>;

    constructor() {
    }
}

@Page({
    templateUrl: 'build/pages/main/addgroup.html',
    pipes: [TranslatePipe]
})
class AddGroupContentPage {

    form:ControlGroup;

    constructor() {
        this.form = new ControlGroup({
            name: new Control("", Validators.required),
            shared: new Control("", Validators.required),
            password: new Control("", Validators.required),
            worldranking: new Control("", Validators.required)
        });
    }
}