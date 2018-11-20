import * as Handlebars from 'handlebars';

let score_relationship_tpl = `
  <h2 class="mdl-dialog__title">Editing relationship</h2>
  <button class="btn btn-warning mdl-button mdl-js-button mdl-button--raised hide_button">
    Edit selection
  </button>
  <h3>Observations</h3>
  <div class="mdl-dialog__content">
    <ul class="mdl-list">
      <li class="mdl-list__item" data-score="A">
        <span class="mdl-list__item-primary-content">
          <span title="{{titleA}}">{{titleA}}</span>
          <span class="observ_typesA"></span>
          <span class="ema truncate scoreA_ema" title="{{scoreA_ema}}">{{scoreA_ema}}</span>
        </span>
        <span class="mdl-list__item-secondary-action">
          <button class="btn btn-primary show-score-observation">
            Edit observation
          </button>
        </span>
      </li>
      <li class="mdl-list__item" data-score="B">
        <span class="mdl-list__item-primary-content">
          <span title="{{titleB}}">{{titleB}}</span>
          <span class="observ_typesB"></span>
          <span class="ema truncate scoreB_ema" title="{{scoreB_ema}}">{{scoreB_ema}}</span>
        </span>
        <span class="mdl-list__item-secondary-action">
          <button class="btn btn-primary show-score-observation">
            Edit observation
          </button>
        </span>
      </li>
    </ul>
    <h3>Direction</h3>
    <div class="direction">
      <label class="block mdl-radio mdl-js-radio" for="rel-dir-a2b">
        <input type="radio" name="rel-dir" id="rel-dir-a2b" class="inline mdl-radio__button" {{#if boolDir}}checked{{/if}} {{#unless direction}}checked{{/unless}}>
        <span class="mdl-radio__label">{{titleA}} &rarr; {{titleB}}</span>
      </label>
      <label class="block mdl-radio mdl-js-radio" for="rel-dir-b2a">
        <input type="radio" name="rel-dir" id="rel-dir-b2a" class="inline mdl-radio__button" {{#if direction}}{{#unless boolDir}}checked{{/unless}}{{/if}}>
        <span class="mdl-radio__label">{{titleB}} &rarr; {{titleA}}</span>
      </label>
    </div>
    <h3>Relationship type</h3>
    <div class="mdl-shadow--2dp types">
      <label for="rt-q" class="inline main-type mdl-radio mdl-js-radio">
        <input type="radio" name="relationship-type" id="rt-q" class="inline mdl-radio__input cb" {{#if types.rt-q}}checked{{/if}}>
        <span class="mdl-radio__label">Quotation</span>
      </label>
      <a class="drop">
        <span class="expand">(Expand)</span>
        <span class="collapse" style="display:none;">(Collapse)</span>
      </a>
      <div class="rest" style="display:none">
        <label class="block mdl-radio mdl-js-radio" for="rt-q-ex">
          <input type="radio" name="rt-q-opts" id="rt-q-ex" class="inline mdl-radio__button" {{#if types.rt-q.ex}}checked{{/if}} {{#unless types.rt-q}}checked disabled{{/unless}}>
          <span class="mdl-radio__label">Exact</span>
        </label>
        <label class="block mdl-radio mdl-js-radio" for="rt-q-mo">
          <input type="radio" name="rt-q-opts" id="rt-q-mo" class="inline mdl-radio__button" {{#if types.rt-q.mo}}checked{{/if}} {{#unless types.rt-q}}disabled{{/unless}}>
          <span class="mdl-radio__label">Monnayage</span>
        </label>
      </div>
    </div>
    <div class="mdl-shadow--2dp types">
      <label for="rt-tm" class="inline main-type mdl-radio mdl-js-radio">
        <input type="radio" name="relationship-type" id="rt-tm" class="inline mdl-radio__input cb" {{#if types.rt-tm}}checked{{/if}}>
        <span class="mdl-radio__label">Mechanical transformation</span>
      </label>
      <a class="drop">
        <span class="expand">(Expand)</span>
        <span class="collapse" style="display:none;">(Collapse)</span>
      </a>
      <div class="rest" style="display:none">
        <label class="block mdl-checkbox mdl-js-checkbox" for="rt-tm-snd">
          <input type="checkbox" id="rt-tm-snd" class="inline mdl-checkbox__input" {{#if types.rt-tm.snd}}checked{{/if}} {{#unless types.rt-tm}}disabled{{/unless}}>
          <span class="mdl-checkbox__label">Sounding in different voice(s)</span>
        </label>
        <label class="block mdl-checkbox mdl-js-checkbox" for="rt-tm-minv">
          <input type="checkbox" id="rt-tm-minv" class="inline mdl-checkbox__input" {{#if types.rt-tm.minv}}checked{{/if}} {{#unless types.rt-tm}}disabled{{/unless}}>
          <span class="mdl-checkbox__label">Melodically inverted</span>
        </label>
        <label class="block mdl-checkbox mdl-js-checkbox" for="rt-tm-r">
          <input type="checkbox" id="rt-tm-r" class="inline mdl-checkbox__input" {{#if types.rt-tm.r}}checked{{/if}} {{#unless types.rt-tm}}disabled{{/unless}}>
          <span class="mdl-checkbox__label">Retrograde</span>
        </label>
        <label class="block mdl-checkbox mdl-js-checkbox" for="rt-tm-ms">
          <input type="checkbox" id="rt-tm-ms" class="inline mdl-checkbox__input" {{#if types.rt-tm.ms}}checked{{/if}} {{#unless types.rt-tm}}disabled{{/unless}}>
          <span class="mdl-checkbox__label">Metrically shifted</span>
        </label>
        <label class="block mdl-checkbox mdl-js-checkbox" for="rt-tm-t">
          <input type="checkbox" id="rt-tm-t" class="inline mdl-checkbox__input" {{#if types.rt-tm.t}}checked{{/if}} {{#unless types.rt-tm}}disabled{{/unless}}>
          <span class="mdl-checkbox__label">Transposed</span>
        </label>
        <label class="block mdl-checkbox mdl-js-checkbox" for="rt-tm-td">
          <input type="checkbox" id="rt-tm-td" class="inline mdl-checkbox__input" {{#if types.rt-tm.td}}checked{{/if}} {{#unless types.rt-tm}}disabled{{/unless}}>
          <span class="mdl-checkbox__label">Double or invertible counterpoint</span>
        </label>
      </div>
    </div>
    <div class="mdl-shadow--2dp types">
      <label for="rt-tnm" class="inline main-type mdl-radio mdl-js-radio">
        <input type="radio" name="relationship-type" id="rt-tnm" class="inline mdl-radio__input cb" {{#if types.rt-tnm}}checked{{/if}}>
        <span class="mdl-radio__label">Non-mechanical transformation</span>
      </label>
      <a class="drop">
        <span class="expand">(Expand)</span>
        <span class="collapse" style="display:none;">(Collapse)</span>
      </a>
      <div class="rest" style="display:none">
        <div>
          <label class="block mdl-checkbox mdl-js-checkbox" for="rt-tnm-em">
            <input type="checkbox" id="rt-tnm-em" class="inline mdl-checkbox__input" {{#if types.rt-tnm.em}}checked{{/if}} {{#unless types.rt-tnm}}disabled{{/unless}}>
            <span class="mdl-checkbox__label">Embellished</span>
          </label>
          <label class="block mdl-checkbox mdl-js-checkbox" for="rt-tnm-re">
            <input type="checkbox" id="rt-tnm-re" class="inline mdl-checkbox__input" {{#if types.rt-tnm.re}}checked{{/if}} {{#unless types.rt-tnm}}disabled{{/unless}}>
            <span class="mdl-checkbox__label">Reduced</span>
          </label>
          <label class="block mdl-checkbox mdl-js-checkbox" for="rt-tnm-am">
            <input type="checkbox" id="rt-tnm-am" class="inline mdl-checkbox__input" {{#if types.rt-tnm.am}}checked{{/if}} {{#unless types.rt-tnm}}disabled{{/unless}}>
            <span class="mdl-checkbox__label">Amplified</span>
          </label>
          <label class="block mdl-checkbox mdl-js-checkbox" for="rt-tnm-tr">
            <input type="checkbox" id="rt-tnm-tr" class="inline mdl-checkbox__input" {{#if types.rt-tnm.tr}}checked{{/if}} {{#unless types.rt-tnm}}disabled{{/unless}}>
            <span class="mdl-checkbox__label">Truncated</span>
          </label>
          <label class="block mdl-checkbox mdl-js-checkbox" for="rt-tnm-ncs">
            <input type="checkbox" id="rt-tnm-ncs" class="inline mdl-checkbox__input" {{#if types.rt-tnm.ncs}}checked{{/if}} {{#unless types.rt-tnm}}disabled{{/unless}}>
            <span class="mdl-checkbox__label">New counter-subject</span>
          </label>
          <label class="block mdl-checkbox mdl-js-checkbox" for="rt-tnm-ocs">
            <input type="checkbox" id="rt-tnm-ocs" class="inline mdl-checkbox__input" {{#if types.rt-tnm.ocs}}checked{{/if}} {{#unless types.rt-tnm}}disabled{{/unless}}>
            <span class="mdl-checkbox__label">Old counter-subject shifted</span>
          </label>
          <label class="block mdl-checkbox mdl-js-checkbox" for="rt-tnm-ocst">
            <input type="checkbox" id="rt-tnm-ocst" class="inline mdl-checkbox__input" {{#if types.rt-tnm.ocst}}checked{{/if}} {{#unless types.rt-tnm}}disabled{{/unless}}>
            <span class="mdl-checkbox__label">Old counter-subject transposed</span>
          </label>
          <label class="block mdl-checkbox mdl-js-checkbox" for="rt-tnm-nc">
            <input type="checkbox" id="rt-tnm-nc" class="inline mdl-checkbox__input" {{#if types.rt-tnm.nc}}checked{{/if}} {{#unless types.rt-tnm}}disabled{{/unless}}>
            <span class="mdl-checkbox__label">New combination</span>
          </label>
        </div>
      </div>
    </div>
    <div class="mdl-shadow--2dp types">
      <label for="rt-nm" class="block main-type mdl-radio mdl-js-radio">
        <input type="radio" name="relationship-type" id="rt-nm" class="inline mdl-radio__input cb" {{#if types.rt-nm}}checked{{/if}}>
        <span class="mdl-radio__label">New material</span>
      </label>
    </div>
    <div class="mdl-shadow--2dp types">
      <label for="rt-om" class="block main-type mdl-radio mdl-js-radio">
        <input type="radio" name="relationship-type" id="rt-om" class="inline mdl-radio__input cb" {{#if types.rt-om}}checked{{/if}}>
        <span class="mdl-radio__label">Omission</span>
      </label>
    </div>
    <h3>Remarks</h3>
    <div class="mdl-textfield mdl-js-textfield">
      <label class="mdl-textfield__label" for="rel-comment"></label>
      <textarea class="mdl-textfield__input" type="text" rows="5" style="width: 80%;" id="rel-comment">{{#if comment}}{{comment}}{{/if}}</textarea>
    </div>
    <div class="messages mdl-shadow--2dp"></div>
  </div>
  <div class="mdl-dialog__actions">
    <button type="button" class="btn btn-primary mdl-button mdl-button--accent" id="save_score_relationship">Save</button>
    <button type="button" class="btn mdl-button close" id="cancel_score_relationship">Close</button>
  </div>
`

export default Handlebars.compile(score_relationship_tpl);
