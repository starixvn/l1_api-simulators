import React from "react";
import Axios from "axios";

export default class Partner extends React.Component {
  constructor() {
    super();

    this.state = {
      partners: [],
    };
  }

  componentDidMount() {
    Axios.get("/resource/partner")
      .then((data) => data.data)
      .then((partners) => this.setState({ partners }));
  }

  render() {
    return (
      <div className="section">
        <div className="row">
          <div className="col-sm-12">
            <fieldset className="container">
              <legend>Partners</legend>
              <ul>
                {this.state.partners.map((partner) => {
                  return (
                    <li key={partner.value}>
                      {`${partner.name}`}
                      <pre>{JSON.stringify(partner.data, null, 2)}</pre>
                    </li>
                  );
                })}
              </ul>
            </fieldset>
          </div>
        </div>
      </div>
    );
  }
}
