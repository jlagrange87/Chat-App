$(document).ready(function(){
	var App = Backbone.Router.extend({
		routes:{
			"":     			 	"home",

			"chatRoom/:query":     	"chatRoom",

			"leaderboard": 			"leaderboard",

			"userProfile/:query": 	"userProfile",

			"roomHistory": 			"roomHistory"

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
				$("body").append("<audio src='audio/Welcome.mp3' preload='preload' autoplay='autoplay'></audio>")
				setInterval(getMessages, 500)

		},
			leaderboard: function(){
				$(".page").hide();
				$("#leaderboard").fadeIn(1000);

		},
			userProfile: function(theUser){
				$(".profile-header").html("")
				$(".page").hide();
				$("#userProfile").fadeIn(1000);

		},
			roomHistory: function(){
				$(".history-header").html("");
				$("#history-results").html("");
				$(".page").hide();
				$("#roomHistory").fadeIn(1000);
				$(".history-header").append("<hr>Welcome to Room History!<hr>")
			}


	});
	var myRouter = new App();
	Backbone.history.start();
	var loginObject = {};
	var profileObject = {};
	var messageArray = [];
	var roomHistoryObject = {};
	$("#login").submit(function(e){
		e.preventDefault();
		loginObject.userName = $("#user").val();
		loginObject.chatRoomNum = $("#roomNum").val();
		myRouter.navigate("chatRoom/"+$("#roomNum").val(), {trigger: true})
		$(".chat-header").append("<hr>Welcome to Chat Room "+$("#roomNum").val()+"!<hr>");
		for(var i = 0; i < messageArray.length; i++){
			var cPost = messageArray[i];
			if(cPost.room == loginObject.chatRoomNum && cPost.messages.indexOf(".png") == -1 && cPost.messages.indexOf(".jpg") == -1 && cPost.messages.indexOf(".gif") == -1){
				$("#chat").append("<div> <b>"+cPost.user+"</b>"+ "  "+moment(cPost.created_at).format("h:mm:ss a, MMM Do YYYY")+"</div>" + "<p class='comment'>"+cPost.messages+"</p>");
				$('.comment').emoticonize();
			}

			else if(cPost.room == loginObject.chatRoomNum){
				$("#chat").append("<div> <b>"+cPost.user+"</b>"+ "  "+moment(cPost.created_at).format("h:mm:ss a, MMM Do YYYY")+"</div>"+"<img src='"+cPost.messages+"'style='max-width: 250px'>" +"<div><a href="+cPost.messages+">"+cPost.messages+"</a></div>" );
				$('.comment').emoticonize();
			}
		}
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
	});
	$("#userSearch").submit(function(e){
		e.preventDefault();
		getUserHistory();
		console.log($("#whoIs").val());
		profileObject.userName = $("#whoIs").val();
		myRouter.navigate("userProfile/"+profileObject.userName, {trigger: true})
		$(".profile-header").append("<hr>Welcome to "+profileObject.userName+" Message Histroy! <hr>");
	});
	$("#history-submit").submit(function(e){
		e.preventDefault();
		if($("#hist1").val().indexOf("-") == -1){
			alert("Please input the correct format yyyy-mm-dd (eg. 2015-6-5) in Start Date.")
		}
		else if($("#hist2").val().indexOf("-") == -1){
			alert("Please input the correct format (eg. 2015-6-5) in End Date.")
		}
		else if($("#hist-room").val() == ""){
			alert("Please Specify a Room Number.")
		}
		else{
		roomHistoryObject.date1 = $("#hist1").val();
		roomHistoryObject.date2 = $("#hist2").val();
		roomHistoryObject.room = $("#hist-room").val();
		getRoomHistroy();
		$(".history-header").html("");
		$(".history-header").append("<hr>This is Room #"+roomHistoryObject.room+"'s "+roomHistoryObject.date1+" / "+roomHistoryObject.date2+"'s History!<hr>")
		}
	});
	function getUserHistory(){
		$.get(
			"https://whispering-sierra-7759.herokuapp.com/rooms",
			onUserHistorySearch,
			"json"
			);
	}
	function getRoomHistroy(){
		$.get(
			"https://whispering-sierra-7759.herokuapp.com/get_history"+"/"+roomHistoryObject.date1+"/"+roomHistoryObject.date2,
			onRoomHistorySearch,
			"json"
			);
	}
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
			"https://whispering-sierra-7759.herokuapp.com/chatted_recently/14400",
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
			if(currentMessage === undefined && postMsg.room == loginObject.chatRoomNum && postMsg.messages.indexOf(".png") == -1 && postMsg.messages.indexOf(".jpg") == -1 && postMsg.messages.indexOf(".gif") == -1 && postMsg.messages.indexOf("@") == -1){
				messageArray.push(messageList[i]);
				$("#chat").append("<div> <b>"+postMsg.user+"</b>"+ "  "+moment(postMsg.created_at).format("h:mm:ss a, MMM Do YYYY")+"</div>" + "<p class='comment'>"+postMsg.messages+"</p>");
				$('.comment').emoticonize();
				setTimeout("$('.scrollMe').scrollTop(6000000)",750)
				$("body").append("<audio src='audio/im.mp3' preload='auto' autoplay='autoplay'></audio>")
				console.log(messageArray)
			}
			else if(currentMessage === undefined && postMsg.room == loginObject.chatRoomNum && postMsg.messages.indexOf(".png") == -1 && postMsg.messages.indexOf(".jpg") == -1 && postMsg.messages.indexOf(".gif") == -1){
				messageArray.push(messageList[i]);
				$("#chat").append("<div> <b>"+postMsg.user+"</b>"+ "  "+moment(postMsg.created_at).format("h:mm:ss a, MMM Do YYYY")+"</div>" + "<p class='comment'>"+postMsg.messages+"</p>");
				$('.comment').emoticonize();
				setTimeout("$('.scrollMe').scrollTop(6000000)",750)
				$("body").append("<audio src='audio/pewpew.mp3' preload='auto' autoplay='autoplay'></audio>")
				console.log(messageArray)
			}
			else if(currentMessage === undefined && postMsg.room == loginObject.chatRoomNum){
				messageArray.push(messageList[i]);
				$("#chat").append("<div> <b>"+postMsg.user+"</b>"+ "  "+moment(postMsg.created_at).format("h:mm:ss a, MMM Do YYYY")+"</div>" + "<img src='"+postMsg.messages+"'style='max-width: 250px'>" +"<div><a href="+postMsg.messages+">"+postMsg.messages+"</a></div>");
				$('.comment').emoticonize();
				setTimeout("$('.scrollMe').scrollTop(6000000)",750)
				$("body").append("<audio src='audio/im.mp3' preload='auto' autoplay='autoplay'></audio>")
				console.log(messageArray)
			}
		}
	}
	function onUserHistorySearch(overallMsgs){
		$("#profilemessages").html("");
		for(var i = 0; i < overallMsgs.length; i++){
			var postHistory = overallMsgs[i].messages;
			var correctUser = overallMsgs[i].user;
			if(correctUser == profileObject.userName && postHistory.indexOf(".png") == -1 && postHistory.indexOf(".jpg") == -1 && postHistory.indexOf(".gif") == -1){
				$("#profilemessages").prepend("<div><b>"+moment(overallMsgs[i].created_at).format("h:mm:ss a, MMM Do YYYY")+", Chatroom #"+overallMsgs[i].room+": </b></div>" + "<p class='comment'>"+postHistory+"</p>");
				$('.comment').emoticonize();
			}
			else if(correctUser == profileObject.userName){
				$("#profilemessages").prepend("<div><b>"+moment(overallMsgs[i].created_at).format("h:mm:ss a, MMM Do YYYY")+", Chatroom #"+overallMsgs[i].room+": </b></div>" + "<img src='"+postHistory+"'style='max-width: 250px'>" +"<div><a href="+postHistory+">"+postHistory+"</a><div>");
				$('.comment').emoticonize();
			}
		}	
	}
	function onRoomHistorySearch(roomHistoryOverall){
		$("#history-results").html("");
		for(var i = 0; i < roomHistoryOverall.length; i++){
			var postHistory = roomHistoryOverall[i].messages;
			var correctRoom = roomHistoryOverall[i].room;
			if(correctRoom == roomHistoryObject.room && postHistory.indexOf(".png") == -1 && postHistory.indexOf(".jpg") == -1 && postHistory.indexOf(".gif") == -1){
				$("#history-results").prepend("<div><b>"+roomHistoryOverall[i].user+" "+moment(roomHistoryOverall[i].created_at).format("h:mm:ss a, MMM Do YYYY")+": </b></div>" + "<p class='comment'>"+postHistory+"</p>");
				$('.comment').emoticonize();
			}
			else if(correctRoom == roomHistoryObject.room){
				$("#history-results").prepend("<div><b>"+roomHistoryOverall[i].user+" "+moment(roomHistoryOverall[i].created_at).format("h:mm:ss a, MMM Do YYYY")+": </b></div>" + "<img src='"+postHistory+"'style='max-width: 250px'>" +"<div><a href="+postHistory+">"+postHistory+"</a></div>");
				$('.comment').emoticonize();
			}
		}	
	}
	getMessages();
	setInterval(getUserLeaders, 10000);

	setInterval(getRoomLeaders, 10000);

	setInterval(getActiveUsers, 10000);
});
