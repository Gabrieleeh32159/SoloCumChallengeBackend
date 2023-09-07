import express from "express";
import morgan from "morgan";

const app = express();

app.use(morgan('dev'));

// Some constants

const RIOT_KEY = "RGAPI-64864bd1-91a7-44db-88f9-b4c83fc898db"
const SUMMONER_PATH = "https://la1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"
const RANKED_PATH =  "https://la1.api.riotgames.com/lol/league/v4/entries/by-summoner/"
const SOLOQ = "RANKED_SOLO_5x5"

app.get('/rank', (req, res) => {
    const username = req.query.username;
    fetch(SUMMONER_PATH + username, {
        method: "GET",
        headers: {
            "X-Riot-Token": RIOT_KEY,
            "Content-Type": "application/json"
        }
    }).then(response => {
        return response.json()
    }).then(data => {
        fetch(RANKED_PATH + data["id"], {
            method: "GET",
            headers: {
                "X-Riot-Token": RIOT_KEY,
                "Content-Type": "application/json"
            }
        }).then(response => {
            return response.json()
        }).then(data2 => {
            const queue = data2.filter(element => element["queueType"] == SOLOQ)
            res.json(queue)
        })
    })
})

const PORT = 3000;

app.listen(PORT)
console.log(`Running server on port ${PORT}`)