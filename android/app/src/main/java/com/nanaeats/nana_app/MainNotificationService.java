package com.nanaeats.nana_app;
import expo.modules.notifications.service.ExpoFirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.intercom.reactnative.IntercomModule;

public class MainNotificationService extends ExpoFirebaseMessagingService {

  @Override
  public void onNewToken(String refreshedToken) {
    IntercomModule.sendTokenToIntercom(getApplication(), refreshedToken);
    super.onNewToken(refreshedToken);
  }

  @Override
  public void onMessageReceived(RemoteMessage remoteMessage) {
    if (IntercomModule.isIntercomPush(remoteMessage)) {
      IntercomModule.handleRemotePushMessage(getApplication(), remoteMessage);
    } else {
      super.onMessageReceived(remoteMessage);
    }
  }
}