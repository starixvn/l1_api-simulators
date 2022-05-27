import React from "react";

export default class AppType extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleInstantModeChange = this.handleInstantModeChange.bind(this);

    this.state = {
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
  }

  handleChange(event) {
    this.props.onChange({ appType: parseInt(event.target.value) });
  }

  handleInstantModeChange(event) {
    this.props.onChange({ instantMode: parseInt(event.target.value) });
  }

  render() {
    const { value, instantMode } = this.props;
    return (
      <>
        {this.state.options.map((type) => (
          <div className="input-group">
            <input
              type="radio"
              id={type.value}
              name="appType"
              value={type.value}
              onChange={this.handleChange}
              checked={type.value === value}
            />
            <label htmlFor={type.value}>{type.name}</label>
          </div>
        ))}
        {value === 3 &&
          this.state.instantModes.map((mode) => (
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
    );
  }
}
