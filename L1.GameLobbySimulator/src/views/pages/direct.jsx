import React, { Component } from "react";

function updateUrlWithQuery() {
    const hrefDecoded = decodeURIComponent(globalThis.location?.href);
    const [baseUrl, queryString] = hrefDecoded ? hrefDecoded.split("?") : ["", ""];
    const fullUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;
    globalThis.history.pushState(null, "", fullUrl);
}

export default class Direct extends Component {
    render() {
        const REDIRECT_URL = "redirectUrl";
        const params = new URLSearchParams(window.location.search);
        const iframeSrc = params.get(REDIRECT_URL);

        updateUrlWithQuery();
        return (
            <>
                <style>
                    {`
                        html, body, #app {
                            height: 100%;
                        }

                        .direct-container {
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                        }
                        .header {
                            height: 76px;
                            background-color: #ccc;
                            flex-shrink: 0;
                        }
                        .direct {
                            flex: 1;
                            display: flex;
                        }
                        .footer {
                            height: 49px;
                            background-color: #ccc;
                            flex-shrink: 0;
                        }
                        .iframe {
                            width: 100%;
                            height: 100%;
                        }
                            
                    `}
                </style>
                <div className="direct-container">
                    <div className="header">Header</div>
                    <div className="direct">
                        <iframe className="iframe" title={`Game`} src={iframeSrc} />
                    </div>
                    <div className="footer">Footer</div>
                </div>
            </>
        );
    }
}
