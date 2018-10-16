import $ from 'jquery';
import * as Backbone from 'backbone';
import Continuo from '../../lib/continuo/js/continuo';
import Events from '../utils/backbone-events';
import score_tpl from '../templates/score-tpl'
import ScoreObservationView from './scoreObservation';
import ScoreObservationsView from './scoreObservations';
import verovioToolkit from '../utils/verovioInstance';

class ScoreView extends Backbone.View {

  initialize (options) {
    this.page = 1
    this.scoreObservationDialog = new ScoreObservationView({container: $("#dialogs"), collection: this.model.observations, score: this.model})
    this.ScoreObservationsDialog = new ScoreObservationsView({container: $("#dialogs"), collection: this.model.observations, score: this.model.cid})

    this.listenTo(this.model.observations, "edit_observation", this.showObservation)
    this.listenTo(this.model.observations, "delete_observation", this.deleteObservation)
    this.listenTo(this.model.collection, "delete_observation", this.deleteObservation)
    this.listenTo(this.model, "edit_observation", this.showObservation)
    this.listenTo(this.model, "new_observation", this.newObesrvation)
    this.listenTo(this.model, "close", this.close)
    this.listenTo(this.ScoreObservationsDialog, "redoVerovioLayout", this.doVerovioLayout)
    this.listenTo(this.model, "redoVerovioLayout", this.doVerovioLayout)
    this.listenTo(this.model, "highlight", this.highlight)
    this.listenTo(this.model, "clearHighlight", ()=>{this.setData(); this.continuo.clearHighlight()})
    this.listenTo(this.model, "showRelationshipButton", ()=>{this.$el.find(".show-score-relationship").show()})
    this.listenTo(this.model.collection, "hideRelationshipButtons", ()=>{this.$el.find(".show-score-relationship").hide()})
    this.listenTo(this.model.collection, "clearScoreSelections", this.clearScoreSelections)
    this.listenTo(this.model.collection, "storeSelections", this.storeSelection)
    this.listenTo(this.model.collection, "disableButtons", this.disableButtons)
    this.listenTo(this.model.collection, "renableButtons", this.renableButtons)

    // Eveytime the score container is touched, re-load its MEI data into Verovio (all score boxes are sharing ONE Verovio instance)
    this.$el.on("mousedown", ()=>{
      this.setData()
    })
  }

  get className() {
      return "mdl-cell mdl-cell--12-col mdl-shadow--2dp score_container";
  }

  template(tpl){
      return score_tpl(tpl);
  }

  get events() {
      return {
          "click .nextPage": this.nextPage,
          "click .prevPage": this.prevPage,
          "click .collapse_expand_button": this.toggle,
          "click .show-score-observations": this.showObservations,
          // "click .show-score-observation": this.newObservation,
          "click .show-score-relationship": this.showRelationship,
          "click .close_score_button": this.close
      }
  }

  render() {

    // Update id from model
    let score_id = 'score-' + this.model.cid
    this.$el.prop("id", score_id);

    this.$el.html(this.template({
      title: this.model.get("title"),
      piece_id: this.model.get("piece_id"),
      composer: this.model.get("composer")
    }));

    Events.trigger("scoreRendered")

    $("#loader").hide()

    return this.$el

  }

  get verovioOpts() {
    let scale = 35;
    let border = 20;

    return {
        pageWidth: this.$el.width() * 100 / scale,
        pageHeight: 250 * 100 / scale,
        ignoreLayout: 1,
        adjustPageHeight: 1,
        border: border,
        scale: scale
    };
  }

  doVerovioLayout() {
    verovioToolkit.setOptions(this.verovioOpts)
    verovioToolkit.redoLayout()
  }

  renderContinuoScore() {
    let score_path = "#score-" + this.model.cid + " .score"

    this.continuo = new Continuo({
      el: score_path,
      meiString: this.model.get("mei"),
      verovioToolkit: verovioToolkit,
      verovioOptions: this.verovioOpts,
      paginate: true,
      showPageCtrls: false
    })

    this.continuo.render()

    // Adjust height to SVG
    this.$el.height(this.$el.find('svg').height() + 100)

    this.listenTo(this.continuo, "selected", ()=>{
      // show observation button
      // this.$el.find(".show-score-observation").show()
      this.model.set("hasSelection", true)
    })
    this.listenTo(this.continuo, "deselected", ()=>{
      if (this.continuo.selectedElements.length == 0) {
        // hide observation button
        // this.$el.find(".show-score-observation").hide()
        this.model.set("hasSelection", false)
      }
    })
    this.listenTo(this.continuo, "clearedSelection", ()=>{
      // hide observation button
      // this.$el.find(".show-score-observation").hide()
      this.model.set("hasSelection", false)
    })

  }

  setData(){
    if (ScoreView.verovioData != this.model.cid) {
        verovioToolkit.loadData(this.model.get("mei"))
        ScoreView.verovioData = this.model.cid
    }
  }

