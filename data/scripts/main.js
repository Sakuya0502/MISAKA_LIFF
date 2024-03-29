var liffId = "1660845055-GMJrEOVY";
var params = location.search.substring(1);
var url = window.location.href;

window.onload = function() {
    initVConsole();
    initContent();
    initLiff(liffId);
};

var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }
        anHttpRequest.open("GET", aUrl, true);
        anHttpRequest.send(null);
    }
}

function getParameterByName(name){
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if(results == null) {
        return "";
    } else {
        return decodeURIComponent(results[1].replace(/\+/g, " "));
    }
}

function removeElements(classname) {
    var list = document.getElementsByClassName(classname);
    for (var i = list.length - 1; 0 <= i; i--) {
        if (list[i] && list[i].parentElement && list[i].id && list[i].id == "data") {
            list[i].parentElement.removeChild(list[i]);
        }
    }
}

//vconsole
function initVConsole() {
    var vconsole = new window.VConsole({
        defaultPlugins: ["system", "network", "element", "storage"],
        maxLogNumber: 1000,
        onReady: function() {
            console.log("vConsole is ready.");
        },
        onClearLog: function() {
            console.log("on clearLog");
        }
    });
}

function initLiff(liffId) {
    console.log("Going to initialize LIFF to", liffId);
    liff.init({
        liffId: liffId
    }).then(() => {
        //if (getParameterByName("selecter") == "liffToken") getLiffToken();
        if (getParameterByName("auto") == "yes" && getParameterByName("type")) {
            sendLiffMessage();
        }
        initApp();
    }).catch((err) => {
        console.error("LIFF initialization failed", err);
    });
}

function initApp() {
    console.log("LIFF initialized!");
    if (!liff.isLoggedIn()) {
        var button = document.getElementById("Send_message");
        button.innerHTML = "請先登入LINE";
        button.id = "liffLogin";
    } else {
        if (!liff.isInClient() && getParameterByName("type") !== undefined) {
            var parent = document.getElementById("content");
            var element = document.createElement("a");
            element.href = "#";
            element.id = "liffLogout";
            element.className = "btn btn-lg btn-danger btn-block";
            element.innerHTML = "登出";
            parent.insertBefore(element, parent.childNodes[6]);
        }
        liff.getProfile().then(profile => {
            const userDisplayName = profile.displayName;
            console.info("User name is", userDisplayName);
        }).catch((err) => {
            console.error("LIFF getProfile failed", err);
        });
    }
    registerButtonHandlers();
}

function registerButtonHandlers() {
    sendMessageButton = document.getElementById("Send_message");
    loginButton = document.getElementById("liffLogin");
    logoutButton = document.getElementById("liffLogout");
    if (sendMessageButton && liff.isInClient()) {
        sendMessageButton.addEventListener("click", sendLiffMessage, false);
    } else if (sendMessageButton && !liff.isInClient()) {
        logoutButton.addEventListener("click", logoutLiff, false);
    } else {
        loginButton.addEventListener("click", loginLiff, false);
    }
}

function changeType() {
    var type = document.getElementById("selecter").value;
    removeElements("Centers");
    initContent(type);
}

