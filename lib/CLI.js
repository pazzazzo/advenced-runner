const blessed = require("blessed")
const EventEmitter = require("events").EventEmitter

module.exports = class extends EventEmitter {
    constructor (file_path, file_name) {
        super()
        this.file_path = file_path
        this.file_name = file_name
        this.screen = blessed.screen({
            smartCSR: true,
            title: "Advenced runner - " + this.file_name
        })
        this.boxs = {}
    }
    log(text = "") {
        if ( this.boxs["log"] && this.boxs["loginput"]) {
            this.boxs["log"].add(text)
        }
        return this
    }
    process(lines = []) {
        if (this.boxs["process"]) {
            lines.forEach((line, i) => {
                this.boxs["process"].setLine(i, line)
            });
        }
    }
    script(lines = []) {
        if (this.boxs["script"]) {
            lines.forEach((line, i) => {
                this.boxs["script"].setLine(i, line)
            });
        }
    }
    init() {
        this.boxs["logcontainer"] = blessed.form({
            parent: this.screen,
            label: "logs",
            top: "top",
            left: "left",
            width: '60%',
            height: '100%-8',
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
        })
        this.boxs["log"] = blessed.log({
            parent: this.boxs["logcontainer"],
            top: 0,
            left: "left",
            width: "100%-2",
            height: "100%-5",
            border: {
                type: 'line'
            },
            style: {
                fg: 'white',
                border: {
                    fg: '#00ff00'
                }
            },
        })
        this.boxs["loginput"] = blessed.textbox({
            parent: this.boxs["logcontainer"],
            bottom: 0,
            left: "left",
            width: "100%-2",
            input: true,
            keys: true,
            mouse: true,
            inputOnFocus: true,
            height: 3,
            border: {
                type: 'line'
            },
            style: {
                fg: 'white',
                border: {
                    fg: '#00ff00'
                }
            },
        })
        this.boxs["process"] = blessed.box({
            parent: this.screen,
            label: "process",
            bottom: 0,
            left: 0,
            width: "40%",
            height: 8,
            border: {
                type: 'line'
            },
            style: {
                fg: 'white',
                border: {
                    fg: '#0ffff0'
                }
            },
        })
        this.boxs["script"] = blessed.box({
            parent: this.screen,
            label: "script",
            tom: 0,
            right: 0,
            width: "40%",
            height: 8,
            border: {
                type: 'line'
            },
            style: {
                fg: 'white',
                border: {
                    fg: '#0ffff0'
                }
            },
        })
        this.boxs["loginput"].focus()
        this.boxs["loginput"].on('submit', (text) => {
            this.boxs["log"].add(text)
            this.boxs["loginput"].clearValue();
            this.boxs["loginput"].focus()
            this.emit("input", text)
        });
        this.screen.key(['escape', 'q', 'C-c'], function(ch, key) {
          return process.exit(0)
        });
        return this
    }
    start() {
        this.screen.render()
        setInterval(() => {
            this.screen.render()
        }, 100);
        return this
    }
}