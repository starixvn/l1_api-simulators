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
  }

  handleChange(data) {
    this.props.onChange(data);
  }
  
  render() {
    const { value,id } = this.props;

    return <Select
      {...appSelectorConfig}
      id={id}
      value={value}
      onChange={this.handleChange}
    />
  }
}
