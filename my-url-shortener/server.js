const express = require('express');
const mongoose = require('mongoose');
const shortId = require('shortid');
const app = express();


mongoose.connect('mongodb://127.0.0.1:27017/urlShortener');


const urlSchema = new mongoose.Schema({
    full: { type: String, required: true },
    short: { type: String, required: true, default: shortId.generate },
    clicks: { type: Number, required: true, default: 0 }
});
const Url = mongoose.model('Url', urlSchema);


app.set('view engine', 'ejs'); 
app.use(express.urlencoded({ extended: false })); 


app.get('/', async (req, res) => {
    
    const allUrls = await Url.find();
    
    res.render('index', { urls: allUrls });
});


app.post('/shortUrls', async (req, res) => {
    
    await Url.create({ full: req.body.fullUrl });
    
    
    res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
    
    const url = await Url.findOne({ short: req.params.shortUrl });
    
    
    if (url == null) return res.sendStatus(404);

  
    url.clicks++;
    url.save();

    
    res.redirect(url.full);
});


app.listen(5000, () => {
    console.log(' Server is running! Open http://localhost:5000 in your browser.');
});