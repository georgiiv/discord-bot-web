const express = require('express')
const app = express()
var bodyParser = require('body-parser');
var fs = require("fs");
var multer = require('multer');
const Discord = require('discord.js');
const client = new Discord.Client();

app.use(bodyParser.json());

//******************************************************************************
const token = '';
const port = 8080;
const hostlink = "";
prefix = '!';
//******************************************************************************

client.on('ready', () => {
	console.log("Bot is connected");
});

function playSound(id, file) {
	let channel = client.channels.get(id);

	channel.join().then(connection => {
		const broadcast = client
			.createVoiceBroadcast()
			.playFile('./sounds/' + file);
		const dispatcher = connection.playBroadcast(broadcast);
	}).catch(console.error);
}

app.get('/', function (req, res) {
	res.sendFile(__dirname + "/index.html");
})

app.get('/files', function (req, res) {
	fs.readdir("./sounds", (err, files) => {
		res.send(JSON.stringify(files));
	});
})

app.post('/play', function (req, res) {
	playSound(req.body.id, req.body.file);
	res.send("It works");
})

app.post('/upload', function (req, res) {
	var storage = multer.diskStorage({
		destination: function (request, file, callback) {
			callback(null, './sounds');
		},
		filename: function (request, file, callback) {
			callback(null, file.originalname)
		}
	});
	var upload = multer({ storage: storage }).single('sound');

	upload(req, res, function (err) {
		if (err) {
			console.log(err);
			return;
		}
		//console.log(req.file.originalname + " uploaded");
		if (req.body.channelid) {
			res.redirect('/?id=' + req.body.channelid);
		} else {
			res.send("No voice channel ID sent")
		}
	})
});

//-----------------------------------------------------------------------------------------------
//Chat commands start here
//-----------------------------------------------------------------------------------------------

client.on('message', message => {
	if (message.content === (prefix + 'ping')) {
		message.reply('pong');
	}

	if (message.content === (prefix + 'join')) {
		const channel = message.member.voiceChannel;

		channel.join()
			.then(connection => { })
			.catch(console.error);

		message.delete()
	}

	if (message.content === (prefix + 'leave')) {
		const channel = message.member.voiceChannel;
		channel.leave();
		message.delete()
	}


	if (message.content.startsWith(prefix + 'sound')) {
		const channel = message.member.voiceChannel;

		sound = message.content.split(" ")[1];

		playSound(channel.id, sound + ".mp3");
		message.delete()
	}


	if (message.content.startsWith(prefix + 'list')) {
		option = message.content.split(" ")[1];

		if (option == "sounds") {
			const fs = require('fs');
			result = "```\n";

			fs.readdir("./sounds/", (err, files) => {
				files.forEach(file => {
					result = result + file.split(".mp3")[0] + "\n";
				});
				message.reply(result + "```");
				message.delete()
			})
		}
	}

	if (message.content === (prefix + 'link')) {
		message.reply(hostlink + "/?id=" + message.member.voiceChannel.id);
		message.delete()
	}

	if (message.content === (prefix + 'tts')) {
		message.channel.send("This is a tts message", { tts: true });
		message.delete()
	}
});

app.listen(port, function () {
	console.log('Bot is running on port:', port);
})

client.login(token);
