import React from "react";
import GameLobbyURLMapper from '../../constants/lobby-url';

const options = Object.keys(GameLobbyURLMapper).map((env) => ({value: GameLobbyURLMapper[env], name: env}));

export default class Environment extends React.Component {
  handleChange(data) {
    window.location.replace(data)
  }


  render() {
    const url = window.location.host;
    const currentEnv = Object.keys(GameLobbyURLMapper).find(key => GameLobbyURLMapper[key].includes(url));

    return (
      <select
          className="input"
          type="string"
          id="env"
          onChange={event => this.handleChange(event.target.value)}
          value={currentEnv}
        >
          {options.map(option => (
            <option value={option.value} key={option.value}>
              {option.name}
            </option>
          ))}
        </select>
    );
  }
}
