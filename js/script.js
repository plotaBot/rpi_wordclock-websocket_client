(function($){
$(function(){
	  
	// Settings
	var host = window.location.hostname;
	//host = "esp8266_02.local";

	var ws_url = 'ws://' + host + ':81';
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
		connection = new WebSocket(ws_url, ['arduino']);
		
				
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
	$("#pane1").on("click", ".btn_mode_static", function() {
		if($(this).attr("multi") == "1"){
			var outArray = "?";
			for(var i=0; i<=8; i++){
				if(document.getElementById('ignite'+i).checked){
					outArray += '1';
				}
				else {outArray += '0';}
			}
			wsSendCommand(outArray);
		}
		else{
			var pin = $(this).attr("pinNr");
			wsSendCommand("*" + pin);
			$(".btn_mode, .btn_mode_static").removeClass("red").addClass("blue");
			btn.removeClass("blue").addClass("red");
		}
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
	
	// ******************************************************************
	// main
	// ******************************************************************
	var modes_html = "";
		for (var i=0; i<=8; i++) {
			modes_html += '<div class="col s12 m6 l6 btn_grid"><div class="left switch"><label>';
			modes_html += '<input type="checkbox" id="ignite' + i + '"><span class="lever"></span></label></div>';
			modes_html += '<a class="btn waves-effect waves-light btn_mode_static blue" name="action" multi="0" pinNr="' + i + '">Ignite N°'+i;
			modes_html += '</a></div>';
		}
			
	document.getElementById("ignite").innerHTML = modes_html;
	
	init();
	
	
}); // end of document ready
})(jQuery); // end of jQuery name space