$(function(){
	$.get('/blocks', appendToList);
	
	function appendToList(blocks){
		var list = [];
		for(var i in blocks){
			var block = blocks[i];
			content = '<a href="/blocks/'+block+'">'+block+'</a>' + 
			'  <a href="#" title="Delete" data-block="'+block+'">(x)</a>';
			list.push($('<li>', { html: content }));
		}
		$('.block-list').append(list);
	}

	$('form').on('submit', function(event){
		event.preventDefault();
		var form = $(this);
		var blockData = form.serialize();

		$.ajax({
			type: 'POST',
			url: '/blocks',
			data: blockData
		}).done(function(blockName){
			// Append to block list
			appendToList([blockName]);
			form.trigger('reset');
		});
	});

	$('.block-list').on('click', 'a[data-block]', function(event){
		if(!confirm('Are you sure?')){
			return false;
		}

		var target = $(event.currentTarget);

		$.ajax({
			type: 'DELETE',
			url: '/blocks/' + target.data('block')
		}).done(function(response){
			target.parents('li').remove();
		});
	});
});