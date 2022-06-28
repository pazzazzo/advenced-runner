console.log("hey");
let i = 0
setInterval(() => {
    i++
    console.log("hey " + i);
}, 1000);

process.stdin.on("data", (data) => {
    console.log("new Message! (" + data + ")");
})