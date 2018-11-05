import $ from 'jquery';
import * as Backbone from 'backbone';
import Events from '../utils/backbone-events';
import export_tpl from '../templates/export-tpl';
import dialogPolyfill from 'dialog-polyfill'
import saveAs from 'save-as';

// Converts data from the internal format into the fields of a POST request
// that can add the data directly to the Django webapp.
function internalToSerialized(internal_data) {
  function getPieceID(this_score_cid) {
    for (var score of internal_data.scores) {
      if (score.cid == this_score_cid) {
        // Remove square brackets from piece id
        return score.piece_id.replace(/[\[\]]/g, '')
      }
    }
  }
  function getVoices(voice_list) {
    var voices = '';
    for (var dict of voice_list) {
      for (var key in dict) {
        if (key.includes('voice')) {
          if (voices == '') {
            voices = dict[key];
          }
          else {
            voices += ('\n' + dict[key]);
          }
        }
      }
    }
    return voices;
  }
  function getObservationFields(this_cid) {
    var old_observation;
    var new_observation = {};
    for (var obs of internal_data.observations) {
      if (obs.cid == this_cid) {
        old_observation = obs;
      }
    }
    new_observation['piece'] = getPieceID(old_observation.score);
    if (old_observation.types['mt-cf']) {
      new_observation['mt_cf'] = true;
      new_observation['mt_cf_voices'] = getVoices(old_observation.types['mt-cf']['options']);
      new_observation['mt_cf_dur'] = old_observation.types['mt-cf']['dur'];
      new_observation['mt_cf_mel'] = old_observation.types['mt-cf']['mel'];
    }
    if (old_observation.types['mt-sog']) {
      new_observation['mt_sog'] = true;
      new_observation['mt_sog_voices'] = getVoices(old_observation.types['mt-sog']['options']);
      new_observation['mt_sog_dur'] = old_observation.types['mt-sog']['dur'];
      new_observation['mt_sog_mel'] = old_observation.types['mt-sog']['mel'];
      new_observation['mt_sog_ostinato'] = old_observation.types['mt-sog']['ost'];
      new_observation['mt_sog_periodic'] = old_observation.types['mt-sog']['per'];
    }
    if (old_observation.types['mt-csog']) {
      new_observation['mt_csog'] = true;
      new_observation['mt_csog_voices'] = getVoices(old_observation.types['mt-csog']['options']);
      new_observation['mt_csog_dur'] = old_observation.types['mt-csog']['dur'];
      new_observation['mt_csog_mel'] = old_observation.types['mt-csog']['mel'];
    }
    if (old_observation.types['mt-cd']) {
      new_observation['mt_cd'] = true;
      new_observation['mt_cd_voices'] = getVoices(old_observation.types['mt-cd']['options']);
    }
    if (old_observation.types['mt-fg']) {
      new_observation['mt_fg'] = true;
      new_observation['mt_fg_voices'] = getVoices(old_observation.types['mt-fg']['options']);
      new_observation['mt_fg_int'] = old_observation.types['mt-fg']['int'];
      new_observation['mt_fg_tint'] = old_observation.types['mt-fg']['tint'];
      new_observation['mt_fg_periodic'] = old_observation.types['mt-fg']['pe'];
      new_observation['mt_fg_strict'] = old_observation.types['mt-fg']['ste'];
      new_observation['mt_fg_flexed'] = old_observation.types['mt-fg']['fe'];
      new_observation['mt_fg_sequential'] = old_observation.types['mt-fg']['se'];
      new_observation['mt_fg_inverted'] = old_observation.types['mt-fg']['ie'];
      new_observation['mt_fg_retrograde'] = old_observation.types['mt-fg']['re'];
    }
    if (old_observation.types['mt-pe']) {
      new_observation['mt_pe'] = true;
      new_observation['mt_pe_voices'] = getVoices(old_observation.types['mt-pe']['options']);
      new_observation['mt_pe_int'] = old_observation.types['mt-pe']['int'];
      new_observation['mt_pe_tint'] = old_observation.types['mt-pe']['tint'];
      new_observation['mt_pe_strict'] = old_observation.types['mt-pe']['ste'];
      new_observation['mt_pe_flexed'] = old_observation.types['mt-pe']['fe'];
      new_observation['mt_pe_flt'] = old_observation.types['mt-pe']['fte'];
      new_observation['mt_pe_sequential'] = old_observation.types['mt-pe']['se'];
      new_observation['mt_pe_added'] = old_observation.types['mt-pe']['ae'];
      new_observation['mt_pe_invertible'] = old_observation.types['mt-pe']['ic'];
    }
    if (old_observation.types['mt-id']) {
      new_observation['mt_id'] = true;
      new_observation['mt_id_voices'] = getVoices(old_observation.types['mt-id']['options']);
      new_observation['mt_id_int'] = old_observation.types['mt-id']['int'];
      new_observation['mt_id_tint'] = old_observation.types['mt-id']['tint'];
      new_observation['mt_id_strict'] = old_observation.types['mt-id']['ste'];
      new_observation['mt_id_flexed'] = old_observation.types['mt-id']['fe'];
      new_observation['mt_id_flt'] = old_observation.types['mt-id']['fte'];
      new_observation['mt_id_invertible'] = old_observation.types['mt-id']['ic'];
    }
    if (old_observation.types['mt-nid']) {
      new_observation['mt_nid'] = true;
      new_observation['mt_nid_voices'] = getVoices(old_observation.types['mt-nid']['options']);
      new_observation['mt_nid_int'] = old_observation.types['mt-nid']['int'];
      new_observation['mt_nid_tint'] = old_observation.types['mt-nid']['tint'];
      new_observation['mt_nid_strict'] = old_observation.types['mt-nid']['ste'];
      new_observation['mt_nid_flexed'] = old_observation.types['mt-nid']['fe'];
      new_observation['mt_nid_flt'] = old_observation.types['mt-nid']['fte'];
      new_observation['mt_nid_sequential'] = old_observation.types['mt-nid']['se'];
      new_observation['mt_nid_invertible'] = old_observation.types['mt-nid']['ic'];
    }
    if (old_observation.types['mt-hr']) {
      new_observation['mt_hr'] = true;
      new_observation['mt_hr_voices'] = getVoices(old_observation.types['mt-hr']['options']);
      new_observation['mt_hr_simple'] = old_observation.types['mt-hr']['s'];
      new_observation['mt_hr_staggered'] = old_observation.types['mt-hr']['st'];
      new_observation['mt_hr_sequential'] = old_observation.types['mt-hr']['se'];
      new_observation['mt_hr_fauxbourdon'] = old_observation.types['mt-hr']['fa'];
    }
    if (old_observation.types['mt-cad']) {
      new_observation['mt_cad'] = true;
      new_observation['mt_cad_cantizans'] = old_observation.types['mt-cad']['options']['voice1'];
      new_observation['mt_cad_tenorizans'] = old_observation.types['mt-cad']['options']['voice2'];
      new_observation['mt_cad_type'] = old_observation.types['mt-cad']['options']['type'];
      new_observation['mt_cad_tone'] = old_observation.types['mt-cad']['tone'];
      new_observation['mt_cad_dtv'] = old_observation.types['mt-cad']['options']['dove_voice1'];
      new_observation['mt_cad_dti'] = old_observation.types['mt-cad']['dove'];
    }
    if (old_observation.types['mt-int']) {
      new_observation['mt_int'] = true;
      new_observation['mt_int_voices'] = getVoices(old_observation.types['mt-int']['options']);
      new_observation['mt_int_p6'] = old_observation.types['mt-int']['p6'];
      new_observation['mt_int_p3'] = old_observation.types['mt-int']['p3'];
      new_observation['mt_int_c35'] = old_observation.types['mt-int']['c35'];
      new_observation['mt_int_c83'] = old_observation.types['mt-int']['c83'];
      new_observation['mt_int_c65'] = old_observation.types['mt-int']['c65'];
    }
    if (old_observation.types['mt-fp']) {
      new_observation['mt_fp'] = true;
      new_observation['mt_fp_ir'] = old_observation.types['mt-fp']['ir'];
      new_observation['mt_fp_range'] = old_observation.types['mt-fp']['r'];
      new_observation['mt_fp_comment'] = old_observation.types['mt-fp']['text'];
    }
    if (old_observation.comment) {
      new_observation['remarks'] = old_observation.comment;
    }
    return new_observation;
  }
  var serialized_data = {};
  for (var old_relationship of internal_data.relationships) {
    var new_relationship = {};
    // There should be only one type for each relationship.
    if (old_relationship.types['rt-q']) {
      new_relationship['rt_q'] = true;
      new_relationship['rt_q_x'] = old_relationship.types['rt-q']['ex'];
      new_relationship['rt_q_monnayage'] = old_relationship.types['rt-q']['mo'];
    }
    if (old_relationship.types['rt-tm']) {
      new_relationship['rt_tm'] = true;
      new_relationship['rt_tm_snd'] = old_relationship.types['rt-tm']['snd'];
      new_relationship['rt_tm_minv'] = old_relationship.types['rt-tm']['minv'];
      new_relationship['rt_tm_retrograde'] = old_relationship.types['rt-tm']['r'];
      new_relationship['rt_tm_ms'] = old_relationship.types['rt-tm']['ms'];
      new_relationship['rt_tm_transposed'] = old_relationship.types['rt-tm']['t'];
      new_relationship['rt_tm_invertible'] = old_relationship.types['rt-tm']['td'];
    }
    if (old_relationship.types['rt-tnm']) {
      new_relationship['rt_tnm'] = true;
      new_relationship['rt_tnm_embellished'] = old_relationship.types['rt-tnm']['em'];
      new_relationship['rt_tnm_reduced'] = old_relationship.types['rt-tnm']['re'];
      new_relationship['rt_tnm_amplified'] = old_relationship.types['rt-tnm']['am'];
      new_relationship['rt_tnm_truncated'] = old_relationship.types['rt-tnm']['tr'];
      new_relationship['rt_tnm_ncs'] = old_relationship.types['rt-tnm']['ncs'];
      new_relationship['rt_tnm_ocs'] = old_relationship.types['rt-tnm']['ocs'];
      new_relationship['rt_tnm_ocst'] = old_relationship.types['rt-tnm']['ocst'];
      new_relationship['rt_tnm_nc'] = old_relationship.types['rt-tnm']['nc'];
    }
    if (old_relationship.types['rt-nm']) {
      new_relationship['rt_nm'] = true;
    }
    if (old_relationship.types['rt-om']) {
      new_relationship['rt_om'] = true;
    }
    if (old_relationship.comment) {
      new_relationship['remarks'] = old_relationship.comment;
    }
    // Create fields prefixed with `model_` or `relationship_` and add them
    // to the new relationship.
    let scoreA_observation = getObservationFields(old_relationship.scoreAobserv);
    let scoreB_observation = getObservationFields(old_relationship.scoreBobserv);
    if (old_relationship.direction == "b2a") {
      new_relationship['model_ema'] = old_relationship.scoreB_ema;
      for (let field in scoreB_observation) {
        new_relationship['model_' + field] = scoreB_observation[field];
      }
      new_relationship['derivative_ema'] = old_relationship.scoreA_ema;
      for (let field in scoreA_observation) {
        new_relationship['derivative_' + field] = scoreA_observation[field];
      }
    }
    else {
      new_relationship['model_ema'] = old_relationship.scoreA_ema;
      for (let field in scoreA_observation) {
        new_relationship['model_' + field] = scoreA_observation[field];
      }
      new_relationship['derivative_ema'] = old_relationship.scoreB_ema;
      for (let field in scoreB_observation) {
        new_relationship['derivative_' + field] = scoreB_observation[field];
      }
    }
  }
  return new_relationship;
}

