$(document).ready(function(){
	var App = Backbone.Router.extend({
		routes:{
			"":     			 "home",

			"chatRoom/:query":     "chatRoom",

			"leaderboard": 			 "leaderboard",

			"userProfile/:query": 	  "userProfile"

		},
				home: function(){
					$(".page").hide();
					$("#home").fadeIn(1000);

		},
				chatRoom: function(roomNum){
					$(".chat-header").html("")
					$(".page").hide();
					$("#chatRoom").fadeIn(1000);

		},
				leaderboard: function(){
					$(".chat-header").html("")
					$(".page").hide();
					$("#leaderboard").fadeIn(1000);

		},
				userProfile: function(theUser){
					$(".profile-header").html("")
					$(".page").hide();
					$("#userProfile").fadeIn(1000);

		},

	});
	var myRouter = new App();
	Backbone.history.start();
	var loginObject = {};
	var profileObject = {};
	$("#login").submit(function(e){
		e.preventDefault();
		console.log($("#user").val());
		console.log($("#roomNum").val());
		loginObject.userName = $("#user").val();
		loginObject.chatRoomNum = $("#roomNum").val();
		console.log();
		myRouter.navigate("chatRoom/"+loginObject.chatRoomNum, {trigger: true})
		$(".chat-header").append("<hr>Welcome to Chat Room "+loginObject.chatRoomNum+"!<hr>");
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
		setTimeout("$('.scrollMe').scrollTop(6000000)",750)
	});
	$("#userSearch").submit(function(e){
		e.preventDefault();
		console.log($("#whoIs").val());
		profileObject.userName = $("#whoIs").val();
		myRouter.navigate("userProfile/"+profileObject.userName, {trigger: true})
		$(".profile-header").append("<hr>Welcome to "+profileObject.userName+"'s Profile! <hr>");
	});
		// function userProfile(){
	// 	$.get(
	// 		"https://whispering-sierra-7759.herokuapp.com/rooms",
	// 		onMessagesReceived,
	// 		"json"
	// 		);
	// }
	function getUserLeaders(){
		$.get(
			"https://whispering-sierra-7759.herokuapp.com/top_user",
			onUserLeadersReceived,
			"json"
			);
	}
		function getRoomLeaders(){
		$.get(
			"https://whispering-sierra-7759.herokuapp.com/top_room",
			onRoomLeadersReceived,
			"json"
			);
	}
		function getActiveUsers(){
		$.get(
			"https://whispering-sierra-7759.herokuapp.com/last_four_hours_users",
			onActiveUsersReceived,
			"json"
			);
	}
	function getMessages(){
		$.get(
			"https://whispering-sierra-7759.herokuapp.com/rooms/get_time",
			onMessagesReceived,
			"json"
			);
	}
	function onUserLeadersReceived(userLeaderList){
		$("#userList").html("");
		for(var i = 0; i < userLeaderList.length; i++){
			var userLeads = userLeaderList[i];
			$("#userList").append("<li> <b>"+userLeads+"</b> </li>");
		}
	}
	function onRoomLeadersReceived(RoomLeaderList){
		$("#roomList").html("");
		for(var i = 0; i < RoomLeaderList.length; i++){
			var roomLeads = RoomLeaderList[i];
			$("#roomList").append("<li> <b>Chatroom: "+roomLeads+"</b> </li>");
		}
	}
	function onActiveUsersReceived(activeUsersList){
		$("#activeList").html("");
		for(var i = 0; i < activeUsersList.length; i++){
			var activeLeads = activeUsersList[i];
			$("#activeList").append("<li> <b>"+activeLeads+"</b> </li>");
		}
	}
	function onMessagesReceived(messageList){
		$("#chat").html("");
		for(var i = 0; i < messageList.length; i++){
			var postMsg = messageList[i];
			if(loginObject.chatRoomNum == postMsg.room){
				$("#chat").append("<div> <b>"+postMsg.user+"</b>"+ "  "+moment(postMsg.created_at).format("h:mm:ss a, MMM Do YYYY")+"</div>" + "<p>"+postMsg.messages+"</p>" + "<span> </span>");
			}
		}
	}
	// function getCurrentUsers(){
	// 	$.get(
	// 		"https://whispering-sierra-7759.herokuapp.com/rooms/get_time",
	// 		onCurrentUsersReceived,
	// 		"json"
	// 		);
	// }
	// function onCurrentUsersReceived(currentUserList){
	// 	$("#userList").html("");
	// 	for(var i = 0; i < currentUserList.length; i++){
	// 		console.log(currentUserList);
	// 		var usersInRoom = currentUserList[i].user;
	// 		var usersRoom = currentUserList[i].room;
	// 		if(usersInRoom === usersInRoom && usersRoom == usersRoom){
	// 			$("#userList").append("<div> <b>"+usersInRoom+"</b> </div>");
	// 			break;
	// 		}
	// 	}
	// }
	// setInterval(getCurrentUsers, 1000)
	// getCurrentUsers();

	setInterval(getMessages, 50)
	getMessages();

	setInterval(getUserLeaders, 10000)
	getUserLeaders();

	setInterval(getRoomLeaders, 10000)
	getRoomLeaders();

	setInterval(getActiveUsers, 10000)
	getActiveUsers();
});

// "http://tiny-pizza-server.herokuapp.com/collections/joshstest"
// https://whispering-sierra-7759.herokuapp.com/rooms - over all
// https://whispering-sierra-7759.herokuapp.com/rooms/get_time - as of 5 mins
// https://whispering-sierra-7759.herokuapp.com/top_user - leaderboard - 10 users
// https://whispering-sierra-7759.herokuapp.com/last_four_hours_users
// https://whispering-sierra-7759.herokuapp.com/top_room


