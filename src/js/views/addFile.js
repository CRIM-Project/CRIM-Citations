import $ from 'jquery';
import * as Backbone from 'backbone';
import Events from '../utils/backbone-events';
import addfile_tpl from '../templates/addfile-tpl';
import dialogPolyfill from 'dialog-polyfill'
import '../../../lib/dropbox/dropins';


function print_composers(piece) {
  var printed_role_list = [];
  if (piece.mass) {
    var all_roles = piece.roles.concat(piece.mass.roles);
  }
  else {
    var all_roles = piece.roles;
  }
  for (let role of all_roles) {
    if (role.role_type.role_type_id == "composer") {
      printed_role_list.push(role.person.name);
    }
  };
  return printed_role_list.join(", ");
}

class AddFile extends Backbone.View {

  initialize (options) {
    Dropbox.appKey = "gwuog2373cwj45g";
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
          // "click #from_dropbox": this.fromDropbox,
      }
  }

  open(e) {
    $("#loader").show()
    if (this.$el.find("#crim-panel.is-active").length > 0){
      for (let score of this.$el.find("#crim-panel .mdl-checkbox__input:checked")){
        let $score = $(score);
        this.fromUrl($score.val(), $score.data("roles"), $score.data("title") )
      }
    }
    else {
      this.fromUrl()
    }
    this.close()
  }

  fromUrl(url, roles, title) {

    if (!url){
      url = this.$el.find("#url_input").val().trim();
    }
    // let processed_url = url + "/all/all/@all"

    let fileInfo = {
        "filename": url.replace(/^.*[\\\/]/, ''),
        "roles": roles,
        "title": title,
        "url": url
    };

    $.get(url, (data) => {
      fileInfo["string"] = data;
      Events.trigger('addScore', fileInfo);
    }, 'text')
      .fail((msg)=>{
          console.log(msg);
      })
  }

  fromDropbox() {
    this.close()
    let options = {
        // Required. Called when a user selects an item in the Chooser.
        success: function(files) {
            let fileInfo = {
                "filename": files[0].name,
                "url": files[0].link
            };
            $.get(files[0].link, (data) => {
              fileInfo["string"] = data;
              Events.trigger('addScore', fileInfo);
            }, 'text').fail((msg)=>{
                console.log(msg);
            })
        },

        // Optional. Called when the user closes the dialog without selecting a file
        // and does not include any parameters.
        cancel: function() {

        },
        linkType: "direct",
        multiselect: false,
        extensions: ['.xml', '.mei'],
    };

    Dropbox.choose(options);
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
        if (piece.mass) {
          var title = "[" + piece.piece_id + "] " + piece.mass.title + ": " + piece.title;
        }
        else {
          var title = "[" + piece.piece_id + "] " + piece.title;
        }
        // Add composer, editor, etc. to roles
        title = title + " (" + print_composers(piece) + ")"
        // Use only the first MEI link, at least for now -- or until we have
        // better defined desired behavior for multiple links
        let first_mei_link = piece.mei_links[0];
        let fileinfo = {
          title: title,
          url: first_mei_link,
          id: (piece.piece_id)
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
