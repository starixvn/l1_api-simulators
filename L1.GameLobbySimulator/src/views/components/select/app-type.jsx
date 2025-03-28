import React from "react";
import config from "../../../game-client-config.json";

const appSelectorConfig = {
    name: "AppType",
    type: "int",
    options: [
        { value: 1, name: "Saba.Club" },
        { value: 2, name: "Saba Mobi" },
        { value: 3, name: "Mini Saba.Club" },
        { value: 4, name: "Mega Keno" },
        { value: 7, name: "Mobile Direct" },
        { value: 6, name: "Live Page" },
    ],
    instantModes: [
        { value: 1, name: "Portrait" },
        { value: 2, name: "Landscape" }
    ]
};

export default class AppType extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleInstantModeChange = this.handleInstantModeChange.bind(this);
    }

    openLivePage() {
       window.open(config.livePageUrl, '_blank');
    }

    handleChange(data) {
        this.props.onChange(data);

        if (data.appType === 6) {
            this.openLivePage();
        }
    }

    handleInstantModeChange(event) {
        this.props.onChange({ instantMode: parseInt(event.target.value) });
    }

    render() {
        const { value, id, instantMode, isOpenOnIframe } = this.props;

        return (
            <div className="input-group vertical">
                <label>App Type</label>
                <div>
                    {appSelectorConfig.options.map((option) => (
                        option.value === 6 ? (
                            <div className="input-group" key={option.value}>
                                <button
                                    type="button"
                                    className="live-page-button"
                                    onClick={() => this.handleChange({ appType: option.value })}
                                >
                                    {option.name}
                                </button>
                            </div>
                        ) : (
                            <div className="input-group" key={option.value}>
                                <input
                                    type="radio"
                                    id={option.value}
                                    name="appType"
                                    value={option.value}
                                    onChange={() => this.handleChange({ appType: option.value })}
                                    checked={option.value === value}
                                />
                                <label htmlFor={option.value}>{option.name}</label>
                            </div>
                        )
                    ))}

                    <div>
                        {(value === 3 || isOpenOnIframe) &&
                            appSelectorConfig.instantModes.map((mode) => (
                                <div className="input-group" key={mode.value}>
                                    <input
                                        id={`${mode.value}${mode.name}`}
                                        type="radio"
                                        name="instant-mode"
                                        value={mode.value}
                                        onChange={this.handleInstantModeChange}
                                        checked={mode.value === instantMode}
                                    />
                                    <label htmlFor={`${mode.value}${mode.name}`}>{mode.name}</label>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        );
    }
}
