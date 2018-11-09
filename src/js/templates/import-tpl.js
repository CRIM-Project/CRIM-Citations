import * as Handlebars from 'handlebars';

let import_tpl = `
  <h2 class="mdl-dialog__title">Import analyses</h2>
  <div class="mdl-dialog__content">
    <div class="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
      <div class="mdl-tabs__panel is-active" id="local-panel">
        <div class="form-horizontal mdl-textfield mdl-js-textfield mdl-textfield--file">
          <input class="mdl-textfield__input" style="width:60%;margin-right:0;" placeholder="File" type="text" id="uploadFile" readonly/>
          <button class="btn btn-info mdl-button mdl-button--primary mdl-button--file">
            Select file
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="mdl-dialog__actions">
    <button type="button" class="btn btn-primary mdl-button" id="doImport">Import</button>
    <button type="button" class="btn mdl-button close">Cancel</button>
  </div>
`

export default Handlebars.compile(import_tpl);
