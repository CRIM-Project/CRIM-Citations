import * as Handlebars from 'handlebars';

let score_observation_tpl = `
  <h4 class="mdl-dialog__title">Score metadata</h4>
  <div class="mdl-dialog__content">
    <h4>Relationships</h4>
    {{#if relationships}}
      <ul class="mdl-list">
      {{#each relationships}}
        <li class="mdl-list__item rel_item" id="i_{{this.cid}}" data-relid="{{this.cid}}">
          <span class="mdl-list__item-primary-content">
            <i class="material-icons delete_item clickable" title="edit relationship">delete_forever</i>
            <span class="truncate truncate_short" title="{{this.titleA}}">{{this.titleA}}</span>
            <i class="material-icons">{{#if this.boolDir}}&rarr;{{else}}&larr;{{/if}}</i>
            <span class="truncate truncate_short" title="{{this.titleB}}">{{this.titleB}}</span>
            <span class="truncate truncate_short" title="{{#each this.types}}{{label}}{{#unless @last}},{{/unless}}{{/each}}">({{#each this.types}}{{label}}{{#unless @last}},{{/unless}}{{/each}})</span>
          </span>
          <span class="mdl-list__item-secondary-action">
            <i class="material-icons edit_relationship clickable" title="edit relationship">mode_edit</i>
            <i class="material-icons rel_preview" title="preview first measure on this score">remove_red_eye</i>
          </span>
        </li>
       {{/each}}
      </ul>
    {{else}}
    <p>No relationships yet.</p>
    {{/if}}
    <h4>Observations</h4>
    {{#if observations.length}}
    <ul class="mdl-list">
      {{#each observations}}
      <li class="mdl-list__item rel_item" id="i_{{this.cid}}" data-observationid="{{this.cid}}">
        <span class="mdl-list__item-primary-content">
          <i class="material-icons delete_item clickable" title="edit relationship">delete_forever</i>
          <span class="truncate" title="{{this.ema}}">{{this.ema}}</span> <span class="truncate" title="{{#each this.types}}{{label}}{{#unless @last}},{{/unless}}{{/each}}">({{#each this.types}}{{label}}{{#unless @last}},{{/unless}}{{/each}})</span>
        </span>
        <span class="mdl-list__item-secondary-action">
          <i class="material-icons edit_observation clickable" title="edit observation">mode_edit</i>
          <i class="material-icons selection_preview clickable" title="preview first measure">remove_red_eye</i>
        </span>
      </li>
      {{/each}}
    </ul>
    {{else}}
    <p>No observations yet. Observations can be added to relationship targets.</p>
    {{/if}}
  </div>
  <div class="mdl-dialog__actions">
    <button type="button" class="btn mdl-button close">Close</button>
  </div>
  <div class="score_preview_cnt mdl-shadow--2dp" style="display:none">
    <div class="score_preview"></div>
    <i class="material-icons score_preview_close">close</i>
  </div>
  <div class="score_preview_cntB mdl-shadow--2dp" style="display:none">
    <div class="score_preview"></div>
    <i class="material-icons score_preview_close">close</i>
  </div>
`

export default Handlebars.compile(score_observation_tpl);
