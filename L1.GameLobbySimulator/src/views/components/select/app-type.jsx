import React from "react";

export default class AppType extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      name: "AppType",
      type: "int",
      options: [
        { value: 1, name: "Saba.Club" },
        { value: 2, name: "Saba Mobi" },
        { value: 3, name: "Mini Saba.Club" },
      ],
    };
  }

  handleChange(event) {
    this.props.onChange({ appType: event.target.value });
  }

  render() {
    const { value } = this.props;
    return this.state.options.map((type) => (
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
    ));
  }
}
