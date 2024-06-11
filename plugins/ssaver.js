const { smd } = require("../lib");

// Save WhatsApp status
smd(
  {
    pattern: "save",
    desc: "Save whatsapp status",
    category: "whatsapp",
    filename: __filename,
    use: "< status >",
  },
  async (message) => {
    try {
      let mm =
        message.reply_message && message.reply_message.status
          ? message.reply_message
          : false;
      if (mm) {
        message.bot.forwardOrBroadCast(message.user, mm, {
          quoted: { key: mm.key, message: mm.message },
        });
      } else message.send("*reply to whatsapp status*");
    } catch (e) {
      await message.error(`${e}\n\ncommand : #(Status Saver)`, e, false);
    }
  }
);

const regexSend = new RegExp(
  `\\b(?:${["send", "share", "snd", "ewhan", "save", "ewana", "share", "ewanawako", "dpn", "save", "one", "oni", "මැසේජ්", "විමසීම", "අපෙ", "වෙ", "සුරකින්න", "හුවමාරු", "ගබඩා"].join(
    "|"
  )})\\b`,
  "i"
);

// Forward or Broadcast Based on Specific Keywords
smd({ on: "quoted" }, async (message, text) => {
  try {
    let mm = message.reply_message.status ? message.reply_message : false;
    if (mm && regexSend.test(text.toLowerCase())) {
      message.bot.forwardOrBroadCast(
        message.fromMe ? message.user : message.from,
        mm,
        { quoted: { key: mm.key, message: mm.message } }
      );
    }
  } catch (e) {
    console.log(e);
  }
});

// Global Presence and API Setup
global.waPresence =
  process.env.WAPRESENCE && process.env.WAPRESENCE === "online"
    ? "available"
    : process.env.WAPRESENCE || "";
global.api_smd = "https://api-smd.onrender.com";

// Main Event Handler
let status = false,
  times = 0;
smd({ on: "main" }, async (message, text, { icmd }) => {
  try {
    if (!status) {
      try {
        status = true;
      } catch (e) {}
    }

    if (message.status) return;
    if (
      `${global.readmessagefrom}`.includes(message.senderNum) ||
      ["yes", "true", "ok", "sure"].includes(global.readmessage) ||
      (icmd && ["yes", "true", "ok", "sure"].includes(global.readcmds))
    )
      message.bot.readMessages([message.key]);
  } catch (e) {
    console.log(e);
  }
});

// Text Event Handler
smd({ on: "text" }, async (message, text, { icmd }) => {
  try {
    if (
      ["unavailable", "available", "composing", "recording", "paused"].includes(
        waPresence
      )
    )
      message.bot.sendPresenceUpdate(waPresence, message.from);
    if (message.isAstro && !message.fromMe && !message.text.startsWith("$"))
      message.react("🤖");
  } catch (e) {
    console.log(e);
  }
});

// Status Event Handler
smd({ on: "status" }, async (message, text) => {
  try {
    if (
      `${global.read_status_from}`
        .split(",")
        .includes(message.key.participant.split("@")[0]) ||
      ["yes", "true", "ok", "sure"].includes(global.read_status) ||
      message.fromMe ||
      message.isAstro
    ) {
      await message.bot.readMessages([{ ...message.key, fromMe: false }]);
    }
    if (
      (`${global.save_status_from}`
        .split(",")
        .includes(message.key.participant.split("@")[0]) ||
        ["yes", "true", "ok", "sure"].includes(global.save_status)) &&
      !message.fromMe
    ) {
      await message.bot.forwardOrBroadCast(message.user, message, {
        quoted: { key: message.key, message: message.message },
      });
    }
  } catch (e) {
    console.log(e);
  }
});

// Command for User Count
smd(
  {
    cmdname: "wasiv2",
    desc: "total Users Currently using asta",
  },
  async (message, text) => {
    try {
      message.send(`An Estimated 120+ Users On Wasi-md-v2`.trim());
    } catch (e) {
      console.error("Error:", e);
      message.reply(`*ERROR!* `);
    }
  }
);
