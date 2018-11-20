import * as Handlebars from 'handlebars';

let addfile_tpl = `
  <h2 class="mdl-dialog__title">Add score</h2>
  <div class="mdl-dialog__content">
    <div class="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
      <div class="mdl-tabs__panel is-active" id="crim-panel">
        {{#each scores}}
          <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="s_{{this.piece_id}}">
            <input type="checkbox" id="s_{{this.piece_id}}" class="inline mdl-checkbox__input" value="{{this.url}}" data-composer="{{this.composer}}" data-title="{{this.title}}" data-piece_id="{{this.piece_id}}" />
            [{{this.piece_id}}] {{this.title}} ({{this.composer}})
          </label>
        {{/each}}
      </div>
    </div>
  </div>
  <div class="mdl-dialog__actions">
    <button type="button" class="btn btn-primary mdl-button mdl-button--accent" id="openFile">Open</button>
    <button type="button" class="btn mdl-button close">Close</button>
  </div>
`

export default Handlebars.compile(addfile_tpl);
