module.exports = {
    durationToMs: async(dur) =>{
        return dur.split(":").map(Number).reduce((acc, curr) => curr + acc * 60) * 1000;
    },
}