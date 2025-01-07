import React from "react";
import Select from "./select.jsx";
import Axios from "axios";
import config from "../../../game-client-config.json";
import { getGamesBySystem } from "./game-list.js";
import { SC1GameConfigurationURLMapper, VG2GameConfigurationURLMapper } from "../../constants/game-configuration-url.js";

const IsSystemTypeSC1 = () => {
    return config.systemType === "SC1";
};

const IsTheRestSystems = () => {
    return config.systemType !== "SC1" && config.systemType !== "VG2";
};

export default class Game extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            name: "Game",
            type: "int",
            options: [],
            setting: {}
        };
    }

    handleChange(data) {
        this.props.onChange(data);
    }

    async componentDidMount() {
        await Axios.get("/setting/data")
            .then((data) => data.data)
            .then((setting) => this.setState({ setting }));
        const { setting } = this.state;

        if (IsTheRestSystems()) {
            // Use getGamesBySystem to get games based on system type
            const systemType = config.systemType;
            const gameOptions = getGamesBySystem(systemType);
            this.setState({ options: gameOptions });
            return;
        }

        const url = IsSystemTypeSC1() ? SC1GameConfigurationURLMapper[setting.evn] : VG2GameConfigurationURLMapper[setting.evn];
        await Axios.get(url)
            .then((data) => data.data)
            .then((options) => this.setState({ options }));
    }

    render() {
        const { value, id } = this.props;
        return <Select {...this.state} id={id} value={value} onChange={this.handleChange} />;
    }
}
