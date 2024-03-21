import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

app.use(cors());
app.use(bodyParser.json()); 

app.get("/", (req, res) => {
  res.send("Hello from server");
});

app.post('/getcityfromcoord', async (req, res) => {
    const apiUrl = req.body.url;
    const header = req.body.header;
    const api = req.body.api;
    try{
        const apiResponse = await fetch(apiUrl, {
            headers: {
                "X-Api-Key":`${api}`
            }
        });
        const data = await apiResponse.json();
        res.json(data); 
    }
    catch(err)
    {
        res.json({
            status: 'error',
            message: err.message
        })
    }
})

app.listen(3001, () => {
  console.log("server is listening on 3001");
});
