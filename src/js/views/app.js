import $ from 'jquery';
import * as Backbone from 'backbone';
import Events from '../utils/backbone-events';
import AddFile from './addFile';
import Import from './import';
import Export from './export';
import Scores from '../data/coll-scores';
import ScoreView from './score';
import Relationships from '../data/coll-relationships';
import RelationshipView from './scoreRelationship';
import HideModeComponent from './hideModeComponent';
import getParameterByName from '../utils/paras'

class AppView extends Backbone.View {

  initialize () {
    this.addFileDialog = new AddFile({container: $("#dialogs")})
    this.importDialog = new Import({container: $("#dialogs")})
    this.scores = new Scores
    this.relationships = new Relationships
    this.relationshipDialog = new RelationshipView({container: $("#dialogs"), collection: this.relationships})
    this.hideModeComponent = new HideModeComponent()

    this.listenTo(Events, "addScore", this.addScore)
    this.listenTo(Events, "relDialog:open", this.openRelDialog)
    this.listenTo(Events, "edit_relationship", (relid)=>{this.openRelDialog(undefined, relid)})
    this.listenTo(Events, "delete_relationship", this.removeRel)
    this.listenTo(this.scores, "change", this.hasDoubleSection)

    this.listenTo(Events, "request:selections", ()=>{Events.trigger("response:selections", this.requestSelections())})
    this.listenTo(Events, "request:relationshipsFor", (score)=>{Events.trigger("response:relationships", this.requestRelationshipsFor(score))})

    this.listenTo(Events, "startHideMode", this.startHideMode)
    this.listenTo(Events, "stopHideMode", this.stopHideMode)

    this.listenTo(Events, "import", this.importData)
    this.listenTo(Events, "resetData", this.resetData)

    this.user = getParameterByName("userId") ? getParameterByName("userId") : getParameterByName("userid")
    this.citation = getParameterByName("cit")
    if (this.citation) {
      this.importFromOmeka()
    }

    this.exportDialog = new Export({container: $("#dialogs"), citation : this.citation})

  }

  get events() {
      return {
        "click #add_btn": this.showAddFileDialog,
        "click #export_btn": this.export,
        "click #import_btn": this.import,
        "click #clear_btn": this.resetData
      }
  }

  addScore(fileInfo, createnew=true) {
    let title = fileInfo.filename;
    let piece_id = '';
    let composer = '';
    if (fileInfo.title){
      title = fileInfo.title;
    }
    if (fileInfo.piece_id) {
      piece_id = '[' + fileInfo.piece_id + ']';
    }
    if (fileInfo.composer) {
      composer = 'Composer: ' + fileInfo.composer;
    }
    let scoreView = new ScoreView({model:
      this.scores.add({
        mei: fileInfo.string,
        url: fileInfo.url,
        title: title,
        piece_id: piece_id,
        composer: composer
      })
    })
    this.$el.find("#create_edit .mdl-grid").append(scoreView.render())
    scoreView.renderContinuoScore()
  }

  showAddFileDialog() {
    this.addFileDialog.show()
  }

  openRelDialog(scores, rel) {
    if (!scores && rel){
      let mrel = this.relationships.get(rel)
      scores = [this.scores.get(mrel.get("scoreA")), this.scores.get(mrel.get("scoreB"))]
    }
    this.relationshipDialog.render(scores, rel)
    this.relationshipDialog.show()
  }

  startHideMode() {
    this.scores.trigger("disableButtons")
    this.$el.find(".crim_header").prepend(this.hideModeComponent.render())
  }

  stopHideMode() {
    this.scores.trigger("renableButtons")
  }

  requestSelections(){
    return this.scores.filter((score)=>{
      return score.get("hasSelection")
    })
  }

  requestRelationshipsFor(score){
    return this.relationships.filter((rel)=>{
      return rel.get("scoreA") == score || rel.get("scoreB") == score
    })
  }

  hasDoubleSection(changed_score) {
    let scores_with_selection = this.scores.filter((score)=>{
      return score.get("hasSelection")
    })
    if (scores_with_selection.length == 2) {
      for (let score of scores_with_selection) {
        score.trigger("showRelationshipButtons", scores_with_selection)
      }
    }
    else this.scores.trigger("hideRelationshipButtons")
  }

