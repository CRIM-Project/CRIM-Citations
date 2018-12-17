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
import printComposers from './addFile';
import getParameterByName from '../utils/paras';
import voicesFromMei from '../data/model-score';


var OMAS = "https://ema.crimproject.org/";


function getMeiIds(url, ema) {
  return $.get(OMAS+encodeURIComponent(url)+"/"+ema+"/highlight", (data)=>{
    let parser = new window.DOMParser();
    let meiDoc = parser.parseFromString(data, 'text/xml');
    return meiDoc.querySelector("annot[type='ema_highlight']").getAttribute('plist').split(' ');
  });
}

function getVoicesList(voices_string, first_voice_name) {
  var voice_list = voices_string.split("\n");
  var options = []
  if ($.IsEmptyObject(voice_list)) {
    return options;
  }
  // First add the first voice with its special name;
  // then add the other voices
  let first_voice = {};
  first_voice[first_voice_name] = voice_list[0]
  options.push(first_voice);
  for (let i=1, size=voice_list.length; i<size; i++) {
    let new_voice = {};
    new_voice["voice"+String(i+1)] = voice_list[i];
    options.push(new_voice);
  }
  return options;
}

function getVoicePairsList(voices_string) {
  var voice_list = voices_string.split("\n");
  var options = [];
  if ($.IsEmptyObject(voice_list)) {
    return options;
  }
  for (let i=0,size=voice_list.length; i<size; i=i+2) {
    let new_voice_pair = {};
    new_voice_pair["voice"+String(i+1)] = voice_list[i];
    new_voice_pair["voice"+String(i+2)] = voice_list[i+1];
    options.push(new_voice_pair);
  }
  return options;
}

