$(document).ready(function(){
	
	$("#formSubmit").submit(function(e){
		e.preventDefault();
		var dd = "AM"
		var t = new Date();
		var sec = t.getSeconds();
		var min = t.getMinutes();
		var hour =t.getHours();
		if(sec < 10){
			sec = "0" + sec;
		}
		if(min < 10){
			min = "0" + min;
		}
		if(hour < 10){
			hour = "0" + hour;
		}
		
		if(hour == 22 || hour == 23){
			hour = hour - 12;
			dd = "PM";
		}
		if(hour >= 12) {
			hour = hour - 12;
			hour = "0" + hour;
			dd = "PM";
		}
		if(hour == 0){
			hour = 12;
		}
		time = hour + ":" + min + ":" + sec + " " + dd;
		var myMessage= {
			user: $("#user").val(),
			messages: $("#msg").val(),
			room: 1 
		}
		$.post("https://whispering-sierra-7759.herokuapp.com/rooms",
			myMessage)
		$("#msg").val("")
		console.log(myMessage.user+": "+ myMessage.messages)
		setTimeout("$('.scrollMe').scrollTop(6000000)",300)
	});

	function onMessagesReceived(messageList){
		$("#chat").html("")
		for(var i = 0; i < messageList.length; i++){
			var postMsg = messageList[i];
			if(postMsg.hasOwnProperty("user") && postMsg.hasOwnProperty("messages") && postMsg.hasOwnProperty("created_at") && postMsg.room === postMsg.room){
				$("#chat").append("<div> <b>"+postMsg.user+"</b>"+ "  "+moment(postMsg.created_at).format("h:mm:ss a")+"</div>" + "<p>"+postMsg.messages+"</p>" + "<span> </span>");
			}
		}
	}
	function getMessages(){
		$.get(
			"https://whispering-sierra-7759.herokuapp.com/rooms",
			onMessagesReceived,
			"json"
			);
		}
	setInterval(getMessages, 100)
	getMessages();
});
// "http://tiny-pizza-server.herokuapp.com/collections/joshstest"
//
// https://whispering-sierra-7759.herokuapp.com/rooms