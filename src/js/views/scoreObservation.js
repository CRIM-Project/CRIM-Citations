import $ from 'jquery';
import * as Backbone from 'backbone';
import Events from '../utils/backbone-events';
import score_observation_tpl from '../templates/score_observation-tpl';
import voice_tpl from '../templates/voice-tpl';
import dialogPolyfill from 'dialog-polyfill'

class ScoreObservation extends Backbone.View {

  initialize(options){
    this.container = options.container
    this.score = options.score

    this.listenTo(Events, "closedObserv", this.stopHideMode)
  }

  template(tpl){
      return score_observation_tpl(tpl);
  }

  get tagName(){
    return "dialog"
  }

  get className() {
    return "mdl-dialog score_observation_dialog"
  }

  get events() {
      return {
          "click .close": this.close,
          "click .drop": this.showMusType,
          "change .cb": this.showMusTypeCh,
          "click #save_score_observation": this.save,
          "click #cancel_score_observation": this.cancel,
          "click .hide_button": this.hide,
          "click .addVoice": this.addVoice
      }
  }

  cancel() {
    if (Object.keys(this.model.get("types")).length == 0) {
        this.collection.remove(this.model.cid);
    }
    this.score.trigger("clearHighlight")
  }

  hide() {
    this.$el.data("hiding", "true")
    this.el.close()
    Events.trigger("startHideMode")
  }

  save(){
    // Now "set" all the things on this.model.
    if (this.ema){
      this.model.set("ema", this.ema)
    }
    if (this.title){
      this.model.set("title", this.title)
    }
    if (this.mei_ids){
      this.model.set("mei_ids", this.mei_ids)
    }
    // reset types
    this.model.set("types", {})
    this.model.set("comment", this.$el.find("#observ-comment").val())
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
        type_data.options = []
        $type.find(".rest .group").each((j, group)=>{
          type_data.isSelect = true
          let grp = {}
          $(group).find("select option:selected").each((j, option)=>{
            let $option = $(option)
            let key = $option.parent().attr("id").split("-").pop()
            grp[key] = $option.val()
          })
          type_data.options.push(grp)
        })
        this.model.get("types")[DOMid] = type_data
      }
    })
    this.close();
    this.model.collection.trigger("savedObserv");
  }

  // Voice handling is ugly, but needed to be done hastily.
  // When (if) refactoring, use a collection and dedicated views.
  // Possibly types would need their own Coll and Model
  setDropdowns(){
    // Dropdowns need to be handled with JS (ie not by the template)

    this.$el.find("select").prop("disabled", true)


    let types = this.model.get("types")
    for (let type in types){
      if (types[type].isSelect) {
        for (let [grp_i, group] of types[type].options.entries()) {
          let $cnt = $("<span class='group'></span>")
          let $div = this.$el.find("#"+type).closest("div").find(".selectGroup")
          let addRemove = false
          $div.append($cnt)
          for (let key in group) {
            let $select = this.$el.find("#"+type+"-"+key)
            if ($select.length == 0){
              this.addVoiceTpl($cnt, type)
              addRemove = true
            }
            else {
              addRemove = false
            }
            this.$el.find("#"+type+"-"+key).prop("disabled", false)
            this.$el.find("#"+type+"-"+key+" option").each((i, opt)=>{
              if ($(opt).val() == types[type]["options"][grp_i][key]) {
                $(opt).prop("selected", true)
              }
            })
          }
          if (addRemove) this.addRemoveVoice($cnt)
        }
      }
    }
  }

  addVoiceTpl(cnt, type) {
    let $cnt = $(cnt)
    let pos = $cnt.closest(".selectGroup").find("select").length
    let tpl = {
      voices : this.voices,
      type : type,
      pos : pos+1
    }
    let el = voice_tpl(tpl)
    $cnt.append(el)
  }

  addRemoveVoice(div){
    let removebtn = $(`<button class="voiceremove btn btn-danger mdl-button mdl-js-button">
      Remove
    </button>`)
    div.append(removebtn)
    removebtn.click(()=>{
      div.remove()
    })
  }

  addVoice(e) {
    e.preventDefault()
    let $a = $(e.target).closest("div")
    let $div = $a.prev("div")
    let type = $a.data("for")
    let $cnt = $("<div class='group block form-horizontal'></div>")
    $div.append($cnt)
    this.addVoiceTpl($cnt, type)
    if ($a.data("pair")) {
      this.addVoiceTpl($cnt, type)
    }
    this.addRemoveVoice($cnt)
  }

  highlightNotation() {
    if (!this.score.get("hasSelection")){
      let mei_ids = this.model.get("mei_ids")
      mei_ids = mei_ids ? mei_ids : this.mei_ids
      this.score.trigger("highlight", mei_ids);
    }
  }

  showMusType(e) {
    $(e.target).closest('.types').find('.rest').toggle();
    // Toggle the wording of the button between "Expand" and "Collapse".
    $(e.target).closest('.types').find(".collapse").toggle();
    $(e.target).closest('.types').find(".expand").toggle();
  }

  showMusTypeCh(e) {
    var box = $(e.target)
    // `rest` is the collapsible information containing the subtypes
    // of the clicked type. It should be expanded and enabled on the selected
    // item, while being collapsed and disabled on the others.
    this.$el.find('.main-type').each(function() {
      var rest = $(this).closest('.types').find('.rest');
      if ($(this).find("input").prop("checked")) {
        rest.find("input, textarea, select, button").prop("disabled", false).parent().removeClass("is-disabled");
        rest.show();
        // Display "Collapse" instead of "Expand" on the link.
        $(e.target).closest('.types').find(".collapse").show();
        $(e.target).closest('.types').find(".expand").hide();
      }
      else {
        // Don't collapse unselected types because that could be annoying,
        // in case the user wants to compare two types. The user can always
        // manually collapse types.
        rest.find("input, textarea, select, button").prop("disabled", true).parent().addClass("is-disabled");
      }
    })
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
    this.score.trigger("clearHighlight")
    this.el.close();
    Events.trigger("closedObserv")
    this.$el.detach();
  }

  stopHideMode() {
    this.$el.data("hiding", "false")
  }

  render(observ) {
    if (observ) {
      this.model = this.collection.get(observ)
    }
    else {
      this.model = this.collection.add({})
    }
    let jmodel = this.model.toJSON()
    if (!this.model.get("ema")) {
      jmodel.ema = this.ema
    }
    if (!this.model.get("title")) {
      jmodel.title = this.title
    }
    jmodel.voices = this.voices
    this.container.append(this.$el.html(this.template(jmodel)))

    this.setDropdowns()

    if (! this.el.showModal) {
      dialogPolyfill.registerDialog(this.el);
    }

    this.highlightNotation()

  }

}

export default ScoreObservation
