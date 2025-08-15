const express = require("express");
const router = express.Router();
const GameClient = require("l1.client.node-js")();
const axios = require("axios");

router.post("/signin/sso", async (req, res) => {
    try {
        const gameId = req.body.gameId;
        const result = await GameClient.auth.singleSignOn(req.body);
        const url = new URL(result.redirectUrl);
        const token = url.searchParams.get("token");

        res.send({ token, redirectUrl: `${result.redirectUrl}&gameId=${gameId}` });
    } catch (error) {
        res.send({ error });
    }
});

router.post("/signin/verify", async (req, res) => {
    try {
        const result = await GameClient.auth.verifyToken(req.body);

        res.send(result);
    } catch (error) {
        res.send({ error });
    }
});

router.get("/signin/ip", (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    res.send(ip);
});

router.get("/signin/direct", async (req, res) => {
    try {
        // Set default balance configuration
        const SIMULATOR_BASE_URL = "http://sp-hd-ow-api-simulator-uat-service:5000";
        const DEFAULT_BALANCE = 20000;

        const randomPlayerId = Math.floor(Math.random() * 9000000) + 1000000; // Generate 7-digit random number

        // Get gameId from query params, checking both cases
        const gameId = req.query.gameId || req.query.gameid;

        if (!gameId) {
            return res.status(400).send({ error: "gameId is required" });
        }

        // Validate gameId is a number
        if (isNaN(gameId)) {
            return res.status(400).send({ error: "gameId must be a number" });
        }

        //Set default balance before proceeding
        try {
            const params = new URLSearchParams({
                playerId: randomPlayerId,
                operator: "ow",
                balance: DEFAULT_BALANCE,
                systemType: "HD",
                username: `username_${randomPlayerId}`,
                currency: "$US",
                siteId: "4100300"
            });

            await axios.post(`${SIMULATOR_BASE_URL}/SabaClub/SetDefaultBalance?${params.toString()}`);
        } catch (balanceError) {
            console.error("Failed to set default balance:", balanceError);
            // Continue with sign-in even if balance setting fails
        }

        const ssoParams = {
            playerId: randomPlayerId.toString(),
            playerName: `username_${randomPlayerId}`,
            language: "en-US",
            currency: "$US",
            seq: "d,y,lumi",
            siteId: "4100300",
            siteName: "lumi",
            ip: "202.78.231.34, 10.254.5.203",
            browserUserAgent: req.headers["user-agent"],
            auth: { operatorId: "ONEworks1", operatorSecret: "ONEworks1@20luminet&" },
            redirectUrl:
                "https://hdsit.sgamesuat.com/?token=c75d82e4-b0e6-4e16-8712-3622aaee0316&lang=vi-VN&ref=m_direct&op=sg&cg=GrUSD&gameId=1001",
            gameId: gameId,
            setting: {
                evn: "SIT",
                systemType: "HD",
                apiUrl: "http://sp_hd_sg_api_sit:5000",
                authUrl: "http://sp_hd_auth_api_sit:5000",
                client: { id: "game-server", secret: "gameserver@20luminet&" },
                expireIn: 1737338249,
                useAuthenticate: true,
                requestTimeout: 10000,
                owUrl: "https://hdsitow.sgamesuat.com/SabaClub",
                localhost: "http://localhost:7456",
                mobileLocalhost: "http://localhost:3000",
                port: 5000,
                enableCors: true,
                corsUrls: ["https://www.saba.games/"]
            },
            domain: "example.com",
            isOpenOnIframe: false,
            appType: 1,
            isCash: true,
            partner: "1W",
            disableJackpotGames: false,
            expandAdvanceSetting: false,
            instantMode: 1,
            devIp: null,
            operatorToken: "SabaPlay_HDToken",
            setDefaultBalance: false,
            ref: "m_direct",
            deeplink: "https://4qwcm.test-app.link/pPv9z8d27ub/?uri=undefined",
            isApp: false,
            returnUrl: "",
            disableAward: false
        };

        const result = await GameClient.auth.singleSignOn(ssoParams);

        // Remove existing gameId parameter if present and append new one
        const baseUrl = result.redirectUrl.replace(/[?&]gameId=[^&]+/gi, "");
        const separator = baseUrl.includes("?") ? "&" : "?";
        const redirectUrl = `${baseUrl}${separator}gameId=${gameId}`;

        res.redirect(redirectUrl + `&ref=m_direct&op=sg&cg=GrUSD`);
    } catch (error) {
        res.send({ error });
    }
});

module.exports = router;
