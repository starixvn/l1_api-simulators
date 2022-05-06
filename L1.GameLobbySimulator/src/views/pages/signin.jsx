import Axios from "axios";
import React from "react";

import Input from "../components/input.jsx";
import AppType from "../components/select/app-type.jsx";
import GameSelect from "../components/select/game.jsx";
import LanguageSelect from "../components/select/language.jsx";
import { randomString, showAlert } from "../util.jsx";

const partnerMapper = {
  "ONEworks1": "ow",
  "SBO": "sbo"
}
export default class SignIn extends React.Component {
  constructor() {
    super();

    this.state = {
      obCustId: 0,
      memberName: randomString(8),
      language: "vi-VN",
      currency: "$US",
      seq: "d,y,lumi",
      siteId: "4100300",
			siteName: "lumi",
      ip: "",
      browserUserAgent: navigator.userAgent,
      auth: {
        partnerId: "ONEworks1",
				partnerSecret: "ONEworks1@20luminet&",
      },
      token: "",
      redirectUrl: "#",
      verifyResult: null,
      gameId: 0,
      setting: {
        owUrl: "",
      },
      domain: "example.com",
      localhost: false,
      isOpenOnIframe: false,
      appType: 1,
      partner: "1W",
      expandAdvanceSetting: false,
      instantMode: 1,
      devIp: ""
    };

    this.instantModeSize = {
      1: {
        width: "224px",
        height: "370px",
      },
      2: {
        width: "812px",
        height: "456px",
      }}

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleChangeAuth = this.handleChangeAuth.bind(this);
    this.handleReloadIframe = this.handleReloadIframe.bind(this);

    this.instantRef = React.createRef();
    this.iFrameRef = React.createRef();
  }

  handleInputChange(data) {
    if (
      this.state.appType === 3 &&
      data.instantMode &&
      this.state.instantMode !== data.instantMode
    ) {
      const iFrameElement = this.instantRef.current;
      iFrameElement.src = iFrameElement.src;
    }

    this.setState(data);
  }

  handleChangeAuth(data) {
    const state = this.state;

    state.auth = Object.assign({}, state.auth, data);

    this.setState(state);
  }

  handleSubmit(event) {
    const request = Object.assign({}, this.state, {
      token: null,
      verifyResult: null,
      resource: null,
      localhost: null,
      devIp: null
    });
    Axios.post("/signin/sso", request)
      .then((data) => data.data)
      .then((data) => (data.error ? Promise.reject(data.error) : data))
      .then((token) => this.setState(token))
      .catch(showAlert);

    event && event.preventDefault();
  }

  handleVerifyToken(event) {
    const request = Object.assign(
      {},
      {
        token: this.state.token,
        browserUserAgent: this.state.browserUserAgent,
        ip: this.state.ip,
      }
    );

    Axios.post("/signin/verify", request)
      .then((data) => data.data)
      .then((data) => (data.error ? Promise.reject(data.error) : data))
      .then((verifyResult) => this.setState({ verifyResult }))
      .catch(showAlert);

    event.preventDefault();
  }

  async componentDidMount() {
    const data = await Axios.get("/setting/data").then((data) => data.data);
    const ip = await Axios.get("/signin/ip", { timeout: 10000 }).then(
      (data) => data.data
    );
    const searchParams = new URLSearchParams(
      this.props.history.location.search
    );
    const obCustId =
      Number(searchParams.get("obCustId")) || (Math.random() * 10000000) >> 0;
    const appType = parseInt(searchParams.get("appType")) || 1;

    this.setState({ setting: data, ip, obCustId, appType }, () => {
      this.handleSubmit();
    });
  }

  handleReloadIframe() {
    const iFrameElement = this.iFrameRef.current;
    iFrameElement.src = iFrameElement.src;
  }

