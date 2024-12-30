const util = require("util");

module.exports = {
  autoRead: true,
  react: "👍",
  presence: "composing",
  onlyOwner: true,
  cmds: ["eval"],
  handle: (ctx, m) => {
    function Return(sul) {
      let sat = JSON.stringify(sul, null, 2);
      let bang = util.format(sat);
      if (sat === undefined) {
        bang = util.format(sul);
      }
      return m.reply(bang);
    }

    try {
      const result = eval(`(async () => { return ${m.args} })()`);
      m.reply(util.format(result));
    } catch (e) {
      m.reply(String(e));
    }
  }
};