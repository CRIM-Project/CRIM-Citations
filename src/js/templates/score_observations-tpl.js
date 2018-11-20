import * as Handlebars from 'handlebars';

let score_observation_tpl = `
  <h2 class="mdl-dialog__title">Edit relationships</h2>
  <div class="mdl-dialog__content">
    {{#if relationships}}
      <ul class="mdl-list">
        {{#each relationships}}
          <li class="mdl-list__item rel_item" id="i_{{this.cid}}" data-relid="{{this.cid}}">
            <h3>{{#each this.types}}{{label}}{{#unless @last}},{{/unless}}{{/each}}</h3>
            <div class="row-fluid block mdl-list__item-primary-content">
              <div class="span5">
                {{this.titleA}}
                <span class="ema truncate scoreA_ema" title="{{this.scoreA_ema}}">{{this.scoreA_ema}}</span>
              </div>
              <div class="span2 centeralign">
                &rarr;
              </div>
              <div class="span5">
                {{this.titleB}}
                <span class="ema truncate scoreB_ema" title="{{this.scoreB_ema}}">{{this.scoreB_ema}}</span>
              </div>
            </div>
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
