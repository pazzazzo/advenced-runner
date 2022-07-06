const spawn = require("child_process").spawn
const EventEmitter = require("events").EventEmitter
const package = require("../package.json")
const pidusage = require('pidusage');

module.exports = class extends EventEmitter {
    constructor (path) {
        super()
        this.path = path
        this.child_process = undefined
        this.pid = undefined
        this.uptime = undefined
    }
    start() {
        this.child_process = spawn("node", [this.path])
        this.pid = this.child_process.pid
        this.child_process.on("spawn", () => {
            this.emit("started")
            this.uptime = new Date()
        })
        this.child_process.on("exit", (code, s) => {
            this.emit("exit", code)
        })
        this.child_process.on("close", (code, s) => {
            this.emit("close", code)
        })
        this.child_process.stdout.setEncoding("utf8")
        this.child_process.stdout.on("data", (data) => {
            this.emit("out", data)
        })
        this.child_process.stderr.setEncoding("utf8")
        this.child_process.stderr.on("data", (data) => {
            this.emit("err", data)
        })
        setInterval(() => {
            pidusage(this.child_process.pid, (err, stats) => {
                this.emit("usage", stats)
            })
        }, 1000);
        return this
    }
    write(text = "") {
        if (this.child_process && this.child_process.stdin.writable) {
            this.child_process.stdin.write(text)
        }
    }
}