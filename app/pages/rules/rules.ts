import {Page, NavController, NavParams, TranslatePipe} from 'ionic-angular';

@Page({
  templateUrl: 'build/pages/rules/rules.html',
  pipes: [TranslatePipe]
})

export class RulesPage {

  constructor(private nav: NavController, navParams: NavParams) {

  }

}
