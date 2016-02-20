import {Page, NavController, NavParams, TranslatePipe} from "ionic-framework/ionic";

@Page({
  templateUrl: 'build/pages/about/about.html',
  pipes: [TranslatePipe]
})

export class AboutPage {

  constructor(private nav: NavController, navParams: NavParams) {

  }

}
