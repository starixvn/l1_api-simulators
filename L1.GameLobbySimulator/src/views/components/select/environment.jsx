import React from "react";
import {
  SC1GameLobbyURLMapper,
  VG2GameLobbyURLMapper,
} from "../../constants/lobby-url";
import config from "../../../game-client-config.json";

export default class Environment extends React.Component {
  handleChange(data) {
    window.location.replace(data);
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
    const URLMapper =
      config.systemType === "SC1"
        ? SC1GameLobbyURLMapper
        : VG2GameLobbyURLMapper;
    const currentEnv = Object.keys(URLMapper).find((key) =>
      URLMapper[key].includes(url)
    );

    return (
      <select
        className="input"
        type="string"
        id="env"
        onChange={(event) => this.handleChange(event.target.value)}
        value={currentEnv}
      >
        {this.getOptions(URLMapper)}
      </select>
    );
  }
}