function addObservationFields(serialized_observation, new_observation) {
  if (serialized_observation["mt_cf"]) {
    new_observation["types"]["mt-cf"] = {
      "label": "Cantus firmus",
      "dur": serialized_observation["mt_cf_dur"],
      "mel": serialized_observation["mt_cf_mel"],
      "options": getVoicesList(serialized_observation["mt_cf_voices"], "voice"),
      "isSelect": true
    }
  }
  if (serialized_observation["mt_sog"]) {
    new_observation["types"]["mt-sog"] = {
			"label": "Soggetto",
			"dur": serialized_observation["mt_sog_dur"],
			"mel": serialized_observation["mt_sog_mel"],
			"ost": serialized_observation["mt_sog_ostinato"],
			"per": serialized_observation["mt_sog_periodic"],
			"options": getVoicesList(serialized_observation["mt_sog_voices"], "voice1"),
			"isSelect": true
		}
  }
  if (serialized_observation["mt_csog"]) {
    new_observation["types"]["mt-csog"] = {
			"label": "Counter-soggetto",
			"dur": serialized_observation["mt_csog_dur"],
			"mel": serialized_observation["mt_csog_mel"],
			"options": getVoicesList(serialized_observation["mt_csog_voices"], "voice"),
			"isSelect": true
		}
  }
  if (serialized_observation["mt_cd"]) {
    new_observation["types"]["mt-cd"] = {
			"label": "Contrapuntal duo",
			"options": getVoicePairsList(serialized_observation["mt_cd_voices"]),
			"isSelect": true
		}
  }
  if (serialized_observation["mt_fg"]) {
    new_observation["types"]["mt-fg"] = {
			"label": "Fuga",
			"int": serialized_observation["mt_fg_int"],
			"tint": serialized_observation["mt_fg_tint"],
			"pe": serialized_observation["mt_fg_periodic"],
			"ste": serialized_observation["mt_fg_strict"],
			"fe": serialized_observation["mt_fg_flexed"],
			"se": serialized_observation["mt_fg_sequential"],
			"ie": serialized_observation["mt_fg_inverted"],
			"re": serialized_observation["mt_fg_retrograde"],
			"options": getVoicesList(serialized_observation["mt_fg_voices"], "voice1"),
			"isSelect": true
		}
  }
  if (serialized_observation["mt_pe"]) {
    new_observation["types"]["mt-pe"] = {
			"label": "Periodic entry",
			"int": serialized_observation["mt_pe_int"],
			"tint": serialized_observation["mt_pe_tint"],
			"ste": serialized_observation["mt_pe_strict"],
			"fe": serialized_observation["mt_pe_flexed"],
			"fte": serialized_observation["mt_pe_flt"],
			"se": serialized_observation["mt_pe_sequential"],
			"ae": serialized_observation["mt_pe_added"],
			"ic": serialized_observation["mt_pe_invertible"],
			"options": getVoicesList(serialized_observation["mt_pe_voices"], "voice1"),
			"isSelect": true
		}
  }
  if (serialized_observation["mt_id"]) {
    new_observation["types"]["mt-id"] = {
			"label": "Imitative duo",
			"int": serialized_observation["mt_id_int"],
			"tint": serialized_observation["mt_id_tint"],
			"ste": serialized_observation["mt_id_strict"],
			"fe": serialized_observation["mt_id_flexed"],
			"fte": serialized_observation["mt_id_flt"],
			"ic": serialized_observation["mt_id_invertible"],
			"options": getVoicePairsList(serialized_observation["mt_id_voices"]),
			"isSelect": true
		}
  }
  if (serialized_observation["mt_nid"]) {
    new_observation["types"]["mt-nid"] = {
			"label": "Non-imitative duo",
			"int": serialized_observation["mt_nid_int"],
			"tint": serialized_observation["mt_nid_tint"],
			"ste": serialized_observation["mt_nid_strict"],
			"fe": serialized_observation["mt_nid_flexed"],
			"fte": serialized_observation["mt_nid_flt"],
			"se": serialized_observation["mt_nid_sequential"],
			"ic": serialized_observation["mt_nid_invertible"],
			"options": getVoicePairsList(serialized_observation["mt_nid_voices"]),
			"isSelect": true
		}
  }
  if (serialized_observation["mt_hr"]) {
    new_observation["types"]["mt-hr"] = {
			"label": "Homorhythm",
			"s": serialized_observation["mt_hr_simple"],
			"st": serialized_observation["mt_hr_staggered"],
			"se": serialized_observation["mt_hr_sequential"],
			"fa": serialized_observation["mt_hr_fauxbourdon"],
			"options": getVoicesList(serialized_observation["mt_hr_voices"], "voice1"),
			"isSelect": true
		}
  }
  if (serialized_observation["mt_cad"]) {
    new_observation["types"]["mt-cad"] = {
			"label": "Cadence",
			"tone": serialized_observation["mt_cad_tone"],
			"dove": serialized_observation["mt_cad_dti"],
			"options": [{
				"voice1": serialized_observation["mt_cad_cantizans"]
			}, {
				"voice2": serialized_observation["mt_cad_tenorizans"]
			}, {
				"type": serialized_observation["mt_cad_type"]
			}, {
				"dove_voice1": serialized_observation["mt_cad_dtv"]
			}],
			"isSelect": true
		}
  }
  if (serialized_observation["mt_int"]) {
    new_observation["types"]["mt-int"] = {
			"label": "Interval pattern",
			"p6": serialized_observation["mt_int_p6"],
			"p3": serialized_observation["mt_int_p3"],
			"c35": serialized_observation["mt_int_c35"],
			"c83": serialized_observation["mt_int_c83"],
			"c65": serialized_observation["mt_int_c65"],
			"options": getVoicePairsList(serialized_observation["mt_int_voices"]),
			"isSelect": true
		}
  }
  if (serialized_observation["mt_fp"]) {
    new_observation["types"]["mt-fp"] = {
			"label": "Form and process",
			"ir": serialized_observation["mt_fp_ir"],
			"r": serialized_observation["mt_fp_range"],
			"text": serialized_observation["mt_fp_comment"],
			"options": []
		}
  }
  // Add the observation comment, if it is not blank.
  if (serialized_observation["remarks"].length) {
    new_observation["comment"] = serialized_observation["remarks"];
  }
  return new_observation;
}

