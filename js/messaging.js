export function sendMessage(RECEIVERS_UUID, topic, data) {
    fin.desktop.InterApplicationBus.send({
        RECEIVERS_UUID, 
        topic, 
        data
    }, 
    function (e) {
        console.log("SUCCESSFULLY SENT");
    }, 
    function (e) {
        console.log("ERROR MESSAGE ", e);
    });
}


function publishMany(num) {
    var _count = 0;

    var _int = setInterval(function () {
        _count++;
        if (_count < 1000) {
            publishMessage()
        } else {
            clearInterval(_int);
        }
    }, 1)
}

function sendBadMessage() {
    var _random = Math.random() * 300;

    var successCallback = function (e) {
        console.log("SUCCESSFULLY SENT ")
    };

    var errorCallback = function (e) {
        console.log("ERROR MESSAGE ", e);
        _inter_app_errors.innerHTML = "ERROR: "+e
    };

    fin.desktop.InterApplicationBus.send('OpenFin_appseed', null, 'universal-message', {
        num: _random,
        text: "The random number is: "
    }, successCallback, errorCallback);
}

//Testing sending to a named window via the inter app bus.
function sendToNamedMessage(RECEIVERS_UUID, topic, data) {
    var _name = document.querySelector("#name-of-window").value;
    fin.desktop.InterApplicationBus.send({
            uuid: RECEIVERS_UUID,
            name: _name,
            message: data,
            topic: topic,
            cache: 'until-delivered'
        },
        function () {
            console.log('sendToNamedMessage worked')
        },
        function (err) {
            console.log("sendToNamedMessage failed: ", err)
        });
}

//Testing sending to a named window via the inter app bus.
export function sendToUnNamedMessage(RECEIVERS_UUID, topic, data) {
    fin.desktop.InterApplicationBus.send({
            uuid: RECEIVERS_UUID,
            message: data,
            topic: topic,
            cache: 'until-delivered'
        },
        function () {
            console.log('sendToNamedMessage worked')
        },
        function (err) {
            console.log("sendToNamedMessage failed: ", err)
        });
}

export function publishMessage(topic, data) {
    fin.InterApplicationBus.publish(topic, data)
    .then(() => console.log('Published'))
    .catch(err => console.log(err));
}
