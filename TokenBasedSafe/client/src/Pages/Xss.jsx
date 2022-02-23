import React, { useEffect, useState } from "react";
import axios from "axios";
import Logout from "../Components/Logout";
import Data from "../Components/Data";
import Heading from "../Components/Heading";
import Button from "../Components/Button";
const helper = require("../helper/index");

const Xss = () => {

    // CREATING OUR STATE VARIABLES
    const [username, setUsername] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");
    const [message, setMessage] = useState("");
    const [text, setText] = useState("");
    const [textMessage, setTextMessage] = useState("");
    const [htmlText, setHtmlText] = useState("");
    const [savedText, setSavedText] = useState("");

    // USE-EFFECT REACT HOOK TO CHECK AUTH STATUS AND GET DATA
    useEffect(() => {
        const check = async() => {
            try {
                const renewAccessToken = async() => {
                    const response = await axios.get("/users/auth");
                    setAccessToken(response.data.accessToken);
                    setRefreshToken(response.data.refreshToken);
                    if(response.data === "INVALID") {
                        clearInterval(interval);
                        window.location = "/";
                    }
                    else {
                        setMessage("Changing Access Token ...");
                        setUsername(response.data.username);
                        const result = await axios.post("/users/accesstoken", {username: response.data.username});
                        setAccessToken(result.data.accessToken);
                        setMessage("");
                    }
                }
                const deleteRefreshToken = async() => {
                    const response = await axios.get("/users/auth");
                    if(response.data !== "INVALID") {
                        await axios.post("/users/logout", {username: response.data.username});
                    }
                    window.location = "/";
                }
                renewAccessToken();
                const interval = setInterval(() => renewAccessToken(), 15*1000); // 10 secs
                const timer = setTimeout(() => deleteRefreshToken(), 75*1000); // 1 hr
                return () => {
                    clearInterval(interval);
                    clearTimeout(timer);
                }
            }
            catch(err) {
                console.log(err);
            }
        }   
        check(); 
    },[]);

    // FUNCTION TO SEND DATA TO BACKEND
    const sendText = async() => {
        try {
            setTextMessage("Sending ...");
            const response = await axios.post("/users/text", {username, text});
            setTextMessage("");
            setHtmlText(helper.sanitize(text));
            setSavedText(response.data);
        }
        catch(err) {
            console.log(err);
        }
    }
    
    // RETURNING DATA OF COMPONENT ON PAGE
    return (
    <div className="text-center up ml-5 mr-5">
        <Heading content = "XSS Attack" />
        <Button route = "/home" content = "Home" />
        <Button route = "/change" content = "Change Password" />
        <Logout username = {username} />
        <div>
            <input 
                type="text" 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Random Text" 
                autoComplete="off" 
                className="mt-3 pt-2 pb-2 pr-2 pl-2"
                required 
            />
        </div>
        <button className="btn btn-dark mt-3" onClick={() => sendText()}> Submit Text </button> 
        <div dangerouslySetInnerHTML={{ __html: "Html set on page: " + htmlText}} className="mt-3"></div>
        <h5 className="mt-3"> {textMessage} </h5>
        <div className="mt-3"> Text Saved To Database: {savedText} </div>
        <h5 className="mt-3"> {message} </h5>
        <Data accessToken = {accessToken} refreshToken = {refreshToken} />
    </div>
    );
}

export default Xss;