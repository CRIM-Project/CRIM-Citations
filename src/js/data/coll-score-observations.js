import * as Backbone from 'backbone';
import ScoreObservation from './model-score-observation.js';

class ScoreObservations extends Backbone.Collection {
    constructor() {
        super();
        this.model = ScoreObservation;
    }

}

export default ScoreObservations;
