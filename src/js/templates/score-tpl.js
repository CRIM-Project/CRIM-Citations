import * as Handlebars from 'handlebars';

let pag_tpl = `
<div class="score_header">
  <hr />
  <h2>{{title}} <small>{{piece_id}}</small></h2>
</div>
<h3>{{composer}}</h3>
<div class="row-fluid">
  <div class="span9">
    <button type="button" class="btn mdl-button mdl-button--attention mdl-js-button btn-danger close_score_button">
      Remove piece
    </button>
    <button type="button" class="btn btn-primary mdl-button mdl-js-button show-score-relationship" style="display:none">
      New relationship
    </button>
    <button type="button" class="btn mdl-button mdl-js-button mdl-button--colored show-score-observations" style="display:none">
      Show relationships
    </button>
  </div>
  <div class="pull-right">
    <button type="button" class="btn mdl-button mdl-js-button collapse_expand_button">
      <span class="collapse">Collapse</span>
      <span class="expand" style="display:none;">Expand</span>
    </button>
  </div>
  <nav class="mdl-navigation">
    <div class="btn-group score_pagination pull-right" role="group">
      <button type="button" class="btn prevPage mdl-button mdl-js-button score_collapsible">
        &lt;
      </button>
      <button type="button" class="btn nextPage mdl-button mdl-js-button score_collapsible">
        &gt;
      </button>
    </div>
  </nav>
</div>
<div class="score score_collapsible"></div>
`

export default Handlebars.compile(pag_tpl);
