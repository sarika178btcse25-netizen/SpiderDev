const express = require('express');
const mongoose = require('mongoose');
const shortId = require('shortid');
const cors = require('cors'); 
const app = express();


mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/urlShortener');


app.use(cors()); 
app.use(express.json()); 

const urlSchema = new mongoose.Schema({
    full: { type: String, required: true },
    short: { type: String, required: true, default: shortId.generate },
    clicks: { type: Number, required: true, default: 0 }
});
const Url = mongoose.model('Url', urlSchema);

app.get('/api/urls', async (req, res) => {
    const allUrls = await Url.find();
    res.json(allUrls); 
});

app.post('/api/shortUrls', async (req, res) => {
    const newUrl = await Url.create({ full: req.body.fullUrl });
    res.json(newUrl); 
});

app.get('/:shortUrl', async (req, res) => {
    const url = await Url.findOne({ short: req.params.shortUrl });
    if (url == null) return res.sendStatus(404);

    url.clicks++;
    url.save();
    res.redirect(url.full);
});

app.listen(process.env.PORT || 5000, () => {
    console.log(' Backend API running');
});