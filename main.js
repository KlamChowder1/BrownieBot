require("dotenv").config();
const Discord = require("discord.js");
const db = require("quick.db");
const fs = require("fs");

const PREFIX = "!";

const client = new Discord.Client();
const commandsList = fs.readFileSync("./help.txt", "utf8");

client.once("ready", () => {
  console.log("Baked goods have arrived.");
});

client.on("message", (message) => {
  const args = message.content.replace(/\s+/g, "");
  const command = args.substring(1, args.length).toLowerCase();
  const monkeys = [
    "./images/monkey_curtis.png",
    "./images/monkey_darwin.png",
    "./images/monkey_eui-young.png",
    "./images/monkey_kevin.png",
    "./images/monkey_monkey.png",
    "./images/monkey_oscar.png",
    "./images/monkey_ricky.png",
    "./images/monkey_william.png",
  ];

  if (
    (message.channel.id !== process.env.TESTING_SERVER_CHANNEL_ID &&
      message.channel.id !== process.env.RICKSTER_SECRET_ROBOT_CHANNEL_ID) ||
    !message.content.startsWith(PREFIX) ||
    message.author.bot
  ) {
    return;
  }

  try {
    switch (command) {
      // miscellaneous
      case "help":
        message.channel.send(commandsList);
        break;
      case "feetpics":
        message.channel.send({ files: ["./images/toes.png"] });
        break;
      case "#1fan":
        message.channel.send({ files: ["./images/number_one.jpg"] });
        break;
      case "monkeys":
        message.channel.send({
          files: [monkeys[Math.floor(Math.random() * monkeys.length)]],
        });
        break;
      case "clear":
        if (message.author.id === process.env.MY_ACCOUNT_ID) {
          console.log(db.all());
          db.all().forEach((x) => {
            db.delete(x.ID);
          });
          message.channel.send(
            "You did 1 push up with your huge muscles. All sugars have been erased."
          );
          console.log(db.all());
          break;
        } else {
          message.channel.send(
            "You tried to do 1 push up. Your weak arms gave out."
          );
          break;
        }

      // brownies
      case "getbrownie":
        db.add("brownie" + message.author.id, 1);
        message.channel.send(
          "Kevin Lam has given you a fresh brownie. You now have: " +
            db.get("brownie" + message.author.id) +
            " brownies."
        );
        break;

      case "eatbrownie":
        if (db.get("eaten" + message.author.id) > 10) {
          message.channel.send(
            "You have eaten too many sweets, you now have diabetes. Sorry " +
              message.author.username
          );
          break;
        }
        if (db.get("brownie" + message.author.id) <= 0) {
          message.channel.send(
            "You have insufficient brownies. Type '!get brownie' to get more!"
          );
          break;
        } else {
          db.subtract("brownie" + message.author.id, 1);
          db.add("eaten" + message.author.id, 1);
          message.channel.send(
            "You have eaten one brownie. You have " +
              db.get("brownie" + message.author.id) +
              " brownies left"
          );
        }
        break;

      // cookies
      case "getcookie":
        db.add("cookie" + message.author.id, 1);
        message.channel.send(
          "Kevin Lam has given you a fresh cookie. You have: " +
            db.get("cookie" + message.author.id) +
            " cookies."
        );
        break;

      case "eatcookie":
        if (db.get("eaten" + message.author.id) > 10) {
          message.channel.send(
            "You have eaten too many sweets, you now have diabetes. Sorry."
          );
          break;
        }
        if (db.get("cookie" + message.author.id) <= 0) {
          message.channel.send(
            "You have insufficient cookies. Type '!get cookie' to get more!"
          );
          break;
        } else {
          db.subtract("cookie" + message.author.id, 1);
          db.add("eaten" + message.author.id, 1);
          message.channel.send(
            "You have eaten one cookie. You have " +
              db.get("cookie" + message.author.id) +
              " cookies left"
          );
        }
        break;
      default:
        message.channel.send(
          "Command " +
            message.content +
            " not found. Please type '!help' for the command list."
        );
        break;
    }
  } catch (err) {
    console.log(err);
  }
});

client.login(process.env.BOT_TOKEN);
