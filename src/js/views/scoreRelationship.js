import $ from 'jquery';
import * as Backbone from 'backbone';
import Events from '../utils/backbone-events';
import score_relationship_tpl from '../templates/score_relationship-tpl';
import dialogPolyfill from 'dialog-polyfill'
import verovioToolkit from '../utils/verovioInstance';

class ScoreRelationship extends Backbone.View {

  initialize(options) {
    this.container = options.container;

    this.listenTo(Events, "startHideMode", this.startHideMode);
    this.listenTo(Events, "stopHideMode", this.stopHideMode);
  }

  template(tpl) {
    return score_relationship_tpl(tpl);
  }

  get tagName() {
    return "dialog";
  }

  get className() {
    return "mdl-dialog score_relationship_dialog";
  }

  get events() {
    return {
      "click .close": this.close,
      "click .drop": this.showType,
      "change .cb": this.showTypeCh,
      "click #save_score_relationship": this.save,
      "click #cancel_score_relationship": this.cancel,
      "click .selection_preview": this.preview,
      "click .score_preview_close": this.closePreview,
      "click .show-score-observation": this.showsScoreObservation,
      "click .hide_button": this.hide
    };
  }

  cancel() {
    if (Object.keys(this.model.get("types")).length == 0) {
      this.collection.remove(this.model.cid);
      // Observations belonging to this relationship must be removed as well.
      let observA = this.model.get("scoreAobserv");
      let observB = this.model.get("scoreBobserv");
      if (observA) {
        this.scores[0].observations.remove(observA);
      }
      if (observB) {
        this.scores[1].observations.remove(observB);
      }
    }

    this.scores[0].trigger("clearHighlight");
    this.scores[1].trigger("clearHighlight");
    this.scores[0].trigger("redoVerovioLayout");
  }

  save() {
    $("#import_btn").hide();
    $("#export_btn").show();
    this.model.set("direction", this.$el.find("input[name=rel-dir]:checked").attr("id").split("-").pop())
    this.model.set("comment", this.$el.find("#rel-comment").val())
    this.$el.find(".types").each((i, type) => {
      let $type = $(type)
      let $cb = $type.find(".cb")
      let DOMid = $cb.attr("id")
      if ($cb.prop("checked")) {
        let type_data = {
          "label" : $cb.next().text()
        }
        $type.find(".rest input, .rest textarea").each((j, input)=>{
          let $input = $(input)
          let key = $input.attr("id").split("-").pop()
          // let name = $input.attr("name") ? $input.attr("name").split("-").pop() : ""
          switch ($input.attr("type")) {
              case "text":
                type_data[key] = $input.val()
                break;
              case "radio":
              case "checkbox":
                type_data[key] = $input.prop("checked")
                break;
          }
        })
        this.model.get("types")[DOMid] = type_data
      }
      else {
        delete this.model.get("types")[DOMid]
      }
    })

    if (Object.keys(this.model.get("types")).length == 0) {
      let msg = this.$el.find(".messages").show().text("Please choose a relationship type.");
    }
    else {
      this.scores[0].collection.trigger("clearScoreSelections");
      this.close();
    }
  }

  show() {
    // it it's detached, render.
    if (this.$el.parent().length == 0) {
      this.render()
      this.delegateEvents()
      // Assumes MDL JS
      if(!(typeof(componentHandler) == 'undefined')){
          componentHandler.upgradeAllRegistered();
      }
    }
    this.el.showModal();
  }

  close() {
    this.scores[0].trigger("clearHighlight");
    this.scores[1].trigger("clearHighlight");
    this.el.close();
    this.$el.detach();
    this.scores[0].trigger("redoVerovioLayout");
  }

  hide() {
    Events.trigger("startHideMode")
  }

  startHideMode() {
    if (this.$el.attr("open")) {
      this.$el.data("hiding", "true");
      this.el.close();
      this.scores[0].trigger("redoVerovioLayout");
    }
  }

  stopHideMode() {
    // Since the selection can be altered during Hide Mode,
    // we need to update the model as well as the displayed EMA in the
    // relationship dialog box.
    this.scores[0].trigger("storeSelections");
    this.scores[1].trigger("storeSelections");
    this.model.set("scoreA_ema", this.scores[0].get("ema"));
    this.model.set("scoreB_ema", this.scores[1].get("ema"));
    this.model.set("scoreA_meiids", this.scores[0].get("mei_ids"));
    this.model.set("scoreB_meiids", this.scores[1].get("mei_ids"));

    // Update observations
    let observ_A_id = this.model.get("scoreAobserv");
    let observ_B_id = this.model.get("scoreBobserv");
    let observA = this.scores[0].observations.get(observ_A_id);
    let observB = this.scores[1].observations.get(observ_B_id);
    if (observA) {
      observA.set("ema", this.scores[0].get("ema"));
    }
    if (observB) {
      observB.set("ema", this.scores[1].get("ema"));
    }

    // Update listing of EMA in dialog boxes
    this.$el.find(".scoreA_ema").html(this.scores[0].get("ema"));
    this.$el.find(".scoreA_ema").attr("title", this.scores[0].get("ema"));
    this.$el.find(".scoreB_ema").html(this.scores[1].get("ema"));
    this.$el.find(".scoreB_ema").attr("title", this.scores[1].get("ema"));

    // Now show the modal again
    if (this.$el.parent() == length >0 && !this.$el.attr("open")) {
      this.$el.data("hiding", "false");
      this.el.showModal();
    }
  }

