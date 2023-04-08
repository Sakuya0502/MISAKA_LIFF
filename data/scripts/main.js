var liffId = "1660845055-GMJrEOVY";
var params = location.search.substring(1);
var url = window.location.href;
if (params) {
    try {
        params = JSON.parse('{"' + decodeURI(params.replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}');
    } catch (err) {
        getParameterByName = getParameterByNameV2;
    }
}

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
        };
        anHttpRequest.open("GET", aUrl, true);
        anHttpRequest.send(null);
    };
};

function initVConsole() {
    var vconsole = new window.VConsole({
        defaultPlugins: ["system", "network", "element", "storage"],
        maxLogNumber: 1000,
        onReady: function() {
            console.log("vConsole is ready.");
        },
        onClearLog: function() {}
    });
}

function initLiff(liffId) {
    console.log("Going to initialize LIFF to", liffId);
    liff.init({
        liffId: liffId
    }).then(() => {
        if (getParameterByName("selecter") == "liffToken") getLiffToken();
        if (getParameterByName("auto") == "yes" && getParameterByName("selecter")) {
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
        if (!liff.isInClient() && getParameterByName("selecter") !== undefined) {
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
        type = getParameterByName("selecter");
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
    var client = new HttpClient();
    var userDisplayName = "MISAKA";
    var userPictureUrl = "https://truth.bahamut.com.tw/s01/201307/70d002bb30cf6afcaf7f157e0c3fda73.JPG";
    var userStatusMessage = "Hi!";
    liff.getProfile().then(profile => {
        userDisplayName = profile.displayName;
        userPictureUrl = profile.pictureUrl;
        userStatusMessage = profile.statusMessage;
    }).catch((err) => {
        console.error("Error while get profile", err);
    });
    if (type == "profile") {
        sendMessages([{type: "flex", altText: "Profile " + userDisplayName, contents: {type: "bubble", hero: {type: "image", url: userPictureUrl, size: "full", aspectRatio: "1:1", aspectMode: "cover", action: {type: "uri", uri: "line://app/1657024923-2r46WKKN?auto=yes&type=image&downloadUrl=" + userPictureUrl + "&previewUrl=" + userPictureUrl } }, body: {type: "box", layout: "vertical", contents: [{type: "text", text: userDisplayName, align: "center", weight: "bold", size: "xl"}, {type: "box", layout: "vertical", margin: "lg", spacing: "sm", contents: [{type: "text", text: userStatusMessage, wrap: true, color: "#666666", size: "sm", maxLines: 5, flex: 5 }] } ] }, footer: {type: "box", layout: "horizontal", spacing: "sm", contents: [{type: "button", style: "primary", height: "sm", color: "#02afff", action: {type: "uri", label: "Open Chat", uri: "https://line.me/ti/g2/JGUODBE4RE"}}, {type: "button", style: "primary", height: "sm", action: {type: "uri", label: "Profile", uri: "line://app/1657024923-2r46WKKN?auto=yes&type=profile"}}, {type: "spacer", size: "sm"}]}}}]); 
    } else if (type == "text") {
        sendMessages([{
            type: "text",
            text: document.getElementById("text").value
        }]);
    } else if (type == "sticker") {
        sendMessages([{
            type: "sticker",
            packageId: document.getElementById("packageId").value,
            stickerId: document.getElementById("stickerId").value
        }]);
    } else if (type == "stickerimage") {
        stickerId = document.getElementById("stickerId").value;
        packageId = document.getElementById("packageId").value;
        animation = document.getElementById("animation").checked;
        if (animation == true) {
            imageUrl = "https://stickershop.line-scdn.net/stickershop/v1/sticker/" + stickerId + "/IOS/sticker_animation@2x.png";
        } else {
            imageUrl = "https://stickershop.line-scdn.net/stickershop/v1/sticker/" + stickerId + "/IOS/sticker@2x.png";
        }
        sendMessages([{
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
        }]);
    } else if (type == "image") {
        sendMessages([{
            type: "image",
            originalContentUrl: document.getElementById("downloadUrl").value,
            previewImageUrl: document.getElementById("previewUrl").value
        }]);
    } else if (type == "video") {
        sendMessages([{
            type: "video",
            originalContentUrl: document.getElementById("downloadUrl").value,
            previewImageUrl: document.getElementById("previewUrl").value
        }]);
    } else if (type == "audio") {
        sendMessages([{
            type: "audio",
            originalContentUrl: document.getElementById("downloadUrl").value,
            duration: 60000
        }]);
    } else if (type == "messages") {
        sendMessages(JSON.parse(document.getElementById("messages").value))
    } else if (type == "messagesUrl") {
        var messagesUrl = document.getElementById("messagesUrl").value;
        client.get(messagesUrl, function(response) {
            sendMessages(JSON.parse(response))
        }).catch((err) => {
            console.error("Parsing messages failed", err);
        });
    } else if (type == "scanQr") {
        sendMessages([{
            type: "text",
            text: document.getElementById("qrResult").value
        }]);
    }
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

function getParameterByName(name) {
    var result = null;
    name = name.replace(/[\[\]]/g, "\\$&");
    if (params[name]) {
        result = unescape(params[name])
    }
    return result
}

function getParameterByNameV2(name) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function removeElements(classname) {
    var list = document.getElementsByClassName(classname);
    for (var i = list.length - 1; 0 <= i; i--) {
        if (list[i] && list[i].parentElement && list[i].id && list[i].id == "data") {
            list[i].parentElement.removeChild(list[i]);
        }
    }
}

function sendAlertIfNotInClient() {
    alert('此按鈕不可用，LIFF在瀏覽器外部中打開（請在LINE中使用）');
}