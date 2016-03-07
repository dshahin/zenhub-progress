$(document).ready(function(){
	console.log('hey now');
	function saveToken(){
		console.log('hey now');
		var token = document.getElementById('token').value;

		chrome.storage.sync.set({
		    token: token,
		    foo: 'bar'
		  }, function() {
		    // Update status to let user know options were saved.
		    var status = document.getElementById('status');
		    status.textContent = 'Options saved.';
		    console.log(token);
		    setTimeout(function() {
		      status.textContent = '';
		    }, 750);
			});
	}
	$('#saveToken').on('click',saveToken);
});