function initContent(type) {
    var isLoggedIn = true;
    var element = document.createElement("div");
    var input = document.createElement("input");
    var label = document.createElement("label");
    var textarea = document.createElement("textarea");
    if (!type) {
        type = getParameterByName("type");
        if (type) document.getElementById("selecter").value = type;
        if (document.getElementById("selecter").selectedIndex <= 0) {
            document.getElementById("selecter").value = "None_choosen";
        }
        isLoggedIn = false;
    }
    /*
    if (getParameterByName("share") == "yes") {
        document.getElementById("share").checked = true;
    }
    if (getParameterByName("liffId")) {
        liffId = getParameterByName("liffId");
    }
    */
    var parent = document.getElementById("content");
    if (type == "text") {
        element.className = "Centers";
        element.id = "data";
        input.type = "text";
        input.id = "text";
        input.className = "form-control";
        input.placeholder = "Text message";
        input.required = true;
        if (getParameterByName("text")) {
            input.value = getParameterByName("text");
        }
        label.htmlFor = "text";
        label.innerHTML = "文字訊息";
        element.appendChild(input);
        element.appendChild(label);
        parent.insertBefore(element, parent.childNodes[4]);
    } else if (type == "sticker" || type == "stickerimage") {
        element.className = "Centers";
        element.id = "data";
        input.type = "text";
        input.id = "packageId";
        input.className = "form-control";
        input.placeholder = "Text message";
        input.required = true;
        if (getParameterByName("packageId")) {
            input.value = getParameterByName("packageId");
        }
        label.htmlFor = "packageId";
        label.innerHTML = "貼圖包 ID";
        element.appendChild(input);
        element.appendChild(label);
        parent.insertBefore(element, parent.childNodes[4]);
        element = document.createElement("div");
        input = document.createElement("input");
        label = document.createElement("label");
        element.className = "Centers";
        element.id = "data";
        input.type = "text";
        input.id = "stickerId";
        input.className = "form-control";
        input.placeholder = "Preview image url";
        input.required = true;
        if (getParameterByName("stickerId")) {
            input.value = getParameterByName("stickerId");
        }
        label.htmlFor = "stickerId";
        label.innerHTML = "貼圖 ID";
        element.appendChild(input);
        element.appendChild(label);
        parent.insertBefore(element, parent.childNodes[4]);
        element = document.createElement("div");
        checkbox = document.createElement("div");
        input = document.createElement("input");
        label = document.createElement("label");
        checkbox.className = "Centers";
        checkbox.id = "data";
        element.className = "custom-control custom-checkbox";
        input.type = "checkbox";
        input.id = "animation";
        input.className = "custom-control-input";
        if (getParameterByName("animation") == "yes") {
            input.checked = true;
        }
        label.htmlFor = "animation";
        label.className = "custom-control-label";
        label.innerHTML = "動畫";
        element.appendChild(input);
        element.appendChild(label);
        checkbox.appendChild(element);
        parent.insertBefore(checkbox, parent.childNodes[4]);
    } else if (type == "image" || type == "video") {
        element.className = "Centers";
        element.id = "data";
        input.type = "text";
        input.id = "downloadUrl";
        input.className = "form-control";
        input.placeholder = "Original content url";
        input.required = true;
        if (getParameterByName("downloadUrl")) {
            input.value = getParameterByName("downloadUrl");
        }
        label.htmlFor = "downloadUrl";
        label.innerHTML = "下載網址";
        element.appendChild(input);
        element.appendChild(label);
        parent.insertBefore(element, parent.childNodes[4]);
        element = document.createElement("div");
        input = document.createElement("input");
        label = document.createElement("label");
        element.className = "Centers";
        element.id = "data";
        input.type = "text";
        input.id = "previewUrl";
        input.className = "form-control";
        input.placeholder = "Preview image url";
        input.required = true;
        if (getParameterByName("previewUrl")) {
            input.value = getParameterByName("previewUrl");
        }
        label.htmlFor = "previewUrl";
        label.innerHTML = "預覽網址";
        element.appendChild(input);
        element.appendChild(label);
        parent.insertBefore(element, parent.childNodes[4]);
    } else if (type == "audio") {
        element.className = "Centers";
        element.id = "data";
        input.type = "text";
        input.id = "downloadUrl";
        input.className = "form-control";
        input.placeholder = "Original content url";
        input.required = true;
        if (getParameterByName("downloadUrl")) {
            input.value = getParameterByName("downloadUrl");
        }
        label.htmlFor = "downloadUrl";
        label.innerHTML = "下載網址";
        element.appendChild(input);
        element.appendChild(label);
        parent.insertBefore(element, parent.childNodes[4]);
    } else if (type == "messages") {
        element.className = "Centers";
        element.id = "data";
        textarea.id = "messages";
        textarea.className = "form-control";
        textarea.placeholder = "訊息JSON";
        textarea.rows = "5";
        if (getParameterByName("messages")) {
            textarea.value = getParameterByName("messages");
        }
        element.appendChild(textarea);
        parent.insertBefore(element, parent.childNodes[4]);
    } else if (type == "messagesUrl") {
        element.className = "Centers";
        element.id = "data";
        input.type = "text";
        input.id = "messagesUrl";
        input.className = "form-control";
        input.placeholder = "Messages json url";
        input.required = true;
        if (getParameterByName("messagesUrl")) {
            input.value = getParameterByName("messagesUrl");
        }
        label.htmlFor = "messagesUrl";
        label.innerHTML = "訊息JSON網址";
        element.appendChild(input);
        element.appendChild(label);
        parent.insertBefore(element, parent.childNodes[4]);
    } else if (type == "scanQr") {
        element.className = "Centers";
        element.id = "data";
        input.type = "text";
        input.id = "qrResult";
        input.className = "form-control";
        input.placeholder = "QR Code Result";
        input.required = true;
        label.htmlFor = "qrResult";
        label.innerHTML = "QR Code掃描結果";
        element.appendChild(input);
        element.appendChild(label);
        parent.insertBefore(element, parent.childNodes[4]);
        scanCodeQr();
    }
}

