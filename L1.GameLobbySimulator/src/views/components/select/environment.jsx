import React from "react";
import { SC1GameLobbyURLMapper, VG2GameLobbyURLMapper } from "../../constants/lobby-url";
import config from "../../../game-client-config.json";

export default class Environment extends React.Component {
    handleChange(data) {
        const url = `${data}signin?obCustId=${this.props.playerId}&appType=${this.props.appType}`;
        window.location.replace(url);
    }

    getOptions = (URLMapper) => {
        return Object.keys(URLMapper).map((env, index) => (
            <option value={URLMapper[env]} key={index}>
                {env}
            </option>
        ));
    };

    render() {
        const url = window.location.host;
        const URLMapper = config.systemType === "SC1" ? SC1GameLobbyURLMapper : VG2GameLobbyURLMapper;
        const currentEnv = Object.values(URLMapper).find((value) => value.includes(url));

        return (
            <select className="input" type="string" id="env" onChange={(event) => this.handleChange(event.target.value)} value={currentEnv}>
                {this.getOptions(URLMapper)}
            </select>
        );
    }
}
