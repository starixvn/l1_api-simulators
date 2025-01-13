import React, { Component } from "react";

export default class Direct extends Component {
    render() {
        const params = new URLSearchParams(window.location.search);
        const iframeSrc = params.get("redirectUrl");

        return (
            <>
                <style>
                    {`
                        .direct-container {
                            height: 100dvh;
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
