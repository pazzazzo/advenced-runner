console.log("hey");
let i = 0
setInterval(() => {
    i++
    console.log("hey " + i);
}, 1000);
setTimeout(() => {
    console.error("erreur", 5)
    console.warn("warn", 5)
}, 2000);

process.stdin.on("data", (data) => {
    console.log("new Message! (" + data + ")");
})