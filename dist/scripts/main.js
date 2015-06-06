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
					$(".chat-header").html("");
					$("#chat").html("");
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
	var messageArray = [];
	$("#login").submit(function(e){
		loginObject.userName = $("#user").val();
		loginObject.chatRoomNum = $("#roomNum").val();
		myRouter.navigate("chatRoom/"+loginObject.chatRoomNum, {trigger: true})
		for(var i = 0; i < messageArray.length; i++){
			var cPost = messageArray[i];
			if(cPost.room == loginObject.chatRoomNum){
				$("#chat").append("<div> <b>"+cPost.user+"</b>"+ "  "+moment(cPost.created_at).format("h:mm:ss a, MMM Do YYYY")+"</div>" + "<p class='comment'>"+cPost.messages+"</p>");
				$('.comment').emoticonize();
			}
		}
		$(".chat-header").append("<hr>Welcome to Chat Room "+loginObject.chatRoomNum+"!<hr>");
		$("body").append("<audio src='http://www.thewavsite.com/AOL/welcome.wav' preload='preload' autoplay='autoplay'></audio>")
	});
	$("#formSubmit").submit(function(e){
		e.preventDefault();
		var myMessage= {
			user: loginObject.userName,
			messages: $("#msg").val(),
			room: loginObject.chatRoomNum
		}
		$.post("https://whispering-sierra-7759.herokuapp.com/rooms",
			myMessage);
		$("#msg").val("");
		setTimeout("$('.scrollMe').scrollTop(6000000)",750)
		$("body").append("<audio src='audio/im.mp3' preload='auto' autoplay='autoplay'></audio>")
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
			"https://whispering-sierra-7759.herokuapp.com/rooms/get_time/300",
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
		for(var i = 0; i < messageList.length; i++){
			var postMsg = messageList[i];
			var msgID = postMsg.id;
			var currentMessage= _.find(messageArray, function(m){
				if(m.id === msgID){
					return true;
				}
				else{
					return false;
				}
			});
			if(currentMessage === undefined){
				messageArray.push(messageList[i]);
				$("#chat").append("<div> <b>"+postMsg.user+"</b>"+ "  "+moment(postMsg.created_at).format("h:mm:ss a, MMM Do YYYY")+"</div>" + "<p class='comment'>"+postMsg.messages+"</p>");
				$('.comment').emoticonize();
				console.log(messageArray)

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


