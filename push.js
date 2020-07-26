var webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BP_hkM2idSz67LhSC6NMifVt3B4n7iqUon_u48ypTw4-us8bsQuTCQQAWhF_xKzbbmkYvjTVKiuYqClzGZMBy0s",
   "privateKey": "qrIBrwrpHBfllbg009sSUU5i3kfUmEY15gocWvtTXQ0"
};
 
 
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/dVNIiCGRK0g:APA91bHYFEMb0hXwkxvviMMULWqQCO7zUF70Ocl8yZ_T8PxPAFIwaIBgECPfOO6HeSTRJSrMJHm7H0HlqqYlYJ0CA93LPWdKCOiRbVyFWzwl3yZvz1H71T1bgVBrDkVb6F3bIcTeFjWy",
   "keys": {
       "p256dh": "BI9LbTL2PhhZzKoDGzw0/Dt+6SuvPCdeX5oUpj7k88jDa9ITiFgQjMODHzMPgsoUgYFNDElVp5Tl9zhHyOdvrbU=",
       "auth": "39grqP/lQymKA3o9knekIQ=="
    }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
 
var options = {
   gcmAPIKey: '1060576801646',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);