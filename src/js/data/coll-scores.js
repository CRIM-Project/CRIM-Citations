import * as Backbone from 'backbone';
import Score from './model-score.js';

class Scores extends Backbone.Collection {
    constructor() {
        super();
        this.model = Score;
    }

    exportObservations(){
      return this.models.reduce((acc, score)=>{
        acc = acc.concat(score.observations.toJSON())
        return acc
      }, [])
    }

    export(){
      return this.models.reduce((acc, score)=>{
        acc.push(score.export())
        return acc
      }, [])
    }

}

export default Scores;
