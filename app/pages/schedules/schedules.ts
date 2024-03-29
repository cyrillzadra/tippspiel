import {Page, NavController, NavParams, TranslatePipe} from 'ionic-angular';
import {fbName} from "../fbConfig";

var Firebase = require('firebase');


@Page({
  templateUrl: 'build/pages/schedules/schedules.html',
  pipes: [TranslatePipe]
})
export class SchedulesPage {
  selectedItem: any;
  icons: string[];
  items: Array<{homeTeam: string, visitorTeam: string, icon: string}>;
  uid: string;

  constructor(private nav: NavController, navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.uid = navParams.get('uid');

    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];

    this.items = [];

    // Get a database reference to our posts
    var ref = new Firebase(fbName + "/schedules/");

    var list = this;

    // Attach an asynchronous callback to read the data at our posts reference
    ref.on("value", function(snapshot) {

      console.log(snapshot.val());

      snapshot.forEach( function(data) {
        list.items.push({
          homeTeam: data.val().homeTeam,
          visitorTeam: data.val().visitorTeam,
          icon: list.icons[Math.floor(Math.random() * list.icons.length)]
        });
      });

    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }

  itemTapped(event, item) {
    this.nav.push(SchedulesPage, {
      uid: '???',
      item: item
    });
  }
}
