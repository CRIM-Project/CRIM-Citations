import * as Backbone from 'backbone';
import $ from 'jquery';
import ScoreObservations from './coll-score-observations'

class Score extends Backbone.Model {
  initialize() {
      this.observations = new ScoreObservations
      this.observations.score = this.cid
      if (!this.get("voices")){
        this.storeVoices()
      }
  }

  toJSON() {
    var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
    json.cid = this.cid;
    return json;
  }

  export() {
    var json = this.toJSON()
    delete json.mei;
    delete json.hasSelection;
    delete json.mei_ids;
    delete json.ema;
    return json;
  }

  newObservation() {
    let new_observ = this.observations.add({})
    this.trigger("new_observation", new_observ.cid)
    return new_observ
  }

  storeVoices(){
    let $mei = $(this.get("mei"))
    this.set("voices", [])
    $mei.find("scoreDef, mei\\:scoreDef").first().find("staffDef, mei\\:staffDef").each((i, sd)=>{
      let $sd = $(sd)
      let voices = this.get("voices")
      let label = $sd.attr("label")
      if (label) {
        voices.push(label)
      }
      else {
        let staffGrp = $sd.parent("staffGrp, mei\\:staffGrp")
        if (staffGrp) {
          let pos = $sd.index()+1
          voices.push($(staffGrp).attr("label") + " (" + pos + ")")
        }
      }
      this.set("voices", voices)
    })
  }

}

export default Score;