function sendLiffMessage() {
    var type = document.getElementById("selecter").value;
    console.info(type);
    var client = new HttpClient();
    liff.getProfile().then(profile => {
        const userDisplayName = profile.displayName;
        if (type == "profile") {
            liff.sendMessages([{
                type: "flex",
                altText: userDisplayName + "的個人資訊",
                contents: {
                    "type": "bubble",
                    "size": "kilo",
                    "hero": {
                        "type": "image",
                        "url": profile.pictureUrl,
                        "size": "full",
                        "aspectRatio": "1:1",
                        "aspectMode": "cover",
                        "action": {
                            "type": "uri",
                            "label": "action",
                            "uri": "https://liff.line.me/1660845055-GMJrEOVY?auto=yes&type=image&downloadUrl=" + profile.pictureUrl + "&previewUrl=" + profile.pictureUrl
                        }
                    },
                    "body": {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                        {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                              "type": "text",
                              "text": userDisplayName,
                              "align": "center",
                              "size": "lg",
                              "weight": "bold"
                            }
                          ]
                        },
                        {
                          "type": "box",
                          "layout": "vertical",
                          "contents": [
                            {
                              "type": "text",
                              "text": profile.statusMessage,
                              "weight": "bold",
                              "size": "md",
                              "wrap": true
                            }
                          ]
                        }
                      ]
                    }
                  }
            }]).then(() => {
                console.log("Success sending message");
                liff.closeWindow();
            }).catch((err) => {
                console.error("Sending message failed", err);
            });
        } else if (type == "text") {
            console.log("Start sending message");
            liff.sendMessages([{
                type: "text",
                text: document.getElementById("text").value
            }]).then(() => {
                console.log("Success sending message");
                liff.closeWindow();
            }).catch((err) => {
                console.error("Sending message failed", err);
            });
        } else if (type == "sticker") {
            console.log("Start sending message");
            liff.sendMessages([{
                type: "sticker",
                packageId: document.getElementById("packageId").value,
                stickerId: document.getElementById("stickerId").value
            }]).then(() => {
                console.log("Success sending message");
                liff.closeWindow();
            }).catch((err) => {
                console.error("Sending message failed", err);
            });
        } else if (type == "stickerimage") {
            console.log("Start sending message");
            stickerId = document.getElementById("stickerId").value;
            packageId = document.getElementById("packageId").value;
            animation = document.getElementById("animation").checked;
            if (animation == true) {
                imageUrl = "https://stickershop.line-scdn.net/stickershop/v1/sticker/" + stickerId + "/IOS/sticker_animation@2x.png";
            } else {
                imageUrl = "https://stickershop.line-scdn.net/stickershop/v1/sticker/" + stickerId + "/IOS/sticker@2x.png";
            }
            liff.sendMessages([{
                type: "template",
                altText: userDisplayName + " sent a sticker.",
                template: {
                    type: "image_carousel",
                    columns: [{
                        imageUrl: imageUrl,
                        action: {
                            type: "uri",
                            uri: "line://shop/sticker/detail/" + packageId
                        }
                    }]
                }
            }]).then(() => {
                console.log("Success sending message");
                liff.closeWindow();
            }).catch((err) => {
                console.error("Sending message failed", err);
            });
        } else if (type == "image") {
            console.log("Start sending message");
            liff.sendMessages([{
                type: "image",
                originalContentUrl: document.getElementById("downloadUrl").value,
                previewImageUrl: document.getElementById("previewUrl").value
            }]).then(() => {
                console.log("Success sending message");
                liff.closeWindow();
            }).catch((err) => {
                console.error("Sending message failed", err);
            });
        } else if (type == "video") {
            console.log("Start sending message");
            liff.sendMessages([{
                type: "video",
                originalContentUrl: document.getElementById("downloadUrl").value,
                previewImageUrl: document.getElementById("previewUrl").value
            }]).then(() => {
                console.log("Success sending message");
                liff.closeWindow();
            }).catch((err) => {
                console.error("Sending message failed", err);
            });
        } else if (type == "audio") {
            console.log("Start sending message");
            liff.sendMessages([{
                type: "audio",
                originalContentUrl: document.getElementById("downloadUrl").value,
                duration: 60000
            }]).then(() => {
                console.log("Success sending message");
                liff.closeWindow();
            }).catch((err) => {
                console.error("Sending message failed", err);
            });
        } else if (type == "messages") {
            console.log("Start sending message");
            var inputval = document.getElementById("messages").value;
            //var newval = inputval.replaceAll("\"", "\'");
            var messages = JSON.parse(inputval);
            liff.sendMessages([messages]).then(() => {
                console.log("Success sending message");
                liff.closeWindow();
            }).catch((err) => {
                console.error("Sending message failed", err);
            });
        } else if (type == "messagesUrl") {
            console.log("Start sending message");
            var messagesUrl = document.getElementById("messagesUrl").value;
            client.get(messagesUrl, function(response) {
                var messages = JSON.parse(response);
                liff.sendMessages(messages).then(() => {
                    console.log("Success sending message");
                    liff.closeWindow();
                }).catch((err) => {
                    console.error("Sending message failed", err);
                });
            }).catch((err) => {
                console.error("Parsing messages failed", err);
            });
        } else if (type == "scanQr") {
            console.log("Sending URL...");
            liff.sendMessages([{
                type: "text",
                text: document.getElementById("qrResult").value
            }]).then(() => {
                console.log("Success sending QR URL");
                liff.closeWindow();
            }).catch((err) => {
                console.error("Sending QR URL failed", err);
            });
        }
    }).catch((err) => {
        console.error("LIFF getProfile failed", err);
    });
}

function sendMessages(messages) {
    if (!liff.isInClient()) {
        sendAlertIfNotInClient()
    } else {
        console.info("Start sending message");
        liff.sendMessages(messages).then(() => {
            console.info("Success sending message");
            liff.closeWindow();
        }).catch((err) => {
            console.error("Sending message failed", err);
        });
    }
}

function scanCodeQr() {
    if (!liff.isInClient()) {
        sendAlertIfNotInClient()
    } else {
        console.info("Start scan code qr");
        liff.scanCode().then(result => {
            document.getElementById("qrResult").value = result.value;
        }).catch((err) => {
            console.error("Scan code qr failed", err);
        })
    }
}

function loginLiff() {
    if (!liff.isLoggedIn()) {
        liff.login();
    }
}

function logoutLiff() {
    if (liff.isLoggedIn()) {
        liff.logout();
        window.location.reload();
    }
}

/*
function getParameterByName(name) {
    var result = null;
    name = name.replace(/[\[\]]/g, "\\$&");
    if (params[name]) {
        result = unescape(params[name])
    }
    return result
}
*/ //useless

function sendAlertIfNotInClient() {
    alert('此按鈕不可用，LIFF在瀏覽器外部中打開（請在LINE中使用）');
}