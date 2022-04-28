import Select from "./select.jsx";
import React from "react";

const appSelectorConfig = {
  name: "AppType",
  type: "int",
  options: [
    { value: 1, name: "Saba.Club" },
    { value: 2, name: "Saba Mobi" },
    { value: 3, name: "Mini Saba.Club" },
  ],
    instantModes: [
      { value: 1, name: "Portrait" },
      { value: 2, name: "Landscape" },
    ],
};

export default class AppType extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleInstantModeChange = this.handleInstantModeChange.bind(this);
  }

  handleChange(data) {
    this.props.onChange(data);
  }

  handleInstantModeChange(event) {
    this.props.onChange({ instantMode: parseInt(event.target.value) });
  }
  
  render() {
    const { value,id, instantMode, isOpenOnIframe } = this.props;

    return<>
      <Select
        {...appSelectorConfig}
        id={id}
        value={value}
        onChange={this.handleChange}
      />
     {(value === 3 || isOpenOnIframe) &&
          appSelectorConfig.instantModes.map((mode) => (
            <div className="input-group">
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
      </>
  }
}