// Converts serialized data into the internal representation.
function serializedToInternal(serialized_data) {
  return;
}

class Export extends Backbone.View {

  initialize (options) {
    this.container = options.container;
    this.citation = options.citation;
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
          "click #expToOmeka": this.expToOmeka
      }
  }

  expToDisk() {
    let string = JSON.stringify(this.data);
    let bb = new Blob([string], {"type":"application\/json"});
    let filename = this.data.user ? "user"+this.data.user : "anonymous";
    filename = filename + "_" + this.data.created_at + ".json";
    saveAs(bb, filename);
    Events.trigger("resetData");
    this.close();
  }

  expToOmeka() {
    var target_url;
    let processed_data = internalToSerialized(this.data);

    if (this.citation) {
      target_url = 'http://127.0.0.1:8000/data/relationship/'+this.citation;
    }
    else {
      target_url = 'http://127.0.0.1:8000/data/relationship/new/';
    }
    let r = confirm("This will send the data directly to the CRIM online database. Continue?")
    if (r) {
      $.ajax({
        url: target_url,
        type: 'POST',
        data: processed_data,
        success: () => {
          // Events.trigger("resetData");
          this.$el.find(".mdl-dialog__content p").hide();
          this.$el.find(".mdl-dialog__content strong").show();
          setTimeout(()=>{
            this.$el.find(".mdl-dialog__content p").show();
            this.$el.find(".mdl-dialog__content strong").hide();
            this.close();
          }, '1100');
        },
        error: (err) => {
          this.$el.find(".mdl-dialog__content p").html("<strong>An error occured</strong>");
          console.log(err);
        }
      });
    }
  }

  show(data) {
    this.data = data
    // it it's detached, render.
    if (this.$el.parent().length == 0) {
      this.render()
      // Assumes MDL JS
      if(!(typeof(componentHandler) == 'undefined')){
          componentHandler.upgradeAllRegistered();
      }
    }

    this.el.showModal();
  }

  close() {
    this.el.close();
  }

  render() {
    this.container.append(this.$el.html(this.template()))
    if (! this.el.showModal) {
      dialogPolyfill.registerDialog(this.el);
    }
  }

}

export default Export
