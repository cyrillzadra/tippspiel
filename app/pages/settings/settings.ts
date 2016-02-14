import {Page, NavController, NavParams, TranslatePipe} from "ionic-framework/ionic";

@Page({
  templateUrl: 'build/pages/settings/settings.html',
  pipes: [TranslatePipe]
})
export class SettingsPage {

  constructor(private nav: NavController, navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param

  }

}
