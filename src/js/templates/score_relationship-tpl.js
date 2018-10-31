import * as Handlebars from 'handlebars';

let score_relationship_tpl = `
  <h4 class="mdl-dialog__title">Score relationship</h4>
  <button class="mdl-button mdl-js-button mdl-button--raised hide_button">
    Hide
  </button>
  <h3>Observations</h3>
  <div class="mdl-dialog__content">
    <ul class="mdl-list">
      <li class="mdl-list__item" data-score="A">
        <span class="mdl-list__item-secondary-action">
          <button class="btn btn-primary show-score-observation">
            Edit observation
          </button>
        </span>
        <span class="mdl-list__item-primary-content">
          <span class="truncate truncate_short" title="{{titleA}}">{{titleA}}</span>&nbsp;<span class="truncate truncate_short" title="{{scoreA_ema}}">{{scoreA_ema}}</span>
          <span class="truncate truncate_short observ_typesA"></span>
        </span>
      </li>
      <li class="mdl-list__item" data-score="B">
        <span class="mdl-list__item-secondary-action">
          <button class="btn btn-primary show-score-observation">
            Edit observation
          </button>
        </span>
        <span class="mdl-list__item-primary-content">
          <span class="truncate truncate_short" title="{{titleB}}">{{titleB}}</span>&nbsp;<span class="truncate truncate_short" title="{{scoreB_ema}}">{{scoreB_ema}}</span>
          <span class="truncate truncate_short observ_typesB"></span>
        </span>
      </li>
    </ul>
    <h3>Direction</h3>
    <div class="direction">
      <p>
        <label class="block mdl-radio mdl-js-radio mdl-js-ripple-effect for="rel-dir-a2b">
          <input type="radio" name="rel-dir" id="rel-dir-a2b" class="inline mdl-radio__button" {{#if boolDir}}checked{{/if}} {{#unless direction}}checked{{/unless}}>
          <span class="mdl-radio__label">{{titleA}} &rarr; {{titleB}}</span>
        </label>
        <label class="block mdl-radio mdl-js-radio mdl-js-ripple-effect" for="rel-dir-b2a">
          <input type="radio" name="rel-dir" id="rel-dir-b2a" class="inline mdl-radio__button" {{#if direction}}{{#unless boolDir}}checked{{/unless}}{{/if}}>
          <span class="mdl-radio__label">{{titleB}} &rarr; {{titleA}}</span>
        </label>
      </p>
    </div>
    <h3>Relationship type</h3>
    <div class="mdl-shadow--2dp types">
      <label for="rt-q" class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
        <input type="checkbox" id="rt-q" class="mdl-checkbox__input cb" {{#if types.rt-q}}checked{{/if}}>
        <span class="mdl-checkbox__label">Quotation</span>
      </label>
      <button class="mdl-button mdl-js-button mdl-button--icon drop">
        <i class="material-icons">arrow_drop_down</i>
      </button>
      <div class="rest" style="display:none">
        <div>
          <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect for="rt-q-ex">
            <input type="radio" name="rt-q-opts" id="rt-q-ex" class="mdl-radio__button" {{#if types.rt-q.ex}}checked{{/if}} {{#unless types.rt-q}}checked disabled{{/unless}}>
            <span class="mdl-radio__label">Exact</span>
          </label>
          <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="rt-q-mo">
            <input type="radio" name="rt-q-opts" id="rt-q-mo" class="mdl-radio__button" {{#if types.rt-q.mo}}checked{{/if}} {{#unless types.rt-q}}disabled{{/unless}}>
            <span class="mdl-radio__label">Monnayage</span>
          </label>
        </div>
      </p>
    </div>
    <div class="mdl-shadow--2dp types">
      <label for="rt-tm" class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
        <input type="checkbox" id="rt-tm" class="mdl-checkbox__input cb" {{#if types.rt-tm}}checked{{/if}}>
        <span class="mdl-checkbox__label">Transformation (mechanical)</span>
      </label>
      <button class="mdl-button mdl-js-button mdl-button--icon drop">
        <i class="material-icons">arrow_drop_down</i>
      </button>
      <div class="rest" style="display:none">
        <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="rt-tm-snd">
          <input type="checkbox" id="rt-tm-snd" class="mdl-checkbox__input" {{#if types.rt-tm.snd}}checked{{/if}} {{#unless types.rt-tm}}disabled{{/unless}}>
          <span class="mdl-checkbox__label">Sounding in different voice(s) = change of voice role</span>
        </label>
        <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="rt-tm-minv">
          <input type="checkbox" id="rt-tm-minv" class="mdl-checkbox__input" {{#if types.rt-tm.minv}}checked{{/if}} {{#unless types.rt-tm}}disabled{{/unless}}>
          <span class="mdl-checkbox__label">Melodically inverted</span>
        </label>
        <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="rt-tm-r">
          <input type="checkbox" id="rt-tm-r" class="mdl-checkbox__input" {{#if types.rt-tm.r}}checked{{/if}} {{#unless types.rt-tm}}disabled{{/unless}}>
          <span class="mdl-checkbox__label">In retrograde</span>
        </label>
        <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="rt-tm-ms">
          <input type="checkbox" id="rt-tm-ms" class="mdl-checkbox__input" {{#if types.rt-tm.ms}}checked{{/if}} {{#unless types.rt-tm}}disabled{{/unless}}>
          <span class="mdl-checkbox__label">Metrically shifted (counterpoint with new time interval)</span>
        </label>
        <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="rt-tm-t">
          <input type="checkbox" id="rt-tm-t" class="mdl-checkbox__input" {{#if types.rt-tm.t}}checked{{/if}} {{#unless types.rt-tm}}disabled{{/unless}}>
          <span class="mdl-checkbox__label">Transposed</span>
        </label>
        <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="rt-tm-td">
          <input type="checkbox" id="rt-tm-td" class="mdl-checkbox__input" {{#if types.rt-tm.td}}checked{{/if}} {{#unless types.rt-tm}}disabled{{/unless}}>
          <span class="mdl-checkbox__label">Transposed different amounts (double or invertible cpt)</span>
        </label>
      </div>
    </div>
    <div class="mdl-shadow--2dp types">
      <label for="rt-tnm" class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
        <input type="checkbox" id="rt-tnm" class="mdl-checkbox__input cb" {{#if types.rt-tnm}}checked{{/if}}>
        <span class="mdl-checkbox__label">Transformation (non-mechanical)</span>
      </label>
      <button class="mdl-button mdl-js-button mdl-button--icon drop">
        <i class="material-icons">arrow_drop_down</i>
      </button>
      <div class="rest" style="display:none">
        <div>
          <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect for="rt-tnm-em">
            <input type="checkbox" id="rt-tnm-em" class="mdl-checkbox__input" {{#if types.rt-tnm.em}}checked{{/if}} {{#unless types.rt-tnm}}disabled{{/unless}}>
            <span class="mdl-checkbox__label">Embellished</span>
          </label>
          <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="rt-tm-minv">
            <input type="checkbox" id="rt-tm-minv" class="inline mdl-checkbox__input" {{#if types.rt-tm.minv}}checked{{/if}} {{#unless types.rt-tm}}disabled{{/unless}}>
            Melodically inverted
          </label>
          <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="rt-tm-r">
            <input type="checkbox" id="rt-tm-r" class="inline mdl-checkbox__input" {{#if types.rt-tm.r}}checked{{/if}} {{#unless types.rt-tm}}disabled{{/unless}}>
            Retrograde
          </label>
          <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="rt-tm-ms">
            <input type="checkbox" id="rt-tm-ms" class="inline mdl-checkbox__input" {{#if types.rt-tm.ms}}checked{{/if}} {{#unless types.rt-tm}}disabled{{/unless}}>
            Metrically shifted
          </label>
          <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="rt-tm-t">
            <input type="checkbox" id="rt-tm-t" class="inline mdl-checkbox__input" {{#if types.rt-tm.t}}checked{{/if}} {{#unless types.rt-tm}}disabled{{/unless}}>
            Transposed
          </label>
          <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="rt-tm-td">
            <input type="checkbox" id="rt-tm-td" class="inline mdl-checkbox__input" {{#if types.rt-tm.td}}checked{{/if}} {{#unless types.rt-tm}}disabled{{/unless}}>
            Double or invertible counterpoint
          </label>
        </div>
      </p>
    </div>
    <div class="mdl-shadow--2dp types">
      <p>
        <label for="rt-tnm" class="inline main-type mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
          <input type="checkbox" id="rt-tnm" class="inline mdl-checkbox__input cb" {{#if types.rt-tnm}}checked{{/if}}>
          Non-mechanical transformation
        </label>
        <a class="drop">(expand)</a>
        <div class="rest" style="display:none">
          <div>
            <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect for="rt-tnm-em">
              <input type="checkbox" id="rt-tnm-em" class="inline mdl-checkbox__input" {{#if types.rt-tnm.em}}checked{{/if}} {{#unless types.rt-tnm}}disabled{{/unless}}>
              Embellished
            </label>
            <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect for="rt-tnm-re">
              <input type="checkbox" id="rt-tnm-re" class="inline mdl-checkbox__input" {{#if types.rt-tnm.re}}checked{{/if}} {{#unless types.rt-tnm}}disabled{{/unless}}>
              Reduced
            </label>
            <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect for="rt-tnm-am">
              <input type="checkbox" id="rt-tnm-am" class="inline mdl-checkbox__input" {{#if types.rt-tnm.am}}checked{{/if}} {{#unless types.rt-tnm}}disabled{{/unless}}>
              Amplified
            </label>
            <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect for="rt-tnm-tr">
              <input type="checkbox" id="rt-tnm-tr" class="inline mdl-checkbox__input" {{#if types.rt-tnm.tr}}checked{{/if}} {{#unless types.rt-tnm}}disabled{{/unless}}>
              Truncated
            </label>
            <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect for="rt-tnm-ncs">
              <input type="checkbox" id="rt-tnm-ncs" class="inline mdl-checkbox__input" {{#if types.rt-tnm.ncs}}checked{{/if}} {{#unless types.rt-tnm}}disabled{{/unless}}>
              New counter-subject
            </label>
            <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect for="rt-tnm-ocs">
              <input type="checkbox" id="rt-tnm-ocs" class="inline mdl-checkbox__input" {{#if types.rt-tnm.ocs}}checked{{/if}} {{#unless types.rt-tnm}}disabled{{/unless}}>
              Old counter-subject shifted
            </label>
            <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect for="rt-tnm-ocst">
              <input type="checkbox" id="rt-tnm-ocst" class="inline mdl-checkbox__input" {{#if types.rt-tnm.ocst}}checked{{/if}} {{#unless types.rt-tnm}}disabled{{/unless}}>
              Old counter-subject transposed
            </label>
            <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect for="rt-tnm-nc">
              <input type="checkbox" id="rt-tnm-nc" class="inline mdl-checkbox__input" {{#if types.rt-tnm.nc}}checked{{/if}} {{#unless types.rt-tnm}}disabled{{/unless}}>
              New combination
            </label>
          </p>
        </div>
      </div>
    </div>
    <div class="mdl-shadow--2dp types">
      <p>
        <label for="rt-nm" class="block main-type mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
          <input type="checkbox" id="rt-nm" class="inline mdl-checkbox__input cb" {{#if types.rt-nm}}checked{{/if}}>
          New material
        </label>
      </p>
    </div>
    <div class="mdl-shadow--2dp types">
      <p>
        <label for="rt-om" class="block main-type mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
          <input type="checkbox" id="rt-om" class="inline mdl-checkbox__input cb" {{#if types.rt-om}}checked{{/if}}>
          Omission
        </label>
      </p>
    </div>
    <h3>Remarks</h3>
    <div class="mdl-textfield mdl-js-textfield">
      <label class="mdl-textfield__label" for="rel-comment"></label>
      <textarea class="mdl-textfield__input" type="text" rows="5" style="width: 80%;" id="rel-comment">{{#if comment}}{{comment}}{{/if}}</textarea>
    </div>
    <div class="messages mdl-shadow--2dp"></div>
  </div>
  <div class="mdl-dialog__actions">
    <button type="button" class="mdl-button mdl-button--accent" id="save_score_relationship">Save</button>
    <button type="button" class="mdl-button close" id="cancel_score_relationship">Cancel</button>
  </div>
  <div class="score_preview_cnt mdl-shadow--2dp" style="display:none">
    <div class="score_preview"></div>
    <i class="material-icons score_preview_close">close</i>
  </div>
`

export default Handlebars.compile(score_relationship_tpl);
