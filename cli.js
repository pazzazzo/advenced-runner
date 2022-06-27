#!/usr/bin/env node
const blessed = require("blessed")
const fs = require("fs")
const error = require("./lib/Error")
const exec = require("child_process").exec

const [node_path, module_file_path, file_name, ...args] = process.argv
const file_path = process.cwd()
if (!file_name) {
    error("No file specified! (Use command '" + "ar start ".cyan + "file_name.js".yellow + "')")
} else if (!fs.existsSync(file_path + "/" + file_name)) {
    if (fs.existsSync(file_path + "/" + file_name + ".js")) {
        error("File does not exist but the file " + file_path + "\\" + file_name.yellow + ".js".yellow + " is found, do you mean that?")
    } else {
        error("File does not exist! (The file " + file_path + "\\" + file_name.yellow + " is not found)")
    }
} else {
    let screen = blessed.screen({
        smartCSR: true
    })
    let boxs = {}
    boxs["log"] = blessed.box({
        label: "logs",
        top: "top",
        left: "left",
        width: '60%',
        height: '80%',
        content: '',
        tags: true,
        border: {
            type: 'line'
        },
        style: {
            fg: 'white',
            border: {
                fg: '#00ff00'
            }
        },
        alwaysScroll: true,
        scrollable: true,
    });
    for (const box in boxs) {
        screen.append(boxs[box])
    }
    screen.render()
    setInterval(() => {
        screen.render()
    }, 100);
    let script = exec("node " + file_path + "/" + file_name, (err, stdout, stderr) => {
        console.log("ok");
    })
    script.on("spawn", () => {

    })
    script.stdout.on("data", (data) => {
        boxs["log"].content = boxs["log"].content + data
    })
}
