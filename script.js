const join = document.getElementById('join');

join.onclick = async()=>{
    const callFrame = DailyIframe.createFrame(document.getElementById('video-container'),{
        showLeaveButton: true,
    });

    await callFrame.join({
        url:"https://astra-celestine.daily.co/campfire-portal-dev",
        userName: `Campfire ${document.getElementById("event-name").value}`,
        allowUserNameChange: false,
    });
    console.log("joined");

    callFrame.setUserName(`Campfire ${document.getElementById("event-name").value}`);
}