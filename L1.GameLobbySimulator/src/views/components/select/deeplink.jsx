import React from "react";
import Select from "./select.jsx";
import Axios from "axios";

export default class DeepLink extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            name: "Deep Link",
            type: "text",
            options: []
        };
    }

    handleChange(data) {
        this.props.onChange(data);
    }

    componentDidMount() {
        Axios.get("/resource/deeplink")
            .then((data) => data.data)
            .then(({ urls }) => this.setState({ options: urls.map((url) => ({ value: url, name: url })) }));
    }

    render() {
        const { value, id } = this.props;
        return <Select {...this.state} id={id} value={value} onChange={this.handleChange} />;
    }
}
