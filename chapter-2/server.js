const express = require('express');
const app = express();
const PORT = 8383;
app.get('/', (req, res) => {
    console.log(req ,"req");
    console.log(res, "res");
    res.json({
        name: "Amogha",
    });
});

app.get('/html', (req, res) => {
    res.send(`<html>
        <head>
            <style>
                h1{
                 color:red
                }
            </style>
            <script>
            function onClick(){
            alert("Button has been clicked");
            }
            </script>
        </head>
        <body>
        <h1>
        This is a h1 html tag
        </h1>
        <p>paragraph,</p>
        <marquee>This is crazy</marquee>
        <button onclick="onClick()">Please Click me </button>
        </body>
        </html>`);
});

app.post('/data', (req, res) => {
    const { body } =  req;
    console.log(body);
    res.sendStatus(201);
});

app.listen(PORT, () => {
    console.log(`Server has started on: ${PORT}`);
});