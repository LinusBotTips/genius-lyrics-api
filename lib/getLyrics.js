const searchSong = require('./searchSong');
const checkOptions = require('./checkOptions');
const extractLyrics = require('./extractLyrics');

/**
 * @param {({apiKey: string, title: string, artist: string, optimizeQuery: boolean}|string)} arg - options object, or Genius URL
 * @param {boolean} randomLine
 */
module.exports = async function (arg, randomLine) {
    try {
        if (arg && typeof arg === 'string') {
            let lyrics = await extractLyrics(arg);
            return lyrics;
        } else if (typeof arg === 'object') {
            checkOptions(arg);
            let results = await searchSong(arg);
            if (!results) return null;
            let lyrics = await extractLyrics(results[0].url);
            if (!randomLine) return lyrics;
            let filtered = []
            lyrics.split(/\r?\n/).forEach(line => {
                if(line.includes("(") || line.includes("[") || line.length < 15) return
                filtered.push(line)
            });
            return filtered[Math.floor(Math.random() * filtered.length)]
        } else {
            throw 'Invalid argument';
        }
    } catch (e) {
        throw e;
    }
};
