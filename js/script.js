$(function(){
	  
	// Settings
	var host = window.location.hostname;
	//host = "hostIP";

	var ws_url = 'ws://' + host + ':8081';
	var connection;
	var ws_waiting = 0;

	// ******************************************************************
	// Side navigation
	// ******************************************************************
    $('.button-collapse').sideNav();
	
	// Navlinks
	$('#mc-nav').on('click', '.mc-navlink', function(){
		console.log("Navigate to pane: ", $(this).data("pane"));
		showPane($(this).data("pane"));
	});
	
	function showPane(pane) {
		$('.mc_pane').addClass('hide');
		$('#' + pane).removeClass('hide');
		$('.button-collapse').sideNav('hide');
	}
	
	
	// ******************************************************************
	// init()
	// ******************************************************************
	function init() {
		console.log("Connection websockets to:", ws_url);
		connection = new WebSocket(ws_url, ['wordclock']);
		
				
		// When the connection is open, send some data to the server
		connection.onopen = function () {
			//connection.send('Ping'); // Send the message 'Ping' to the server
			console.log('WebSocket Open');
			showPane('pane1');
		};

		// Log errors
		connection.onerror = function (error) {
			console.log('WebSocket Error ' + error);
			$('#mc-wsloader').addClass('hide');
			$('#mc-wserror').removeClass('hide');
		};

		// Log messages from the server
		connection.onmessage = function (e) {
			console.log('WebSocket from server: ' + e.data);
			ws_waiting = 0;
		};
	}

	
	// ******************************************************************
	// Modes
	// ******************************************************************
	$("#leftBtn").on("click", function() {
			wsSendCommand('left');
	});
	
	$("#returnBtn").on("click", function() {
			wsSendCommand('return');
	});
	
	$("#rightBtn").on("click", function() {
			wsSendCommand('right');
	});
	
	// ******************************************************************
	// WebSocket commands
	// ******************************************************************
	function wsSendCommand(cmd) {
		console.log("Send WebSocket command:", cmd);
		if (ws_waiting == 0)  {
			connection.send(cmd);
			ws_waiting++;
		} else {
			console.log("++++++++ WS call waiting, skip")
		}
	}	
	
	init();
	
	
}); // end of document ready