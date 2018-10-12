import * as Handlebars from 'handlebars';

let pag_tpl = `
  <hr />
  <h2>{{title}} <small>{{piece_id}}</small></h2>
  <h3>{{composer}}</h3>
  <div class="row-fluid">
    <div class="span9">
      <button type="button" class="btn btn-danger close_score_button">
        Remove piece
      </button>
      <button type="button" class="btn collapse_expand_button">
        Collapse
      </button>
      <button type="button" class="btn show-score-relationship" style="display:none">
        Show relationship
      </button>
      <button type="button" class="btn show-score-observations">
        Show observations
      </button>
    </div>
    <div class="btn-group pull-right" role="group">
      <button type="button" class="btn btn-active prevPage score_collapsible">
        &lt;
      </button>
      <button type="button" class="btn btn-active nextPage score_collapsible">
        &gt;
      </button>
    </div>
  </div>
<div class="score score_collapsible"></div>
`

export default Handlebars.compile(pag_tpl);
