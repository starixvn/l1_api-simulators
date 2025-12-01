import Axios from "axios";
import React, { useState } from "react";
import Input from "../components/input.jsx";
import { showAlert } from "../util.jsx";
import CryptoJS from "crypto-js";

// API Endpoints
const API_BASE = "http://sabaplaywallet.sb3rd.playonesit.com";
const ENDPOINTS = {
    CREATE_MEMBER: `${API_BASE}/api/wallet/CreateMember`,
    DEPOSIT: `${API_BASE}/api/wallet/Deposit`,
    LAUNCH_GAME: `${API_BASE}/api/game/LaunchGame`
};

// Game Configuration
const GAME_CONFIG = {
    GAME_ID: "0",
    HOME_URL: "",
    LANGUAGE: "en",
    PLATFORM: "D",
    IP_ADDRESS: "8.8.8.8",
    LOCATION: "VN",
    USE_LOBBY: true
};

// Authentication
const AUTH = {
    OPERATOR_PWD: "ub3u9rvj",
    OPERATOR_SECRET: "slo52vhy"
};

// Default Form Values
const DEFAULTS = {
    PLAYER_ID: "eric011",
    CURRENCY: "UUS",
    AMOUNT: "20000",
    X_MODE: "100"
};

const SabaPlay = () => {
    // Form State
    const [playerId, setPlayerId] = useState(DEFAULTS.PLAYER_ID);
    const [currency, setCurrency] = useState(DEFAULTS.CURRENCY);
    const [amount, setAmount] = useState(DEFAULTS.AMOUNT);
    const [xMode, setXMode] = useState(DEFAULTS.X_MODE);
    
    // UI State
    const [result, setResult] = useState("");
    const [resultData, setResultData] = useState(null);
    const [createMemberLoading, setCreateMemberLoading] = useState(false);
    const [depositLoading, setDepositLoading] = useState(false);
    const [launchLoading, setLaunchLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const [playerIdError, setPlayerIdError] = useState("");

    // Utility Functions
    const toMD5 = (str) => CryptoJS.MD5(str).toString().toUpperCase();
    
    const encrypt = (payload) => {
        const combined = payload + AUTH.OPERATOR_SECRET;
        return toMD5(combined);
    };

    const generateGuid = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    const getTimestamp = () => {
        const now = new Date();
        return new Date(now.getTime() - (4 * 60 * 60 * 1000))
            .toISOString()
            .replace('Z', '-04:00');
    };

    const createHeaders = (payload) => ({
        "operator-pwd": AUTH.OPERATOR_PWD,
        "operator-sign": encrypt(payload),
        "Content-Type": "application/json"
    });

    const addLog = (message) => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    };

    const makeApiCall = async (url, payload) => {
        const postdata = JSON.stringify(payload);
        const headers = createHeaders(postdata);
        const response = await Axios.post(url, postdata, { headers });
        return response.data;
    };

    const validatePlayerId = (id) => {
        // Check if empty
        if (!id || id.trim() === "") {
            return "Player ID is required";
        }

        // Check maximum length
        if (id.length > 40) {
            return "Player ID must not exceed 40 characters";
        }

        // Check only English letters, numbers, and underscores
        const validPattern = /^[a-zA-Z0-9_]+$/;
        if (!validPattern.test(id)) {
            return "Player ID can only contain English letters, numbers, and underscores";
        }

        return "";
    };

    const handlePlayerIdChange = (data) => {
        const newPlayerId = data.playerId;
        setPlayerId(newPlayerId);
        
        // Validate on change
        const error = validatePlayerId(newPlayerId);
        setPlayerIdError(error);
    };

    // API Functions
    const createMember = async () => {
        const payload = {
            Timestamp: getTimestamp(),
            Seq: generateGuid(),
            Payload: {
                PlayerId: playerId,
                Currency: currency
            }
        };

        try {
            const data = await makeApiCall(ENDPOINTS.CREATE_MEMBER, payload);
            
            if (data.ErrorCode === 0) {
                addLog(`✓ Member created successfully: ${data.Payload.PlayerId}`);
                return { success: true, message: "Member created successfully" };
            } else {
                addLog(`✗ CreateMember error: ${playerId}-${data.ErrorMessage}`);
                return { success: false, message: data.ErrorMessage, canContinue: true };
            }
        } catch (error) {
            addLog(`⚠ CreateMember error: ${error.message}`);
            // Return canContinue=true because member might already exist
            return { success: false, message: error.message, canContinue: true };
        }
    };

    const depositFunds = async () => {
        addLog(`Depositing ${amount} ${currency}...`);
        
        const payload = {
            Timestamp: getTimestamp(),
            Seq: generateGuid(),
            Payload: {
                PlayerId: playerId,
                Amount: parseFloat(amount),
                Currency: currency,
                TransactionId: `TXN_${Date.now()}_${generateGuid().substring(0, 8)}`
            }
        };

        try {
            const data = await makeApiCall(ENDPOINTS.DEPOSIT, payload);
            
            if (data.ErrorCode === 0) {
                addLog(`✓ Deposit successful! New balance: ${data.Payload.Balance}`);
                return { success: true, message: "Deposit successful", balance: data.Payload.Balance };
            } else {
                addLog(`✗ Deposit error: ${data.ErrorMessage}`);
                return { success: false, message: data.ErrorMessage };
            }
        } catch (error) {
            addLog(`✗ Deposit error: ${error.message}`);
            return { success: false, message: error.message };
        }
    };

    const launchGame = async () => {
        addLog("Generating game url...");
        
        const payload = {
            Timestamp: getTimestamp(),
            Seq: generateGuid(),
            Payload: {
                ProductInfo: {
                    GameType: "SabaPlay",
                    GameId: GAME_CONFIG.GAME_ID,
                    AppType: GAME_CONFIG.PLATFORM
                },
                CustInfo: {
                    PlayerId: playerId,
                    PlayerName: playerId,
                    Language: GAME_CONFIG.LANGUAGE,
                    Platform: GAME_CONFIG.PLATFORM,
                    Currency: currency,
                    IpAddress: GAME_CONFIG.IP_ADDRESS,
                    BrowserUserAgent: navigator.userAgent
                },
                HomeUrl: GAME_CONFIG.HOME_URL,
                Additional: {
                    Location: GAME_CONFIG.LOCATION,
                    UseLobby: GAME_CONFIG.USE_LOBBY,
                    ...(xMode === "100" && { DisplayMultiplier: xMode })
                }
            }
        };

        try {
            const data = await makeApiCall(ENDPOINTS.LAUNCH_GAME, payload);
            
            if (data.ErrorCode === 0) {
                addLog("✓ Game url generated successfully!");
                setResultData(data);
                setResult(JSON.stringify(data, null, 2));
                return { success: true, message: "Game url generated successfully", data };
            } else {
                addLog(`✗ LaunchGame error: ${data.ErrorMessage}`);
                return { success: false, message: data.ErrorMessage };
            }
        } catch (error) {
            addLog(`✗ LaunchGame error: ${error.message}`);
            return { success: false, message: error.message };
        }
    };

    // Event Handlers
    const resetState = () => {
        setResult("");
        setResultData(null);
        setLogs([]);
        setPlayerIdError("");
    };

    const handleError = (error, setLoading) => {
        addLog(`✗ Error: ${error.message}`);
        const errorMessage = error.response 
            ? `Error: ${error.message}\n${JSON.stringify(error.response.data, null, 2)}`
            : `Error: ${error.message}`;
        setResult(errorMessage);
        setResultData(null);
        setLoading(false);
        showAlert(error);
    };

    const validateAndProceed = (callback) => async (event) => {
        event?.preventDefault();
        
        const validationError = validatePlayerId(playerId);
        if (validationError) {
            setPlayerIdError(validationError);
            showAlert(validationError);
            return;
        }

        await callback();
    };

    const handleCreateMember = validateAndProceed(async () => {
        setCreateMemberLoading(true);
        resetState();

        try {
            const result = await createMember();
            setCreateMemberLoading(false);
            
            if (!result.success && !result.canContinue) {
                setResult(`Error: ${result.message}`);
            }
        } catch (error) {
            handleError(error, setCreateMemberLoading);
        }
    });

    const handleDeposit = validateAndProceed(async () => {
        setDepositLoading(true);
        resetState();

        try {
            const result = await depositFunds();
            setDepositLoading(false);
            
            if (!result.success) {
                setResult(`Error: ${result.message}`);
            }
        } catch (error) {
            handleError(error, setDepositLoading);
        }
    });

    const handleLaunchGame = validateAndProceed(async () => {
        setLaunchLoading(true);
        resetState();

        try {
            const result = await launchGame();
            setLaunchLoading(false);
            
            if (!result.success) {
                setResult(`Error: ${result.message}`);
            }
        } catch (error) {
            handleError(error, setLaunchLoading);
        }
    });

    return (
        <div className="container">
            <div className="section">
                <form>
                    <fieldset>
                        <legend>SabaPlay</legend>
                        
                        <div className="row">
                            <div className="col-sm-12 col-md-3">
                                <Input
                                    type="text"
                                    id="playerId"
                                    name="Player ID"
                                    value={playerId}
                                    onChange={handlePlayerIdChange}
                                />
                                {playerIdError && (
                                    <p style={{ 
                                        color: 'red', 
                                        fontSize: '12px', 
                                        marginTop: '5px',
                                        marginBottom: '0'
                                    }}>
                                        {playerIdError}
                                    </p>
                                )}
                                <p style={{ 
                                    color: '#666', 
                                    fontSize: '11px', 
                                    marginTop: '5px',
                                    fontStyle: 'italic'
                                }}>
                                    Max 40 characters. Only letters, numbers, and underscores allowed.
                                </p>
                            </div>
                            
                            <div className="col-sm-12 col-md-3">
                                <Input
                                    type="text"
                                    id="currency"
                                    name="Currency"
                                    value={currency}
                                    onChange={(data) => setCurrency(data.currency)}
                                />
                            </div>

                            <div className="col-sm-12 col-md-3">
                                <Input
                                    type="number"
                                    id="amount"
                                    name="Deposit Amount"
                                    value={amount}
                                    onChange={(data) => setAmount(data.amount)}
                                />
                            </div>

                            <div className="col-sm-12 col-md-3">
                                <Input
                                    type="text"
                                    id="xMode"
                                    name="XMode"
                                    value={xMode}
                                    onChange={(data) => setXMode(data.xMode)}
                                />
                            </div>
                        </div>
                    </fieldset>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                        <input 
                            className="primary"
                            type="button" 
                            value={createMemberLoading ? "Creating..." : "Create Member"} 
                            disabled={createMemberLoading || depositLoading || launchLoading || !!playerIdError}
                            onClick={handleCreateMember}
                        />
                        <input 
                            className="secondary" 
                            type="button" 
                            value={depositLoading ? "Depositing..." : "Deposit"} 
                            disabled={createMemberLoading || depositLoading || launchLoading || !!playerIdError}
                            onClick={handleDeposit}
                        />
                        <input 
                            className="secondary" 
                            type="button" 
                            value={launchLoading ? "Launching..." : "Get Game URL"} 
                            disabled={createMemberLoading || depositLoading || launchLoading || !!playerIdError}
                            onClick={handleLaunchGame}
                            style={{
                                backgroundColor: '#4CAF50',
                                borderColor: '#4CAF50',
                                color: 'white'
                            }}
                        />
                    </div>
                </form>
            </div>

            {logs.length > 0 && (
                <div className="section">
                    <fieldset className="container">
                        <legend>Process Log</legend>
                        <div style={{
                            backgroundColor: '#f4f4f4',
                            padding: '15px',
                            borderRadius: '5px',
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            maxHeight: '200px',
                            overflow: 'auto'
                        }}>
                            {logs.map((log, index) => (
                                <div key={index} style={{ marginBottom: '5px' }}>
                                    {log}
                                </div>
                            ))}
                        </div>
                    </fieldset>
                </div>
            )}

            {result && (
                <div className="section">
                    {resultData && resultData.Payload && resultData.Payload.GameUrl && (
                        <fieldset className="container">
                            <legend>Game URL</legend>
                            <a 
                                href={resultData.Payload.GameUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{
                                    color: '#0277bd',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    textDecoration: 'underline',
                                    wordBreak: 'break-all',
                                    display: 'block',
                                    padding: '10px',
                                    backgroundColor: '#e3f2fd',
                                    borderRadius: '5px',
                                    marginBottom: '10px'
                                }}
                            >
                                {resultData.Payload.GameUrl}
                            </a>
                        </fieldset>
                    )}
                </div>
            )}
        </div>
    );
};

export default SabaPlay;