  clearScoreSelections(){
    this.continuo.clearSelection()
    this.$el.find(".show-score-relationship").hide()
  }

  highlight(ids){
    this.setData()
    this.continuo.highlight(ids)
  }

  nextPage() {
    if (ScoreView.verovioData != this.model.cid) {
        verovioToolkit.loadData(this.model.get("mei"))
        ScoreView.verovioData = this.model.cid
    }
    if (this.page + 1 <= verovioToolkit.getPageCount()) {
        this.page = this.page +1;
        this.continuo.renderPage(this.page)
    }
  }

  prevPage() {
    if (ScoreView.verovioData != this.model.cid) {
        verovioToolkit.loadData(this.model.get("mei"))
        ScoreView.verovioData = this.model.cid
    }
    if (this.page - 1 > 0) {
        this.page = this.page - 1;
        this.continuo.renderPage(this.page)
    }
  }

  toggle() {
    // Change the wording of the button, and add the collapsed style.
    var collapse_expand_button = this.$el.find(".collapse_expand_button");
    if (this.$el.hasClass('score_collapsed')) {
      this.$el.removeClass('score_collapsed');
      collapse_expand_button.text("Collapse");
    }
    else {
      this.$el.addClass('score_collapsed');
      collapse_expand_button.text("Expand");
    }
  }

  deleteObservation(observ) {
    this.model.observations.remove(observ)
  }

  showObservations() {
    this.ScoreObservationsDialog.render().then(()=>{
      // Assumes MDL JS
      if(!(typeof(componentHandler) == 'undefined')){
          componentHandler.upgradeAllRegistered();
      }
      this.ScoreObservationsDialog.show()
    })
  }

  showObservation(observ) {
    if (!this.scoreObservationDialog.voices){
      this.scoreObservationDialog.voices = this.model.get("voices")
    }
    this.scoreObservationDialog.render(observ)
    // Assumes MDL JS
    if(!(typeof(componentHandler) == 'undefined')){
        componentHandler.upgradeAllRegistered();
    }
    this.scoreObservationDialog.show()
  }

  newObservation(new_observ){
    this.scoreObservationDialog.ema = this.$el.find(".cnt-emaexpr-expr").text()
    if (!this.scoreObservationDialog.ema) {
      this.scoreObservationDialog.ema = this.model.get("ema")
    }
    // this.scoreObservationDialog.score = this.model
    this.scoreObservationDialog.title = this.model.get("title")
    this.scoreObservationDialog.voices = this.model.get("voices")
    this.scoreObservationDialog.mei_ids = this.continuo.selectedElements
    if (this.scoreObservationDialog.mei_ids.length == 0) {
      this.scoreObservationDialog.mei_ids = this.model.get("mei_ids")
    }
    this.showObservation(new_observ)
    // this.continuo.clearSelection()
    // this.$el.find(".show-score-observation").hide()
  }

  getSelections(){
    return new Promise((res, rej)=> {
      this.listenTo(Events, "response:selections", (sel) => res(sel))
      Events.trigger("request:selections")
    })
  }

  showRelationship() {
    this.model.collection.trigger("storeSelections")
    this.getSelections().then((sel)=>{
      Events.trigger("relDialog:open", sel)
    })
    // this.model.collection.trigger("clearScoreSelections")
  }

  storeSelection(){
    this.model.set("ema", this.$el.find(".cnt-emaexpr-expr").text())
    this.model.set("mei_ids", this.continuo.selectedElements)
  }

  disableButtons(){
    this.$el.find(".show-score-relationship").attr("disabled", true)
    this.$el.find(".show-score-observations").attr("disabled", true)
    // find a way to cover .cnt-container to stop click events on it
    let $score = this.$el.find(".score")
    let $mask = $("<div class='mask'></div>")
    $mask.width($score.width())
    $mask.height($score.height()-45)
    $score.prepend($mask)
  }

  renableButtons(){
    this.$el.find(".show-score-relationship").attr("disabled", false)
    this.$el.find(".show-score-observations").attr("disabled", false)
    this.$el.find(".mask").remove()
  }

  close(force=false){
    // only close if it's not a target of a relationship or observation
    new Promise((res, rej)=>{
      this.listenTo(Events, "response:relationships", (rels) => res(rels))
      Events.trigger("request:relationshipsFor", this.model.cid)
    }).then((rels)=>{
      if (this.model.observations.models.length == 0 && rels.length == 0) {
        let r = false
        if (!force) {
          r = confirm("Are you sure you want to close this score?")
        }
        if (r || force) {
          this.remove()
          this.$el.detach()
          this.$el.remove()
        }
      }
      else {
        alert("Cannot close this score because it contains relationships or observations.")
      }
    })
  }

}

// Class-level shared verovio data info
ScoreView.verovioData = false;

export default ScoreView
