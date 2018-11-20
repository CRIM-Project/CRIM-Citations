import * as Handlebars from 'handlebars';

let score_observation_tpl = `
  <h2 class="mdl-dialog__title">Edit relationships</h2>
  <div class="mdl-dialog__content">
    <h3>Relationships</h3>
    {{#if relationships}}
      <ul class="mdl-list">
      {{#each relationships}}
        <li class="mdl-list__item rel_item" id="i_{{this.cid}}" data-relid="{{this.cid}}">
          <span class="block mdl-list__item-primary-content">
            {{this.titleA}} &rarr; {{this.titleB}}
            ({{#each this.types}}{{label}}{{#unless @last}},{{/unless}}{{/each}})
          </span>
          <span class="block mdl-list__item-secondary-action">
            <button class="btn btn-danger delete_item">Delete</button>
            <button class="btn btn-primary edit_relationship">Edit</button>
            <button class="btn rel_preview">Preview</button>
          </span>
        </li>
       {{/each}}
      </ul>
    {{else}}
    <p>No relationships yet.</p>
    {{/if}}
    <h3>Observations</h3>
    {{#if observations.length}}
    <ul class="mdl-list">
      {{#each observations}}
      <li class="mdl-list__item rel_item" id="i_{{this.cid}}" data-observationid="{{this.cid}}">
        <span class="block mdl-list__item-primary-content">
          <span title="{{this.title}}">{{this.title}}</span>
          ({{#each this.types}}{{label}}{{#unless @last}},{{/unless}}{{/each}})
          <span class="ema truncate" title="{{this.ema}}">{{this.ema}}</span>
        </span>
        <span class="block mdl-list__item-secondary-action">
          <button class="btn btn-danger delete_item">Delete</button>
          <button class="btn btn-primary edit_observation">Edit</button>
          <button class="btn selection_preview">Preview</button>
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
