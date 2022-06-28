#!/usr/bin/env node

const fs = require("fs")
const error = require("./lib/Error")
const CLI = require("./lib/CLI")
const Executor = require("./lib/Executor")

const [node_path, module_file_path, action, ...args] = process.argv
const file_path = process.cwd()


switch (action) {
    case "start":
        start()
        break;

    default:
        break;
}

function start() {
    let file_name = args[0]
    if (!file_name) {
        error("No file specified! (Use command '" + "ar start ".cyan + "file_name.js".yellow + "')")
    } else if (!fs.existsSync(file_path + "/" + file_name)) {
        if (fs.existsSync(file_path + "/" + file_name + ".js")) {
            error("File does not exist but the file " + file_path + "\\" + file_name.yellow + ".js".yellow + " is found, do you mean that?")
        } else {
            error("File does not exist! (The file " + file_path + "\\" + file_name.yellow + " is not found)")
        }
    } else {
        let script = new Executor(file_path + "/" + file_name).start()
        let cli = new CLI(file_path, file_name).init().start()
        script.once("started", () => {
            cli.log("[ar]".green + ": " + "Application started successfully")
            cli.script([
                "file: " + file_name,
                "path: " + file_path,
                "pid: " + script.pid
            ])
        })
        script.on("data", (data) => { //Connect script log to cli
            data = data.replace(/\n$/, "")
            cli.log(`[${file_name}]`.green + `: ${data}`)
        })
        cli.on("input", (data) => { //Connect cli input to script
            script.write(data)
        })
        script.on("usage", (usage) => {
            cli.process([
                "CPU:    " + usage.cpu + "%",
                "RAM:    " + `${Math.round(usage.memory / 1024 / 1024 * 100) / 100}MB`
            ])
        })
    }
}