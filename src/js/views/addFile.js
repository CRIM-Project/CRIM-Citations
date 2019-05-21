import $ from 'jquery';
import * as Backbone from 'backbone';
import Events from '../utils/backbone-events';
import addfile_tpl from '../templates/addfile-tpl';
import dialogPolyfill from 'dialog-polyfill';
import {printComposers} from '../utils/import-functions';


class AddFile extends Backbone.View {

  initialize (options) {
    this.container = options.container;
    this.scores = [];
  }

  get tagName(){
    return "dialog"
  }

  get className() {
    return "mdl-dialog addFile"
  }

  template(tpl){
      return addfile_tpl(tpl);
  }

  get events() {
      return {
          "click .close": this.close,
          "click #openFile": this.open
          // "click #from_url": this.fromUrl,
      }
  }

  open(e) {
    $("#loader").show()
    if (this.$el.find("#crim-panel.is-active").length > 0) {
      let meiScores = [];
      for (let score of this.$el.find("#crim-panel .mdl-checkbox__input:checked")) {
        let $score = $(score);
        meiScores.push(this.fromUrl($score.val(), $score.data("piece_id"), $score.data("title"), $score.data("composer")));
      }
      Promise.all(meiScores).then((data) => {
        for (const fileInfo of data) {
          Events.trigger('addScore', fileInfo);
        }
      })
    }
    else {
      this.fromUrl();
    }
    this.close();
  }

  fromUrl(url, piece_id, title, composer) {

    if (!url){
      url = this.$el.find("#url_input").val().trim();
    }
    // let processed_url = url + "/all/all/@all"

    let fileInfo = {
        "filename": url.replace(/^.*[\\\/]/, ''),
        "piece_id": piece_id.replace(/[\[\]]/g, ''),
        "title": title,
        "composer": composer,
        "url": url
    };

    return new Promise((res, rej) => {
      $.get(url, (data) => {
        fileInfo["string"] = data;
        res(fileInfo)
      }, 'text')
        .fail((msg)=>{
          console.log(msg);
          rej(msg)
        })
    })
  }

  show() {
    // it it's detached, render.
    if (this.$el.parent().length == 0) {
      this.render().then(()=>{
        // Assumes MDL JS
        if(!(typeof(componentHandler) == 'undefined')){
            componentHandler.upgradeAllRegistered();
        }
        this.el.showModal();
      })
    }
    else this.el.showModal();
  }

  close() {

    for (let score of this.$el.find("#crim-panel .mdl-checkbox__input:checked")){
      let $score = $(score)
      $score.prop("checked", false)
      $score.parent().removeClass("is-checked")

    }

    this.el.close();
  }

  render() {
    var all_pieces_url = document.getElementById("main-citations").getAttribute("data-pieces");

    // get files info
    return $.get(all_pieces_url, (pieces)=>{
      for (let piece of pieces) {
        // Add title of mass to piece title
        if (piece.mass) {
          var title = piece.mass.title + ": " + piece.title;
        }
        else {
          var title = piece.title;
        }
        // Use only the first MEI link, at least for now -- or until we have
        // better defined desired behavior for multiple links
        let first_mei_link = piece.mei_links[0];
        let fileinfo = {
          title: title,
          url: first_mei_link,
          piece_id: (piece.piece_id),
          composer: printComposers(piece)
        };
        this.scores.push(fileinfo);
      }

      this.container.append(this.$el.html(this.template({scores:this.scores})))
      if (! this.el.showModal) {
        dialogPolyfill.registerDialog(this.el);
      }

    }, 'json')
  }

}

export default AddFile;
