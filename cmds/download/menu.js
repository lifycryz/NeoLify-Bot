const getDate = require("../../utils/getDate")
const getTime = require("../../utils/getTime")

module.exports = {
  autoRead: true,
  react: "👍",
  presence: "composing",
  onlyOwner: false,
  cmds: ["downloadmenu"],
  handle: (ctx, m) => {
    ctx.sendMenu(m.id, `*\`[ INFO BOT]\`*
> *Owner:* ${owner.name}
> *Status:* ${global.dev}
> *zona Waktu:* ${global.timezone}
> *Tanggal:* ${getDate()}
> *Waktu:* ${getTime()}\n

▧ S U B  M E N U
│ • .tiktok #link
└───···
    `)
  },
};
