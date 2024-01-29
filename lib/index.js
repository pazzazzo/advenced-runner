const fs = require("fs")
const error = require("./Error")
const CLI = require("./CLI")
const Executor = require("./Executor")

module.exports = function () {
    const [node_path, module_file_path, action, ...args] = process.argv
const file_path = process.cwd()

const scripts = []

switch (action) {
    case "start":
        startCheck()
        break;
    case "list":
        list()
        break;
    default:
        console.log("please use command " + "ar start ".cyan + "file_name.js".yellow);
        break;
}

function startCheck() {
    let file_name = args[0]
    if (!file_name) {
        error("No file specified! (Use command '" + "ar start ".cyan + "file_name.js".yellow + "')")
    } else if (!fs.existsSync(file_path + "/" + file_name)) {
        if (fs.existsSync(file_path + "/" + file_name + ".js")) {
            start(file_name)
        } else {
            error("File does not exist! (The file " + file_path + "\\" + file_name.yellow + " is not found)")
        }
    } else {
        start(file_name)
    }
}

function start(file_name = "") {
    scripts.push(file_name)
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
    script.on("out", (data) => { //Connect script log to cli
        data = data.replace(/\n$/, "").replace(/\n/g, "\n" + `[${file_name}]`.green + ": ")
        cli.log(`[${file_name}]`.green + `: ${data}`)
    })
    script.on("err", (data) => { //Connect script log to cli
        data = data.replace(/\n$/, "").replace(/\n/g, "\n" + `[${file_name}]`.red + ": ")
        cli.log(`[${file_name}]`.red + `: ${data}`)
    })
    script.on("exit", (id) => {
        let data = `Application crashed with code: ${id}`
        cli.log(`[${file_name}]`.red + `: ${data}`)
    })
    cli.on("input", (data) => { //Connect cli input to script
        script.write(data)
    })
    script.on("usage", (usage) => {
        if (usage) {
            cli.process([
                "CPU:    " + usage.cpu + "%",
                "RAM:    " + `${Math.round(usage.memory / 1024 / 1024 * 100) / 100}MB`
            ])
        }
    })
}

function list() {
    console.log(scripts);
}
}