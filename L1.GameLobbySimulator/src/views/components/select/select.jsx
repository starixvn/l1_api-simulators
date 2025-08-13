import React from "react";

export default class Select extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);

    this.state = {
      searchTerm: ""
    };
  }

  handleChange(event) {
    let value = null;

    if (event.target.attributes.getNamedItem("type").value === "number") {
      if (this.props.type === "float") {
        value = parseFloat(event.target.value);
      } else {
        value = parseInt(event.target.value);
      }
    } else {
      value = event.target.value;
    }

    const data = { [this.props.id]: value };

    this.props.onChange(data);
  }

  handleSearchChange(event) {
    const searchTerm = event.target.value;
    this.setState({ searchTerm }, () => {
      if (!this.props.searchable) return;

      const normalizedSearch = (searchTerm || "").toLowerCase();
      const filteredOptions = this.props.options.filter(option => (option.name || "").toLowerCase().includes(normalizedSearch));

      if (!normalizedSearch) return;

      // Always select the first filtered option when typing
      const selectedOption = filteredOptions.length > 0 ? filteredOptions[0] : null;

      if (selectedOption) {
        const rawValue = selectedOption.value != null ? selectedOption.value : selectedOption.id;
        let parsedValue = rawValue;
        if (this.props.type === "float") {
          parsedValue = parseFloat(rawValue);
        } else if (this.props.type === "int") {
          parsedValue = parseInt(rawValue, 10);
        }
        this.props.onChange({ [this.props.id]: parsedValue });
      }
    });
  }


  getType(typeName) {
    if (typeName === "int" || typeName === "float") {
      return "number";
    }

    return typeName;
  }

  render() {
    const { id, name, value, type, options, searchable } = this.props;
    const { searchTerm } = this.state;

    const normalizedSearch = (searchTerm || "").toLowerCase();
    const filteredOptions = searchable
      ? options.filter(option => (option.name || "").toLowerCase().includes(normalizedSearch))
      : options;
    return (
      <div className="input-group vertical">
        <label htmlFor={id}>{name}</label>
        {searchable && (
          <input
            className="input"
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={this.handleSearchChange}
          />
        )}
        <select
          className="input"
          type={this.getType(type)}
          id={id}
          onChange={event => this.handleChange(event)}
          value={value}
        >
          {filteredOptions.map(option => (
            <option value={option.value || option.id} key={option.value || option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    );
  }
}
