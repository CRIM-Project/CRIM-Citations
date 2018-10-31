import * as Handlebars from 'handlebars';

let addfile_tpl = `
  <h4 class="mdl-dialog__title">Add score</h4>
  <div class="mdl-dialog__content">
    <div class="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
      <div class="mdl-tabs__panel" id="web-panel">
        <form action="#">
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <label class="block mdl-textfield__label" for="url_input">
              URL:
              <input style="width:80%;" class="inline mdl-textfield__input" type="text" id="url_input" value="http://www.verovio.org/examples/downloads/Schubert_Lindenbaum.mei">
            </label>
          </div>
        </form>
      </div>
      <div class="mdl-tabs__panel is-active" id="crim-panel">
        <p>
          {{#each scores}}
            <label class="block mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="s_{{this.piece_id}}">
              <input type="checkbox" id="s_{{this.piece_id}}" class="inline mdl-checkbox__input" value="{{this.url}}" data-composer="{{this.composer}}" data-title="{{this.title}}" data-piece_id="{{this.piece_id}}" />
              [{{this.piece_id}}] {{this.title}} ({{this.composer}})
            </label>
          {{/each}}
        </p>
      </div>
    </div>
  </div>
  <div class="mdl-dialog__actions">
    <button type="button" class="btn btn-primary mdl-button mdl-button--accent" id="openFile">Open</button>
    <button type="button" class="btn mdl-button close">Cancel</button>
  </div>
`

export default Handlebars.compile(addfile_tpl);