// Converts data from the Django JSON format for relationships to the internal
// format required by the Citations JavaScript app.
function serializedToInternal(serialized_data) {
  var relationship = {};
  var observationA = {};
  var observationB = {};
  var observations = [];
  var scoreA = {};
  var scoreB = {};

  var relationship_cid = "c_R"+serialized_data["id"];
  var scoreA_cid = "c_"+serialized_data["model_observation"]["piece"]["piece_id"];
  var scoreA_ema = serialized_data["model_observation"]["ema"];
  var scoreA_url = serialized_data["model_observation"]["piece"]["url"];
  var scoreB_cid = "c_"+serialized_data["derivative_observation"]["piece"]["piece_id"];
  var scoreB_ema = serialized_data["derivative_observation"]["ema"];
  var scoreB_url = serialized_data["derivative_observation"]["piece"]["url"];
  if (serialized_data["model_observation"]["piece"]["mass"]) {
    var scoreA_title = serialized_data["model_observation"]["piece"]["mass"]["title"]+": "+serialized_data["model_observation"]["piece"]["title"];
  }
  else {
    var scoreA_title = serialized_data["model_observation"]["piece"]["title"];
  }
  if (serialized_data["derivative_observation"]["piece"]["mass"]) {
    var scoreB_title = serialized_data["derivative_observation"]["piece"]["mass"]["title"]+": "+serialized_data["derivative_observation"]["piece"]["title"];
  }
  else {
    var scoreB_title = serialized_data["derivative_observation"]["piece"]["title"];
  }
  var scoreAobserv_cid = "c_"+serialized_data["model_observation"]["id"];
  var scoreBobserv_cid = "c_"+serialized_data["derivative_observation"]["id"];

  relationship["types"] = {}
  if (serialized_data["rt_q"]) {
    relationship["types"]["rt-q"] = {
			"label": "Quotation",
			"ex": Boolean(serialized_data["rt_q_x"]),
			"mo": Boolean(serialized_data["rt_q_monnayage"])
  	};
  }
  if (serialized_data['rt_tm']) {
    relationship["types"]["rt-tm"] = {
			"label": "Mechanical transformation",
			"snd": Boolean(serialized_data["rt_tm_snd"]),
			"minv": Boolean(serialized_data["rt_tm_minv"]),
			"r": Boolean(serialized_data["rt_tm_retrograde"]),
			"ms": Boolean(serialized_data["rt_tm_ms"]),
			"t": Boolean(serialized_data["rt_tm_transposed"]),
			"td": Boolean(serialized_data["rt_tm_invertible"])
		};
  }
  if (serialized_data['rt_tnm']) {
    relationship["types"]["rt-tnm"] = {
			"label": "Non-mechanical transformation",
			"em": Boolean(serialized_data["rt_tnm_embellished"]),
			"re": Boolean(serialized_data["rt_tnm_reduced"]),
			"am": Boolean(serialized_data["rt_tnm_amplified"]),
			"tr": Boolean(serialized_data["rt_tnm_truncated"]),
			"ncs": Boolean(serialized_data["rt_tnm_ncs"]),
			"ocs": Boolean(serialized_data["rt_tnm_ocs"]),
			"ocst": Boolean(serialized_data["rt_tnm_ocst"]),
			"nc": Boolean(serialized_data["rt_tnm_nc"])
		};
  }
  if (serialized_data['rt_nm']) {
    relationship["types"]["rt-nm"] = {
			"label": "New material"
		};
  }
  if (serialized_data['rt_om']) {
    relationship["types"]["rt-om"] = {
			"label": "Omission"
		};
  }

  relationship["scoreA"] = scoreA_cid;
  relationship["scoreA_ema"] = scoreA_ema;
  relationship["scoreA_meiids"] = getMeiIds(scoreA_url, scoreA_ema);
  relationship["titleA"] = scoreA_title;
  relationship["scoreB"] = scoreB_cid;
  relationship["scoreB_ema"] = scoreB_ema;
  relationship["scoreB_meiids"] = getMeiIds(scoreB_url, scoreB_ema);
  relationship["titleB"] = scoreB_title;
  relationship["direction"] = "a2b";
  relationship["comment"] = serialized_data["remarks"];
  relationship["cid"] = relationship_cid;
  relationship["boolDir"] = true;
  relationship["id"] = relationship_cid;
  relationship["scoreAobserv"] = scoreAobserv_cid;
  relationship["scoreBobserv"] = scoreBobserv_cid;

  scoreA["url"] = scoreA_url;
  scoreA["title"] = scoreA_title;
  scoreA["piece_id"] = serialized_data["model_observation"]["piece"]["piece_id"];
  scoreA["composer"] = printComposers(serialized_data["model_observation"]["piece"]);
  $.get(scoreA_url, (scoreA_mei)=>{
    scoreA["voices"] = voicesFromMei(scoreA_mei);
  });
  scoreA["cid"] = scoreA_cid;
  scoreA["id"] = scoreA_cid;

  scoreB["url"] = scoreB_url;
  scoreB["title"] = scoreB_title;
  scoreB["piece_id"] = serialized_data["derivative_observation"]["piece"]["piece_id"];
  scoreB["composer"] = printComposers(serialized_data["derivative_observation"]["piece"]);
  $.get(scoreB_url, (scoreB_mei)=>{
    scoreB["voices"] = voicesFromMei(scoreB_mei);
  });
  scoreB["cid"] = scoreB_cid;
  scoreB["id"] = scoreB_cid;

  addObservationFields(serialized_data["model_observation"], observationA);
  addObservationFields(serialized_data["derivative_observation"], observationB);

  // Only fill out the observation if it is not empty, i.e. it has
  // a musical type and/or remarks; then add to `observations` list.
  if (!$.IsEmptyObject(observationA)) {
    observationA["ema"] = scoreA_ema;
    observationA["title"] = scoreA_title;
    observationA["mei_ids"] = scoreA_meiids;
    observationA["cid"] = observationA_cid;
    observationA["score"] = scoreA_cid;
    observations.push(observationA);
  }
  if (!$.IsEmptyObject(observationB)) {
    observationB["ema"] = scoreB_ema;
    observationB["title"] = scoreB_title;
    observationB["mei_ids"] = scoreB_meiids;
    observationB["cid"] = observationB_cid;
    observationB["score"] = scoreB_cid;
    observations.push(observationB);
  }

  // observations might have 0, 1, or 2 depending on how many are empty.
  var internal = {
    'relationships': [relationship],
    'scores': [scoreA, scoreB],
    'observations': observations
  }
  return internal;
}


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
    this.listenTo(this.scores, "change", this.hasDoubleSelection)

    this.listenTo(Events, "request:selections", ()=>{Events.trigger("response:selections", this.requestSelections())})
    this.listenTo(Events, "request:relationshipsFor", (score)=>{Events.trigger("response:relationships", this.requestRelationshipsFor(score))})

    this.listenTo(Events, "startHideMode", this.startHideMode)
    this.listenTo(Events, "stopHideMode", this.stopHideMode)

    this.listenTo(Events, "import", this.importData)
    this.listenTo(Events, "resetData", this.resetData)

    this.user = getParameterByName("userId") ? getParameterByName("userId") : getParameterByName("userid")
    // If we are editing a specific relationship, load it right away
    var relationship_id = document.getElementById("main-citations").getAttribute("data-relationship");
    if (relationship_id) {
      this.importFromCrim(relationship_id);
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
      piece_id = fileInfo.piece_id;
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
    this.scores.trigger("disableButtons");
    this.$el.find(".crim_header").prepend(this.hideModeComponent.render());
    // this.scores.trigger("restoreSelections");
  }

  stopHideMode() {
    this.scores.trigger("renableButtons");
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

  hasDoubleSelection(changed_score) {
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
      this.$el.find("#import_btn").show();
      this.$el.find("#export_btn").hide();
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

  importFromCrim(relationship_id) {
    $("#loader").show();
    $.get("https://dev.crimproject.org/data/relationships/"+String(relationship_id)+"/", (data)=>{
        let crim_json = JSON.parse(data);
        let citations_json = serializedToInternal(crim_json);
        this.importData(citations_json);
      }, 'text')
  }

  importMeiData(url) {
    // Go via Omas to bypass CORS
    let omas_url = OMAS+encodeURIComponent(url)+"/all/all/@all";

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
    this.relationships.reset();
    this.scores.each((s)=>{
      s.observations.reset();
      s.trigger("close", true);
    })
    this.scores.reset();
    this.importDialog.show();
  }

  import() {
    // if a relationship exists, warn that it will be lost
    if (this.relationships.models.length > 0 || this.scores.models.length > 0) {
      let r = confirm("All open scores will be closed and unsaved relationships will be lost. Continue?");
      if (r) {
        this.doImport();
      }
    }
    else {
      this.doImport();
    }
  }

  removeRel(relid){
    let rel = this.relationships.get(relid)
    this.scores.trigger("delete_observation", rel.get("scoreAobserv"))
    this.scores.trigger("delete_observation", rel.get("scoreBobserv"))
    this.relationships.remove(relid)
  }

}

export default AppView