  render() {
    let redirectUrl = this.state.redirectUrl;
    const { localhost, token,instantMode, devIp } = this.state;
    if ( token) {
      if(localhost) {
        redirectUrl =
        this.state.appType === 2
          ? `${this.state.setting.mobileLocalhost}?token=${token}`
          : `${this.state.setting.localhost}?token=${token}&gameId=${this.state.gameId}`;
      }

      if(devIp) {
        redirectUrl = `${devIp}?token=${token}`
      }

    }

    return (
      <div className="container">
        <div className="section">
          <form onSubmit={(event) => this.handleSubmit(event)}>

              <fieldset>
                <legend>Basic</legend>
                <div className="row">
                <div className="col-sm-12 col-md-6">
                  <Input
                    type="int"
                    id="obCustId"
                    name="Member ID"
                    value={this.state.obCustId}
                    onChange={this.handleInputChange}
                  />
                  
                  <AppType
                    onChange={this.handleInputChange}
                    id="appType"
                    value={this.state.appType}
                    instantMode={this.state.instantMode}
                    isOpenOnIframe={this.state.isOpenOnIframe}
                  />
               
                </div>
                <div className="col-sm-12 col-md-6">
                  <Input
                    type="text"
                    id="memberName"
                    name="Member Username"
                    value={this.state.memberName}
                    onChange={this.handleInputChange}
                  />
                  <Input
                    type="text"
                    id="currency"
                    name="Currency"
                    value={this.state.currency}
                    onChange={this.handleInputChange}
                  />
                </div>
              </div>
              </fieldset>
              <fieldset>
                <legend 
                  onClick={() => this.setState({expandAdvanceSetting: !this.state.expandAdvanceSetting})}
                  style={{cursor: "pointer"}}
                >
                  Advance
                  <img src="/images/icon-expand.png" alt="landscape-icon" style={{width:'20px', 'vertical-align': 'middle', padding: '5px', transform: !this.state.expandAdvanceSetting ? 'rotate(180deg)' : null }}/>
                </legend>
                <div className="row" style={{display: this.state.expandAdvanceSetting ? "flex" : "none"}}>
                  <div className="col-sm-12 col-md-6">
                    <Input
                      type="text"
                      id="siteId"
                      name="Site Id"
                      value={this.state.siteId}
                      onChange={this.handleInputChange}
                    />
                    <Input
                      type="text"
                      id="siteName"
                      name="Site Name"
                      value={this.state.siteName}
                      onChange={this.handleInputChange}
                    />
                    <LanguageSelect
                      onChange={this.handleInputChange}
                      id="language"
                      value={this.state.language}
                    />
            
                    <GameSelect
                      onChange={this.handleInputChange}
                      id="gameId"
                      value={this.state.gameId}
                    />
                    <Input
                      type="text"
                      id="browserUserAgent"
                      name="Browser User Agent"
                      value={this.state.browserUserAgent}
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6">
                    <Input
                      type="text"
                      id="seq"
                      name="SEQ"
                      value={this.state.seq}
                      onChange={this.handleInputChange}
                    />
                    <Input
                      type="text"
                      id="ip"
                      name="IP"
                      value={this.state.ip}
                      onChange={this.handleInputChange}
                    />
                    <Input
                      type="text"
                      id="domain"
                      name="Domain"
                      value={this.state.domain}
                      onChange={this.handleInputChange}
                    />
                    <Input
                      type="text"
                      id="partnerId"
                      name="Partner Id"
                      value={this.state.auth.partnerId}
                      onChange={this.handleChangeAuth}
                    />
                    <Input
                      type="text"
                      id="partnerSecret"
                      name="Partner Secret"
                      value={this.state.auth.partnerSecret}
                      onChange={this.handleChangeAuth}
                    />
                  </div>
              </div>
              </fieldset>
              
              <div className="row">
                    <div className="col-sm-4">
                  <Input
                    type="checkbox"
                        id="localhost"
                        name="Localhost"
                        value={this.state.localhost}
                        onChange={this.handleInputChange}
                      />
                    </div>
                    <div className="col-sm-4">
                      <Input
                        type="checkbox"
                        id="isOpenOnIframe"
                        name="Load On Iframe"
                        value={this.state.isOpenOnIframe}
                        onChange={this.handleInputChange}
                      />
                    </div>
                    <div className="col-sm-4">
                      <Input
                          type="checkbox"
                      id="disableJackpotGames"
                      name="Disable Jackpot Games"
                      value={this.state.disableJackpotGames}
                      onChange={this.handleInputChange}
                  />
                    </div>
                  </div>
              <div className="row">
              <Input
                    type="text"
                        id="devIp"
                        name="Dev Machine IP"
                        value={this.state.devIp}
                        onChange={this.handleInputChange}
                      />
              </div>
              <input className="primary" type="submit" value="Get Token" />
              <label className="button secondary" for="modal-control">
                Set Balance
              </label>
              <input type="checkbox" id="modal-control" class="modal" />
              <div role="dialog" aria-labelledby="dialog-title">
                <div
                  class="card"
                  style={{ maxWidth: "800px", maxHeight: "800px" }}
                >
                  <label for="modal-control" class="modal-close"></label>
                  <h3 class="section">
                    Set Balance
                    <svg
                      cursor="pointer"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="feather feather-refresh-cw"
                      onClick={this.handleReloadIframe}
                    >
                      <polyline points="23 4 23 10 17 10"></polyline>
                      <polyline points="1 20 1 14 7 14"></polyline>
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                    </svg>
                  </h3>
                  <div class="section">
                    <iframe
                      ref={this.iFrameRef}
                      src={`${this.state.setting.owUrl}?memId=${this.state.obCustId}&&partner=${partnerMapper[this.state.auth.partnerId]}`}
                      width="800"
                      height="500"
                      frameborder="0"
                      allowtransparency="true"
                    />
                  </div>
                </div>
              </div>
        
          </form>
          {(this.state.appType === 3 || this.state.isOpenOnIframe) && token && (
            <iframe
              ref={this.instantRef}
              src={redirectUrl}
              style={this.instantModeSize[instantMode]}
            />
          )}
        </div>
        <div className="section">
          <form onSubmit={(event) => this.handleVerifyToken(event)}>
            <fieldset className="container">
              <legend>Token</legend>
              <div className="input-group vertical">
                <label htmlFor="redirectUrl">Redirect</label>
                <a
                  className="col-sm-12"
                  style={{ color: "#0277bd" }}
                  onClick={() =>
                    window.open(
                      redirectUrl,
                      "_blank",
                      `width=${
                        this.state.appType === 2 ? 1270 : 1523
                      },height=884`
                    )
                  }
                >
                  {redirectUrl}
                </a>
              </div>
              <Input
                type="text"
                id="token"
                name="Token"
                value={this.state.token}
                onChange={this.handleInputChange}
              />
              <input className="primary" type="submit" value="Verify Token" />
            </fieldset>
          </form>
        </div>
        {this.state.verifyResult && (
          <div className="section">
            <form>
              <fieldset className="container">
                <legend>Verify Result</legend>
                <pre>{JSON.stringify(this.state.verifyResult, "<br/>", 2)}</pre>
              </fieldset>
            </form>
          </div>
        )}
      </div>
    );
  }
}
