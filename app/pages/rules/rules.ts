import {Page, NavController, NavParams, TranslatePipe} from "ionic-framework/ionic";

@Page({
  templateUrl: 'build/pages/rules/rules.html',
  pipes: [TranslatePipe]
})

export class RulesPage {

  constructor(private nav: NavController, navParams: NavParams) {

  }

}