  export(){

    if (this.relationships.models.length > 0) {
      let time = (new Date()).toISOString().split(".")[0]
      let export_obj = {
        relationships : this.relationships.toJSON(),
        scores: this.scores.export(),
        observations: this.scores.exportObservations(),
        created_at: time,
        user: this.user
      }

      // Remove unreferenced scores
      let relScores = export_obj.relationships.reduce((acc, rel) => {
        acc.add(rel.scoreA)
        acc.add(rel.scoreB)
        return acc
      }, new Set())

      let scoresToKeep = export_obj.scores.reduce((acc, score) => {
        if (relScores.has(score.cid)) {
          acc.push(score)
        }
        return acc
      }, [])

      export_obj.scores = scoresToKeep

      // console.log(export_obj)

      this.exportDialog.show(export_obj)

      return export_obj
    }
    else alert("Please create a relationship before exporting.")
  }

  resetData () {
    let r = confirm("Are you sure you want to clear all selections, relationships, and observations from these scores?");
    if (r) {
      this.relationships.reset();
      this.scores.each((s)=>{
        s.observations.reset();
        s.collection.trigger("clearScoreSelections");
      });
      // Restore download and export buttons to their original color
      this.$el.find("#expToCRIMOnline").addClass("btn-info");
      this.$el.find("#expToCRIMOnline").removeClass("btn-warning");
      this.$el.find("#expToDisk").addClass("btn-info");
      this.$el.find("#expToDisk").removeClass("btn-warning");
      // Restore dialog text
      this.$el.find("#expDialogText").html("Exporting will store your current work to the CRIM database, or to a file that you will be able to open and edit later.");
      if (history.pushState) {
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        if (this.user) {
          newurl = newurl + "?userId="+this.user;
        }
        window.history.pushState({path:newurl},'',newurl);
      }
    }
  }

  importFromOmeka(){
    // get the citation
    $("#loader").show()
    $.get("http://92.154.49.37/CRIM/api/citation/"+this.citation, (data)=>{
      let json = JSON.parse(data)
      // check that the user in the citation is the same as this.user
      if (json.user == this.user){
        this.importData(json)
      }
      else {
        $("#loader").hide()
      }
    })
  }

  importMeiData(url){
      // Go via Omas to bypass CORS
      let omas_url = "http://mith.umd.edu/ema/"+encodeURIComponent(url)+"/all/all/@all"

      return (new Promise((res, rej)=>{
        $.get(omas_url, (data) => {
          res(data)
        }, 'text')
          .fail((msg)=>{
              console.log(msg);
              rej()
          })
      }))

  }

  importData(data) {
    $("#loader").show()
    for (let score of data.scores) {
      let s = this.scores.add(score)
      s.set("id", score.cid)
      s.cid = score.cid
      s.observations.score = score.cid

      for (let observ of data.observations){
        if (observ.score == s.cid) {
          let a = s.observations.add(observ)
          a.set("id", observ.cid)
          a.cid = observ.cid
        }
      }

      // Get mei
      this.importMeiData(s.get("url")).then((mei)=>{
        s.set("mei", mei)
        let scoreView = new ScoreView({model: s})
        this.$el.find("#create_edit .mdl-grid").append(scoreView.render())
        scoreView.renderContinuoScore()
      })

    }

    for (let rel of data.relationships) {
        let r = this.relationships.add(rel)
        r.set("id", rel.cid)
        r.cid = rel.cid
    }

  }

  doImport(){
    this.relationships.reset()
    this.scores.each((s)=>{
      s.observations.reset()
      s.trigger("close", true)
    })
    this.scores.reset()
    this.importDialog.show()
  }

  import() {
    // if a relationship exists, warn that it will be lost
    if (this.relationships.models.length > 0){
      let r = confirm("All open scores will be clsoed and unsaved relationships will be lost: continue?")
      if (r){
        this.doImport()
      }
    }
    else this.doImport()
  }

  removeRel(relid){
    let rel = this.relationships.get(relid)
    this.scores.trigger("delete_observation", rel.get("scoreAobserv"))
    this.scores.trigger("delete_observation", rel.get("scoreBobserv"))
    this.relationships.remove(relid)
  }

}

export default AppView
