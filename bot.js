const express = require('express')
const app = express()
var bodyParser = require('body-parser');
var fs = require("fs");

app.use(bodyParser.json());

const Discord = require('discord.js');
const client = new Discord.Client();
const token = 'MzE4NDA3OTU5MjI0OTA5ODI0.DA4AKg.TAcRaJeY3gn_MggGg_n1kaZ1lss';
prefix = '!';

client.on('ready', () => {
	console.log("Bot is primed");
});

function playSound(id, file){
	let channel = client.channels.get(id);

	channel.join().then(connection => {
		const broadcast = client
		.createVoiceBroadcast()
		.playFile('./sounds/' + file);
		const dispatcher = connection.playBroadcast(broadcast);
	}).catch(console.error);
}

app.get('/', function(req, res){
		res.sendFile(__dirname + "/index.html");
})

app.get('/files', function(req, res){
	fs.readdir("./sounds", (err, files) => {
		res.send(JSON.stringify(files));
	});
})

app.post('/play', function(req, res) {
		playSound(req.body.id, req.body.file);
		res.send("It works");

})

client.on('message', message => {
	if(message.content === (prefix + 'ping')){
		message.reply('pong');
	}

	if(message.content === (prefix + 'join')){
		const channel = message.member.voiceChannel;

		channel.join()
		.then(connection => {})
		.catch(console.error);
	}

	if(message.content === (prefix + 'leave')){
		const channel = message.member.voiceChannel;
		channel.leave();
	}


	if(message.content.startsWith(prefix + 'sound')){
		const channel = message.member.voiceChannel;

		sound = message.content.split(" ")[1];

		playSound(channel.id, sound+".mp3");
	}


	if(message.content.startsWith(prefix + 'list')){
		option = message.content.split(" ")[1];

		if(option=="sounds"){			
			const fs = require('fs');
			result = "```\n";

			fs.readdir("./sounds/", (err, files) => {
				files.forEach(file => {
					result = result + file.split(".mp3")[0] + "\n";
				});
				message.reply(result+"```");
			})
		}
	}

	if(message.content === (prefix + 'link')){
		host = "http://5.53.168.140:8080";
		message.reply(host + "/?id=" + message.member.voiceChannel.id);
	}
});

app.listen(8080, function () {
	console.log('Example app listening on port 8080!');
})

client.login(token);
