window.onload = function() {
    fetch("/get_room").then(res => res.json()).then(rooms => {
        const article = document.getElementById("article");
        let i = 0;
        let joinArray = [];
        for (const data of rooms.rooms) {
            const datetime = String(data.date + data.time);
            article.innerHTML += "<section><h2>" + data.roomname + "</h2><div><p>" + data.date + " " + data.time + "</p><form method='POST' action='/game'><input type='hidden' name='roomid' value='" + data._id + "'><input type='hidden' name='time' value='" + datetime + "'><input type='submit' value='join'></form></div></section>";
            i += 1;
        }
    });


    const displayModal = document.getElementById("display_modal");
    displayModal.addEventListener("click", (event) => {
        document.getElementById("modal").style.display = "flex";
        const datepicker = document.getElementById("datepicker");
    
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth()+1;
        let day = date.getDate();


        let next_month = new Date(date.getFullYear(), date.getMonth()+1, date.getDate());
        let nyear = next_month.getFullYear();
        let nmonth = next_month.getMonth()+1;
        let nday = next_month.getDate();

        if (day < 10) {
            day = "0" + day;
        }
        if (nday < 10) {
            nday = "0" + nday;
        }
        if (month < 10) {
            month = "0" + month;
        }
        if (nmonth < 10) {
            nmonth = "0" + nmonth;
        }

        datepicker.min = year + "-" + month + "-" + day;
        datepicker.max = nyear + "-" + nmonth + "-" + nday;
        
    }, false);

    const cancelButton = document.getElementById("modal_cancel");
    cancelButton.addEventListener("click", (event) => {
        document.getElementById("modal").style.display = "none";
    }, false);

    const createButton = document.getElementById("create");
    createButton.addEventListener("click", (event) => {
        const datepicker = document.getElementById("datepicker");
        const hour = document.getElementById("hour");
        const minutes = document.getElementById("minutes");
        const roomname = document.getElementById("roomname");

        if (datepicker.value == "" ||
            roomname.value == "")
        {
            alert("未入力の部分があります");
            return;
        }

        const sendData = {
            roomname: roomname.value,
            date: datepicker.value,
            time: hour.value + ":" + minutes.value + ":00"
        };
        const param = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(sendData),
        };
        fetch("/create_room", param).then(res => res.json()).then(data => {
            const article = document.getElementById("article");
            const datetime = String(data.result.date + data.result.time);
            article.innerHTML += "<section><h2>" + data.result.roomname + "</h2><div><p>" + data.result.date + " " + data.result.time + "</p><form method='POST' action='/game'><input type='hidden' name='roomid' value='" + data.result._id + "'><input type='hidden' name='time' value='" + datetime + "'><input type='submit' value='join'></form></div></section>";
        });

        document.getElementById("modal").style.display = "none";
    }, false);

    // const article = document.getElementById("article");

    // for (let i = 0; i < 10; ++i) {
    //     article.innerHTML += "<section><h2>" + i + "test room</h2><div><p>2022-08-25 20:00:00</p><button>join" + i + "</button></div></section>";
    // }
}
