<style>
.form .param_html .formRight {
	width: 100%;
	margin: 0px;
}
</style>


<?php
$_macro = array();
$_macro['mod'] = 'shipping_rate';
$this->lang->load('admin/geo_zone');


foreach ($langs as $l)
{
	$lang = array(
		'key' 	=> $l->code,
		'name' 	=> $l->name,
	);
	$lang['rows'][] = array(
		'param' 	=> "name[{$l->id}]",
		'type' 		=> 'text',
		'name' 		=> lang('shipping_rate_name'),
		'value' 	=> $info['name'][$l->id],
	);

	$_macro['form_translate']['langs'][] = $lang;
}
echo macro('mr::advForm')->page($_macro);

