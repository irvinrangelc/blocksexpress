$(function(){
	$.get('/cities', appendToList);
	
	function appendToList(cities){
		var list = [];
		for(var i in cities){
			var city = cities[i];
			content = '<a href="/cities/'+city+'">'+city+'</a>' + 
			'  <a href="#" title="Delete" data-city="'+city+'">(x)</a>';
			list.push($('<li>', { html: content }));
		}
		$('.cities-list').append(list);
	}

	$('form').on('submit', function(event){
		event.preventDefault();
		var form = $(this);
		var cityData = form.serialize();

		$.ajax({
			type: 'POST',
			url: '/cities',
			data: cityData
		}).done(function(cityName){
			// Append to city list
			appendToList([cityName]);
			form.trigger('reset');
		});
	});

	$('.cities-list').on('click', 'a[data-city]', function(event){
		if(!confirm('Are you sure?')){
			return false;
		}

		var target = $(event.currentTarget);

		$.ajax({
			type: 'DELETE',
			url: '/cities/' + target.data('city')
		}).done(function(response){
			target.parents('li').remove();
		});
	});
});