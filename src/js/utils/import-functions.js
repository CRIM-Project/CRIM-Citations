export var OMAS = "https://ema.crimproject.org/";

export function voicesFromMei(mei) {
  var parsed_mei = $.parseXML(mei);
  var $mei = $(parsed_mei);
  $mei.find("scoreDef, mei\\:scoreDef").first().find("staffDef, mei\\:staffDef").each((i, sd)=>{
    var $sd = $(sd);
    var voices = [];
    var label = $sd.attr("label");
    if (label) {
      voices.push(label);
    }
    else {
      let staffGrp = $sd.parent("staffGrp, mei\\:staffGrp");
      if (staffGrp) {
        let pos = $sd.index()+1;
        voices.push($(staffGrp).attr("label") + " (" + pos + ")");
      }
    }
    return voices;
  })
}

export function printComposers(piece) {
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
  return "Composer: " + printed_role_list.join(", ");
}

export function getVoicesList(voices_string, first_voice_name) {
  var voice_list = voices_string.split("\n");
  var options = []
  if ($.isEmptyObject(voice_list)) {
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

export function getVoicePairsList(voices_string) {
  var voice_list = voices_string.split("\n");
  var options = [];
  if ($.isEmptyObject(voice_list)) {
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
  if (!new_observation["types"]) {
    new_observation["types"] = {};
  }
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
export function serializedToInternal(serialized_data) {
  var relationship = {};
  var observationA = {};
  var observationB = {};
  var observations = [];
  var scoreA = {};
  var scoreB = {};

  var relationship_cid = "c_R"+serialized_data["id"];
  var scoreA_cid = "c_"+serialized_data["model_observation"]["piece"]["piece_id"];
  var scoreA_ema = serialized_data["model_observation"]["ema"];
  var scoreA_url = serialized_data["model_observation"]["piece"]["mei_links"][0];
  var scoreB_cid = "c_"+serialized_data["derivative_observation"]["piece"]["piece_id"];
  var scoreB_ema = serialized_data["derivative_observation"]["ema"];
  var scoreB_url = serialized_data["derivative_observation"]["piece"]["mei_links"][0];
  var scoreA_title, scoreB_title;
  if (serialized_data["model_observation"]["piece"]["mass"]) {
    scoreA_title = serialized_data["model_observation"]["piece"]["mass"]["title"]+": "+serialized_data["model_observation"]["piece"]["title"];
  }
  else {
    scoreA_title = serialized_data["model_observation"]["piece"]["title"];
  }
  if (serialized_data["derivative_observation"]["piece"]["mass"]) {
    scoreB_title = serialized_data["derivative_observation"]["piece"]["mass"]["title"]+": "+serialized_data["derivative_observation"]["piece"]["title"];
  }
  else {
    scoreB_title = serialized_data["derivative_observation"]["piece"]["title"];
  }
  var scoreAobserv_cid = "c_"+serialized_data["model_observation"]["id"];
  var scoreBobserv_cid = "c_"+serialized_data["derivative_observation"]["id"];

  var scoreA_emaurl = OMAS+encodeURIComponent(scoreA_url)+"/"+scoreA_ema+"/highlight";
  var scoreB_emaurl = OMAS+encodeURIComponent(scoreB_url)+"/"+scoreB_ema+"/highlight";

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
  relationship["scoreA_meiids"] = [];
  $.get(scoreA_emaurl, (data)=>{
    for (let id of data.querySelector("annot[type='ema_highlight']").getAttribute('plist').split(' ')) {
      relationship["scoreA_meiids"].push(id.replace('#', ''));
    }
  });
  relationship["titleA"] = scoreA_title;
  relationship["scoreB"] = scoreB_cid;
  relationship["scoreB_ema"] = scoreB_ema;
  relationship["scoreB_meiids"] = [];
  $.get(scoreB_emaurl, (data)=>{
    for (let id of data.querySelector("annot[type='ema_highlight']").getAttribute('plist').split(' ')) {
      relationship["scoreB_meiids"].push(id.replace('#', ''));
    }
  });
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
  if (!$.isEmptyObject(observationA)) {
    observationA["ema"] = scoreA_ema;
    observationA["title"] = scoreA_title;
    observationA["mei_ids"] = [];
    $.get(scoreA_emaurl, (data)=>{
      for (let id of data.querySelector("annot[type='ema_highlight']").getAttribute('plist').split(' ')) {
        observationA["mei_ids"].push(id.replace('#', ''));
      }
    });
    observationA["cid"] = scoreAobserv_cid;
    observationA["score"] = scoreA_cid;
    observations.push(observationA);
  }
  if (!$.isEmptyObject(observationB)) {
    observationB["ema"] = scoreB_ema;
    observationB["title"] = scoreB_title;
    observationB["mei_ids"] = [];
    $.get(scoreB_emaurl, (data)=>{
      for (let id of data.querySelector("annot[type='ema_highlight']").getAttribute('plist').split(' ')) {
        observationB["mei_ids"].push(id.replace('#', ''));
      }
    });
    observationB["cid"] = scoreBobserv_cid;
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

// Converts data from the internal format into the fields of a POST request
// that can add the data directly to the Django webapp.
export function internalToSerialized(internal_data) {
  var all_relationships = [];
  // Subfunctions for helping conversion process.
  function getPieceID(this_score_cid) {
    for (var score of internal_data.scores) {
      if (score.cid == this_score_cid) {
        return score.piece_id
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
  function getObservationFields(observation_cid, score_cid) {
    var old_observation = null;
    var new_observation = {};
    for (var obs of internal_data.observations) {
      if (obs.cid == observation_cid) {
        old_observation = obs;
      }
    }
    // If no observation type was selected, it may be that there is no
    // observation object in the original; in such a case, all the information
    // we have is the piece, which we can get from the relationship's score.
    if (old_observation === null) {
      new_observation['piece'] = getPieceID(score_cid);
    }
    else {
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
    }
    return new_observation;
  }
  // Beginning of conversion process.
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
    let scoreA_observation = getObservationFields(old_relationship.scoreAobserv, old_relationship.scoreA);
    let scoreB_observation = getObservationFields(old_relationship.scoreBobserv, old_relationship.scoreB);
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
    all_relationships.push(new_relationship);
  }
  return all_relationships;
}
