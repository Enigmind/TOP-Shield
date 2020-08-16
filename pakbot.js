// Import constructors, configuration and login the client
const { Client, RichEmbed, Emoji, MessageReaction } = require("discord.js");
const CONFIG = require("./config");
const Welcome = require("discord-welcome");

const client = new Client({ disableEveryone: true });
if (CONFIG.botToken === "")
  throw new Error(
    "The 'botToken' property is not set in the config.js file. Please do this!"
  );

client.login(CONFIG.botToken);

function processCommand(message) {
  let fullCommand = message.content.substr(1); // Remove the +
  let splitCommand = fullCommand.split(" "); // Split the message up in to pieces for each space
  let primaryCommand = splitCommand[0]; // The first word directly after the '+' is the command
  let arguments = splitCommand.slice(1); // All other words are arguments/parameters/options for the command

  console.log("Command received: " + primaryCommand);
  console.log("Arguments: " + arguments); // There may not be any arguments

  /** Register command */
  if (primaryCommand == "register") {
    let error_message =
      "register ne s'utilise pas comme ça, relis le message d'accueil attentivement, demande de l'aide à un admin, ou tape `+aled` pour une description plus détaillée";
    if (arguments.length < 2) {
      message.channel.send(error_message);
      return;
    } else {
      if (arguments[0] != "membre" && arguments[0] != "ami") {
        message.channel.send(error_message);
        return;
      } else {
        // if the noob is a member
        if (arguments[0] === "membre" && arguments[2] != "") {
          let new_member = client.guilds.get('539794635283890186').member(message.author.id) 
          let guilde = message.guild.roles.get(arguments[1].replace(/\W/g, ''))
          let role_membre = message.guild.roles.get('743400636845916230')
          let pseudo = arguments[2];
          let bot_message = message;
          const channel_verif = client.channels.get(`743393443463823411`);
          channel_verif
            .send(
              pseudo +
                " de la guilde " +
                guilde +
                " vient d'arriver sur le discord.\n" +
                "Accepter : 🤘🏼\n" +
                "Refuser : 🚫\n"
            )
            .then(function (message) {
              message.react("🤘🏼").then(() => message.react("🚫"));
              bot_message = message;
            });

          client.on("messageReactionAdd", (messageReaction, user) => {
            if (user.bot) return;
            const { message, emoji } = messageReaction;

            if (emoji.name === "🤘🏼" && message.id === bot_message.id) {            
              let meneur = client.guilds.get('539794635283890186').member(user.id)
              if (meneur.roles.has(guilde.id)) {
                new_member.addRole(guilde).catch(console.error);
                new_member.addRole(role_membre).catch(console.error);
                new_member.setNickname(pseudo)
                message.channel.send("Les rôles ont été correctement ajoutés")
              } else {
                message.channel.send("Tu n'es pas le meneur de " + pseudo + ". Seul le meneur de guilde peut donner les droits aux nouveaux.")
              }
            }
          });
        }
      }
    }
  }

  /** Help command */
  if (primaryCommand == "aled") {
    if (arguments.length > 0) {
      message.channel.send(
        "TODO -> faire des commandes d'aide personnalisées :thinking:"
      );
    } else {
      const cmd_list = new RichEmbed()
        //header
        .setColor("#800000")
        .setTitle("Liste des commandes")
        .setThumbnail(
          "https://images.emojiterra.com/google/android-pie/512px/2699.png"
        )

        //content
        .addField("aled", "Commande d'aide", false);
      message.channel.send(cmd_list);
    }
  }
}

//when someone slide into the server
Welcome(client, {
  "539794635283890186": {
    publicmsg:
      "Bienvenue @MEMBER sur le discord de l'alliance TOP. Afin de finaliser ton adhésion au serveur, je vais te demander de t'identifier.\n" +
      "entre la commande correspondant à ton cas tel que présenté ci-dessous :\n\n" +
      "__Si tu es un membre de l'alliance :__\n" +
      "`+register membre @ta_guilde ton_pseudo_in_game` *(N'oublie pas de bien taguer ta guilde et de prévenir ton meneur pour qu'il t'accepte rapidement)*\n\n" +
      "__Si tu es un ami de l'alliance :__\n" +
      "`+register ami ton_pseudo_in_game`\n\n" +
      "Si vraiment tu as du mal ou si tu ne comprends pas, tu peux demander l'aide d'un admin ou taper `+aled` pour afficher l'aide\n" +
      "à bientôt\n" +
      "PAK le Bot",
    publicchannel: "743393331677233172",
  },
});

// Client events to let you know if the bot is online and to handle any Discord.js errors
client.on("ready", () => {
  console.log("Connected as " + client.user.tag);
  // activity types can be : PLAYING, STREAMING, LISTENING, WATCHING
  client.user.setActivity("Pornhub", {
    type: "WATCHING",
  });
});
client.on("error", console.error);

client.on("message", (message) => {
  // Make sure bots can't run this command
  if (message.author.bot) return;

  // Make sure the command can only be ran in a server
  if (!message.guild) return;

  // if the message starts with +, exectute the 'processCommand' function
  if (message.content.startsWith("+")) {
    processCommand(message);
  }

  // We don't want the bot to do anything further if it can't send messages in the channel
  if (
    message.guild &&
    !message.channel.permissionsFor(message.guild.me).missing("SEND_MESSAGES")
  )
    return;
});
