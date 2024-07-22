const express = require('express');
const ytdl = require('ytdl-core');
const path = require('path');
const app = express();

app.use(express.static('public'));

app.get('/download', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('No URL provided');
    }

    try {
        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });
        
        if (!format) {
            return res.status(400).send('No suitable format found');
        }

        res.header('Content-Disposition', 'attachment; filename="video.mp4"');
        ytdl(url, { format: format }).pipe(res);
    } catch (error) {
        res.status(500).send('Error processing video');
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
