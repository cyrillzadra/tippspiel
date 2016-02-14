import {Page, NavController, NavParams, TranslatePipe} from "ionic-framework/ionic";

@Page({
  templateUrl: 'build/pages/main/main.html',
  pipes: [TranslatePipe]
})

export class MainPage {

  items: Array<{group: string}>;

  constructor(private nav: NavController, navParams: NavParams) {

  }

}
