import React, { Component } from "react";

export default class IframeGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isClassic: true
        };
    }

    render() {
        const IFRAME_URL = "iframeUrl";

        const params = new URLSearchParams(window.location.search);
        const iframeSrc = params.get(IFRAME_URL);

        return (
            <>
                <style>
                    {`
                        html, body, #app {
                            height: 100%;
                        }

                        body {
                            height: 100%;
                            position: fixed;
                            overflow: hidden;
                            width: 100%;
                            margin: 0px;
                            padding: 0px;
                        }
                        .iframe-container {
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            max-width: 100vw;
                            max-height: 100vh;
                            overflow: hidden;
                            box-sizing: border-box;
                            padding: 0;
                            margin: 0;
                        }
                        #iframe-game {
                            border: none;
                            width: 100%;
                            height: 100%;
                            max-width: 100%;
                            max-height: 100%;
                            overflow: auto;
                            display: block;
                        }
                    `}
                </style>
                <div className="iframe-container">
                    <iframe
                        id="iframe-game"
                        className="iframe"
                        title={`Game`}
                        src={iframeSrc}
                        allow="clipboard-read; clipboard-write; fullscreen"
                        allowfullscreen
                    />
                </div>
            </>
        );
    }
}
