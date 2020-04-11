import React from "react";
import Axios from "axios";
import { randomString, showAlert } from "../util.jsx";
import Input from "../components/input.jsx";

export default class LoginWithOW extends React.Component {
    constructor() {
        super();

        this.state = {
            memberId: (Math.random() * 10000000) >> 0,
            memberName: randomString(8),
            language: "vi-VN",
            currency: "$US",
            seq: "d8382c1d-6ce0-433d-9233-e7358b10a70b",
            siteId: "4100300",
            ip: "",
            browserUserAgent: navigator.userAgent,
            auth: {
                clientId: "gamesimulator",
                clientSecret: "gamesimulator@20luminet&"
            },
            gameId: 1,
            setting: {
                owUrl: ''
            },
            domain: 'example.com'
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(data) {
        this.setState(data);
    }

    handleSubmit(event) {
        const request = Object.assign({}, this.state, {
            token: null,
            verifyResult: null,
            resource: null
        });
        Axios.post("/signin/sso", request)
            .then(data => data.data)
            .then(data => (data.error ? Promise.reject(data.error) : data))
            .then(token => {
                window.location.replace(token.redirectUrl);
            })
            .catch(showAlert);

        event.preventDefault();
    }

    async componentDidMount() {
        const data = await Axios.get("/setting/data").then(data => data.data);
        const ip = await Axios.get("/signin/ip", { timeout: 10000 }).then(data => data.data);

        this.setState({ setting: data, ip });
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <form onSubmit={event => this.handleSubmit(event)} className="col-sm-12">
                        <fieldset className="container">
                            <legend>Login</legend>
                            <Input
                                type="int"
                                id="memberId"
                                name="Member ID"
                                value={this.state.memberId}
                                onChange={this.handleInputChange}
                            />
                            <Input
                                type="text"
                                id="memberName"
                                name="Member Username"
                                value={this.state.memberName}
                                onChange={this.handleInputChange}
                            />
                            <input className="primary" type="submit" value="Login" />
                        </fieldset>
                    </form>
                </div>
            </div>
        );
    }
}
