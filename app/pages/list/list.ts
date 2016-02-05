import {Page, NavController, NavParams, Translate, TranslatePipe} from 'ionic-framework/ionic';
import {fbName} from "../fbConfig";

var Firebase = require('firebase');


@Page({
  templateUrl: 'build/pages/list/list.html',
  pipes: [TranslatePipe]
})
export class ListPage {
  selectedItem: any;
  icons: string[];
  items: Array<{homeTeam: string, visitorTeam: string, icon: string}>;
  uid: string;

  constructor(private nav: NavController, navParams: NavParams, trans : Translate) {

    // Example German string mapping
    trans.translations('de', {
      'FRA' : 'Frankreich',
      'ROU' : 'Rumänien',
      'SUI' : 'Schweiz',
      'ALB' : 'Albanien',
      'WAL' : 'Wales',
      'SVK' : 'Slowakei',
      'RUS' : 'Russland',
      'ENG' : 'England',
      'POL' : 'Polen',
      'NIR' : 'Nordirland',
      'UKR' : 'Ukraine',
      'GER' : 'Deutschland',
      'TUR' : 'Türkei',
      'ESP' : 'Spanien',
      'CZE' : 'Tschechien',
      'CRO' : 'Kroatien',
      'IRL' : 'Irland',
      'BEL' : 'Belgien',
      'SWE' : 'Schweden',
      'ITA' : 'Italien',
      'AUT' : 'Österreich',
      'HUN' : 'Ungarn',
      'ISL' : 'Island',
      'POR' : 'Portugal'
    });

    console.log(trans.translate('FRA')); // Shows 'Location'
    console.log(trans.translate('FRA', 'de')); // Shows 'lage'

    trans.setLanguage('de');

    console.log(trans.translate('FRA')); // Shows 'Location'


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
    this.nav.push(ListPage, {
      uid: '???',
      item: item
    });
  }
}
