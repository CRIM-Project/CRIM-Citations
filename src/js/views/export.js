import $ from 'jquery';
import * as Backbone from 'backbone';
import Events from '../utils/backbone-events';
import export_tpl from '../templates/export-tpl';
import dialogPolyfill from 'dialog-polyfill'
import saveAs from 'save-as';
import {internalToSerialized} from '../utils/import-functions';


class Export extends Backbone.View {

  initialize (options) {
    this.container = options.container;
  }

  get tagName(){
    return "dialog"
  }

  get className() {
    return "mdl-dialog export"
  }

  template(tpl){
    return export_tpl(tpl);
  }

  get events() {
    return {
      "click .close": this.close,
      "click #expToDisk": this.expToDisk,
      "click #expToCRIMOnline": this.expToCRIMOnline
    }
  }

  expToDisk() {
    // let string = JSON.stringify(internalToSerialized(this.data));
    let string = JSON.stringify(this.data);
    let bb = new Blob([string], {"type":"application\/json"});
    let filename = this.data.user ? ("user" + this.data.user) : "anonymous";
    filename = filename + "_" + this.data.created_at + ".json";
    saveAs(bb, filename);
    this.$el.find("#expToDisk").addClass("btn-warning");
    this.$el.find("#expToDisk").removeClass("btn-info");
    this.$el.find("#expDialogText").html("Your session has been downloaded. You may wish to clear your session before creating new analyses and downloading again.");
  }

  expUpdatedObsToCRIMOnline(observation, type) {
    var target_url, request_type;
    var request_location;
    if (observation.observation_id) {
      request_location = '/data/observations/'+observation.observation_id+'/';
    }
    else {
      request_location = '/data/observations/new/';
    }
    observation['csrfmiddlewaretoken'] = csrftoken;
    $.ajax({
      headers: {
        'X-CSRFToken': csrftoken
      },
      url: request_location,
      type: 'PUT',
      data: observation,
      withCredentials: true,
      success: () => {
        this.$el.find("#expDialogText").append("<p>Updated " + type + ".</p>");
      },
      error: (err) => {
        this.$el.find("#expDialogText").append("<p><strong>An error occured when trying to update the " + type + " observation.</strong></p>");
        console.log(err);
      }
    });
  }

  expToCRIMOnline() {
    var target_url, request_type;
    var processed_data = internalToSerialized(this.data);
    let r = confirm("This will send the data directly to the CRIM online database. Continue?");
    if (r) {
      this.$el.find("#expToCRIMOnline").removeClass("btn-info");
      for (var data of processed_data) {
        var relationship = data.relationship
        // If we have existing observations, then make separate AJAX requests
        // for them.
        if (data.model.observation_id) {
          this.expUpdatedObsToCRIMOnline(data.model, 'model');
        }
        if (data.derivative.observation_id) {
          this.expUpdatedObsToCRIMOnline(data.derivative, 'derivative');
        }
        relationship['csrfmiddlewaretoken'] = csrftoken;
        // Move relationship_id to the relationship itself, so that we don't end
        // up with two relationships when we were supposed to be editing just one
        // and run into problems.
        if (relationship.relationship_id == 'new') {
          request_type = 'POST';
        }
        else {
          request_type = 'PUT';
        }
        $.ajax({
          headers: {
            'X-CSRFToken': csrftoken
          },
          url: '/data/relationships/'+relationship.relationship_id+'/',
          type: request_type,
          data: relationship,
          withCredentials: true,
          success: () => {
            // Change color of download buttons to indicate that the action
            // has already been performed. Users should think twice about
            // exporting or downloading the same relationships twice.
            this.$el.find("#expToCRIMOnline").addClass("btn-warning");
            this.$el.find("#expDialogText").html("Your analyses have been successfully exported to the CRIM online database. You may wish to clear your session before creating new analyses and exporting again.");
          },
          error: (err) => {
            this.$el.find("#expDialogText").html("<strong>An error occured.</strong> Please make sure that you are logged in and try again. You must have a user account associated with a <a href='/people/'>person in the CRIM database</a>. In the meantime, you may wish to save your work by downloading your analyses to disk.");
            console.log(err);
          }
        });
      }
    }
  }

  show(data) {
    this.data = data;
    // it it's detached, render.
    if (this.$el.parent().length == 0) {
      this.render();
      // Assumes MDL JS
      if (!(typeof(componentHandler) == 'undefined')) {
        componentHandler.upgradeAllRegistered();
      }
    }

    this.el.showModal();
  }

  close() {
    this.el.close();
  }

  render() {
    this.container.append(this.$el.html(this.template()));
    if (! this.el.showModal) {
      dialogPolyfill.registerDialog(this.el);
    }
  }

}

export default Export