  showsScoreObservation(e) {
    let score_place = $(e.target).closest('li').data('score')
    let score_idx = score_place == "A" ? 0 : 1
    let score = this.scores[score_idx]
    let score_observ_id = this.model.get("score"+score_place+"observ")
    let score_observ = score.observations.get(score_observ_id)
    if (!score_observ) {
      score.set("ema", this.model.get("score"+score_place+"_ema"))
      score.set("mei_ids", this.model.get("score"+score_place+"_meiids"))
      let new_observ = score.newObservation()
      this.model.set("score"+score_place+"observ", new_observ.cid)
    }
    else {
      score.trigger("edit_observation", score_observ_id)
    }
  }

  updateObserv(){
    let observ_A_id = this.model.get("scoreAobserv")
    let observ_B_id = this.model.get("scoreBobserv")

    if (observ_A_id && this.scores[0].observations.get(observ_A_id)) {
      let types = this.scores[0].observations.get(observ_A_id).get("types")
      if (types) {
        let labels = []
        for (let type in types){
          labels.push(types[type].label)
        }
        if (labels.length > 0) {
          this.$el.find(".observ_typesA").html("("+labels.join(", ")+")")
          this.$el.find(".observ_typesA").attr("title", "("+labels.join(", ")+")")
        }
      }
    }
    if (observ_B_id  && this.scores[1].observations.get(observ_B_id)) {
      let types = this.scores[1].observations.get(observ_B_id).get("types")
      if (types) {
        let labels = []
        for (let type in types){
          labels.push(types[type].label)
        }
        if (labels.length > 0) {
          this.$el.find(".observ_typesB").html("("+labels.join(", ")+")")
          this.$el.find(".observ_typesB").attr("title", "("+labels.join(", ")+")")
        }
      }
    }
  }

  showType(e) {
    $(e.target).closest('.types').find('.rest').toggle()
    // Toggle the wording of the button between "Expand" and "Collapse".
    $(e.target).closest('.types').find(".collapse").toggle();
    $(e.target).closest('.types').find(".expand").toggle();
  }

  showTypeCh(e) {
    var box = $(e.target);
    // `rest` is the collapsible information containing the subtypes
    // of the clicked type. It should be expanded and enabled on the selected
    // item, while being collapsed and disabled on the others.
    this.$el.find('.main-type').each(function() {
      var rest = $(this).closest('.types').find('.rest');
      if ($(this).find("input").prop("checked")) {
        rest.find("input, textarea").prop("disabled", false).parent().removeClass("is-disabled");
        rest.show();
        // Display "Collapse" instead of "Expand" on the link.
        $(e.target).closest('.types').find(".collapse").show();
        $(e.target).closest('.types').find(".expand").hide();
      }
      else {
        // Don't collapse unselected types because that could be annoying,
        // in case the user wants to compare two types. The user can always
        // manually collapse types.
        rest.find("input, textarea").prop("disabled", true).parent().addClass("is-disabled");
      }
    })
  }

  preview(e) {
    let score_place = $(e.target).closest(".mdl-list__item").data("score")
    let score = score_place == "A" ? this.scores[0] : this.scores[1]
    let mei_ids = this.model.get("score"+score_place+"_meiids")

    let opts = {
        pageWidth: 150 * 100 / 35,
        pageHeight: 150 * 100 / 35,
        border: 0,
        scale: 35
    };

    verovioToolkit.loadData(score.get("mei"))
    verovioToolkit.setOptions(opts)
    verovioToolkit.redoLayout()

    let page = verovioToolkit.getPageWithElement(mei_ids[0])
    let svg = verovioToolkit.renderPage(page)

    this.$el.find(".score_preview").html(svg)
    for (let id of mei_ids) {
        let el = this.$el.find("#"+id)
        if (el.length > 0) {
            el.get(0).setAttribute("class", "preview_selected")
        }
    }

    this.$el.find(".score_preview_cnt").show()

  }

  closePreview(){
    this.$el.find(".score_preview_cnt").hide()
    this.scores[0].trigger("redoVerovioLayout")
  }

  highlightNotation() {
    this.scores[0].trigger("highlight", this.model.get("scoreA_meiids"));
    this.scores[1].trigger("highlight", this.model.get("scoreB_meiids"));
  }

  render(scores, rel) {
    this.scores = scores

    this.listenTo(scores[0].observations, "savedObserv", this.updateObserv)
    this.listenTo(scores[1].observations, "savedObserv", this.updateObserv)

    if (rel) {
      this.model = this.collection.get(rel)
    }
    else {
      this.model = this.collection.add({})
    }

    if (!this.model.get("scoreA")) {
      this.model.set("scoreA", scores[0].cid);
      this.model.set("scoreA_ema", scores[0].get("ema"));
      this.model.set("scoreA_meiids", scores[0].get("mei_ids"));
      this.model.set("titleA", scores[0].get("title"));
    }
    if (!this.model.get("scoreB")) {
      this.model.set("scoreB", scores[1].cid);
      this.model.set("scoreB_ema", scores[1].get("ema"));
      this.model.set("scoreB_meiids", scores[1].get("mei_ids"));
      this.model.set("titleB", scores[1].get("title"));
    }

    this.scores[0].trigger("clearHighlight");
    this.scores[1].trigger("clearHighlight");
    this.highlightNotation();

    this.container.append(this.$el.html(this.template(this.model.toJSON())))
    if (! this.el.showModal) {
      dialogPolyfill.registerDialog(this.el);
    }
    // Assumes MDL JS
    if(!(typeof(componentHandler) == 'undefined')){
        componentHandler.upgradeAllRegistered();
    }

    this.updateObserv();
  }

}

export default ScoreRelationship
