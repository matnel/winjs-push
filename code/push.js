function Push() {

    console.log('ready channel');

    this._channel = null;
    var channelH = Windows.Networking.PushNotifications.PushNotificationChannelManager.createPushNotificationChannelForApplicationAsync();


   window._client = new Microsoft.WindowsAzure.MobileServices.MobileServiceClient(
        "azure-url",
        "secret"
     );

   var p = this;

    channelH.then(function (channel) {
        console.log('uri ' + channel.uri);

        window._client.getTable('Channel').insert({ uri: channel.uri });

        p._channel = channel;

        // active listening
        p._channel.addEventListener('pushnotificationreceived', function (e) { p._listen(e); });
    });

}

Push.prototype.send = function (to, message) {
    window._client.getTable('Push')
        .insert({ data: JSON.stringify(message) })
        .done(
            $.noop,
            function (e) { console.log('error'); console.log(e); }
        );
}

Push.prototype.recieve = function (message) {
    console.log('recieved ' + message);
}

Push.prototype._listen = function (event) {
    var p = this;
    // only reach to raw notificaions
    // XXX FIXME TEMP HACK
    console.log(event.notificationType);
    if (event.notificationType == 3) {
        p.recieve( JSON.parse( event.rawNotification.content ) );
    }
}
