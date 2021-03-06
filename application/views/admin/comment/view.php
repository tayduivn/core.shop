<div class="portlet">
	<div class="portlet-heading bg-primary">
		<div class="portlet-title">
			<h4><i class="fa fa-info"></i> <?php echo lang('comment_info'); ?></h4>
		</div>

	</div>
	<div class="portlet-body ">
		<table class="table table-bordered table-striped table-hover tc-table">
			<tbody>
			<tr>
				<td class="row_label"><?php echo lang('id'); ?></td>
				<td class="row_item">
					<?php echo $info->id; ?>
				</td>
			</tr>

			<tr>
				<td class="row_label"><?php echo lang('name'); ?></td>
				<td class="row_item">
					<?php if($info->model): ?>
					<a href="<?php echo $info->model->_url_view; ?>" target="_blank" style="float:left; margin-right: 5px;">
						<img src="<?php echo $info->model->image->url_thumb; ?>" height="40px" width="50px" />
					</a>
					<a href="<?php echo $info->model->_url_view; ?>" target="_blank" >
						<?php echo $info->model->name; ?>
					</a>
					<?php else: ?>
						[deleted]
					<?php endif; ?>
				</td>
			</tr>

			<tr>
				<td class="row_label"><?php echo lang('user'); ?></td>
				<td class="row_item">
						<?php if($info->user)
							echo $info->user->name;
						else echo '[deleted]'?>
				</td>
			</tr>
			<tr>
				<td class="row_label"><?php echo lang('created'); ?></td>
				<td class="row_item">
					<?php echo $info->_created_full; ?>
				</td>
			</tr>
			<tr>
				<td class="row_label"><?php echo lang('rate'); ?></td>
				<td class="row_item">
					<?php
						echo $info->rate  .' sao';
					?>
				</td>
			</tr>
			<tr>
				<td class="row_label"><?php echo "Loại bình luận";//lang('created'); ?></td>
				<td class="row_item">
					<?php echo  lang('comment_type_' .$info->table_name) ?>
				</td>
			</tr>
			<tr>
				<td colspan="2">
					<span class="label label-info mb20">Bình luận:</span><br>
					<?php echo nl2br(htmlentities($info->content)); ?>
				</td>
			</tr>
			<tr>
				<td class="row_item">
					<?php if ($info->status): ?>
						<a href="#0" class="btn btn-warning  verify_action mt5" notice="Bạn có chắc muốn hủy xác thực bình luận này?<?php ?>"
						   _url="<?php echo admin_url('comment/unverify/' . $info->id) ?>">Hủy xác thực</a>
					<?php else: ?>
						<a href="#0" class="btn btn-primary   verify_action mt5" notice="Bạn có chắc muốn xác thực bình luận này?<?php ?>"
						   _url="<?php echo admin_url('comment/verify/' . $info->id) ?>">Xác thực</a>
					<?php endif; ?>
						<a href="#0" class="btn btn-danger   verify_action mt5" _url="<?php echo admin_url('comment/del/' . $info->id) ?>"    notice="<?php echo lang('notice_confirm_del'); ?>"
							><?php echo lang('delete'); ?></a>
				</td>
			</tr>

			</tbody>
		</table>
	</div>
</div>
<script type="text/javascript">
	$(document).ready(function(){
		$('.verify_action').nstUI('verifyAction');
	});
</script>