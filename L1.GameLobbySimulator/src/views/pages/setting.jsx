import React from "react";
import GameClient from "../components/setting/game-client.jsx";
import Language from "../components/setting/language.jsx";
import Partner from "../components/setting/partner.jsx";

class SettingPage extends React.Component {
  render() {
    return (
      <div className="container">
        <GameClient />
        <Language />
        <Partner />
      </div>
    );
  }
}

export default SettingPage;
