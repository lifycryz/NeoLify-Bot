(function start() {
  const { coloredLog } = require("./utils/colors")
  const { say } = require("cfonts")
  
  say("NeoLify", {
    font: 'slick',
    gradient: ["blue", "magenta"]
  })
  coloredLog(`
=============================
==== SYSTEM INFORMATION  ====
=============================
== OWNER: cryptzx-dev     ===
== VERSION: 1.0.0         ===
== BAILEYS: latest        ===
== TYPE: commonJS         ===
== SINCE: 30 Desember 2024===
=============================`, 'yellow')
  const child = require("child_process")
    .spawn("node", ["main.js", ...process.argv.slice(2)], {
      stdio: ["inherit", "inherit", "inherit", "ipc"],
    })
    .on("message", (msg) => {
      if (msg === "restart") {
        child.kill();
        start();
        delete child;
      }
    })
    .on("close", (code) => {
      if (!(code == null)) {
        child.kill();
        start();
        delete child;
      }
    })
    .on("error", (err) => console.log(err.message));
})();
