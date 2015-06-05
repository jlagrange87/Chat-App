$(document).ready(function(){
	var App = Backbone.Router.extend({
		routes:{
			"":     			 "home",

			"chatRoom/:query":     "chatRoom",

			"leader": 			 "watch" 

		},
				home: function(){
					$(".page").hide();
					$("#home").show();

		},
				chatRoom: function(roomNum){
					$(".page").hide();
					$("#chatRoom").show();

		}
	});
	var loginObject = {};
	var myRouter = new App();
	Backbone.history.start();
	$("#login").submit(function(e){
		e.preventDefault
		loginObject.userName = $("#user").val();
		loginObject.chatRoomNum= $("#roomNum").val();
		myRouter.navigate("chatRoom/"+loginObject.chatRoomNum, {trigger: true})
		console.log(loginObject);
	});
	$("#formSubmit").submit(function(e){
		e.preventDefault();
		var myMessage= {
			user: loginObject.userName,
			messages: $("#msg").val(),
			room: loginObject.chatRoomNum
		}
		$.post("https://whispering-sierra-7759.herokuapp.com/rooms",
			myMessage)
		$("#msg").val("")
		console.log(myMessage.user+": "+ myMessage.messages)
		setTimeout("$('.scrollMe').scrollTop(6000000)",300)
	});
	function getMessages(){
		$.get(
			"https://whispering-sierra-7759.herokuapp.com/rooms/get_time",
			onMessagesReceived,
			"json"
			);
	}
	function onMessagesReceived(messageList){
		$("#chat").html("")
		for(var i = 0; i < messageList.length; i++){
			var postMsg = messageList[i];
			if(loginObject.chatRoomNum == postMsg.room){
				$("#chat").append("<div> <b>"+postMsg.user+"</b>"+ "  "+moment(postMsg.created_at).format("h:mm:ss a")+"</div>" + "<p>"+postMsg.messages+"</p>" + "<span> </span>");
			}
		}
	}
	setInterval(getMessages, 100)
	getMessages();
});

// "http://tiny-pizza-server.herokuapp.com/collections/joshstest"
// https://whispering-sierra-7759.herokuapp.com/rooms - over all
// https://whispering-sierra-7759.herokuapp.com/rooms/get_time - as of 5 mins
// https://whispering-sierra-7759.herokuapp.com/top_user - leaderboard