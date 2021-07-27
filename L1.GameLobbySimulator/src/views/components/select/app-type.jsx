import React from "react";
import Select from "./select.jsx";

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

  handleChange(data) {
    this.props.onChange(data);
  }

  render() {
    const { value, id } = this.props;
    return (
      <Select
        {...this.state}
        id={id}
        value={value}
        onChange={this.handleChange}
      />
    );
  }
}
