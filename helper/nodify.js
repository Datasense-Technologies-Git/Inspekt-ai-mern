const { ExtendAlert } = require("../models/booking");
// Customer
// AAAA8gvfPJg:APA91bH1eI3I9OOPxZBAr92rCcK1N0TCq4NCCZNWsdui_gUUT7I5s9nm92T2BC6EguhIMJyOywGSZDMok8Hrt8IePJS-QtR25SSwsP8Rg3XuGH1dZvPkey-bfGc_2b82MvBqblVw1eKR
// Attender
// AAAAqri4PBQ:APA91bGv76uZ0h0HvxhbONIC3OhRuVefRSjZ0OL6pjhUun-mgWbJfUYYP2SxL6UX5GMxeLop27rb3oUg_2e5VEqocqHWVoJVNKBR0igz30YsF1G5Tso8xIxHYk-yO0NyHYHWOBYFJpJS
var gcm = require("node-gcm");
var request = require("request");
const sendmail = require("sendmail")();
var moment = require("moment");
module.exports = {
  sendTestFCM: function ($title, $body) {
    var $token =
      "f7PvT_cqOV8:APA91bH1348HoELIzBvvJi7THtTjkOvH_BGFHnfarNwt5M57sLUUlWWv82nHpqOVTHzJeXe0GfQ_1cOoBrgYyGEAZEcOKuwkPR9NhoMdINhco83p7L1N3Wpf3rrHbTNx0tIqdl-i4xCP";

    var message = new gcm.Message({
      notification: {
        title: "Extend Alert",
        icon: "ic_launcher",
        click_action: "Extend",
        body: "Extend Alert",
      },
      data: {
        data1: "200190-23939+1+1",
        data2: "11:00 to 12:00",
        data3: "AN2328301-AN13421-Anna Nagar",
        data4: "TN21TR323+4-Wheeler",
      },
    });
    var registrationTokens = [];
    registrationTokens.push($token);
    var sender = new gcm.Sender(
      "AAAAqri4PBQ:APA91bGv76uZ0h0HvxhbONIC3OhRuVefRSjZ0OL6pjhUun-mgWbJfUYYP2SxL6UX5GMxeLop27rb3oUg_2e5VEqocqHWVoJVNKBR0igz30YsF1G5Tso8xIxHYk-yO0NyHYHWOBYFJpJS"
    );
    sender.send(
      message,
      { registrationTokens: registrationTokens },
      function (err, response) {
        if (err) {
          return 0;
        } else {
          return 1;
        }
      }
    );
  },

  sendSMS: function ($value, $msg) {
    // url: 'http://login.bulksmsservice.net.in/api/mt/SendSMS?apikey=oeYg3lRAr0ibzFljufm9NA&senderid=GLOBAL&channel=Trans&DCS=0&flashsms=0&number='+$value+'&text='+escape($msg),
    // sms_url='http://sms.360marketings.in/vendorsms/pushsms.aspx?user=mdakshna&password=Datasense123$&msisdn='+$value+'&sid=GLOBAL&msg='+escape($msg)+'&fl=0&gwid=2',

    //https://sms.nettyfish.com/vendorsms/pushsms.aspx?apikey=4c324a64-af41-47f5-ac4b-6e32c3844e2d&clientId=4fbb0ebb-a3e9-4b88-971f-cb315266c07b&msisdn='+$value+'&sid=MDASDD&msg='+escape($msg)+'&fl=0&gwid=2
    request(
      {
        url:
          "http://login.bulksmsinmumbai.com/api/mt/SendSMS?user=mdakshna&password=mdakshnaaa&senderid=GCCPAR&channel=Trans&DCS=0&flashsms=0&number=" +
          $value +
          "&text=" +
          escape($msg) +
          "&route=8",

        method: "GET",
      },
      function (error, response, body) {
        if (error) {
          return 0;
        } else {
          return 1;
        }
      }
    );
  },
  sendCustFCM: function ($title, $body) {
    var $token =
      "f6CGBXAJx78:APA91bGnWZ7L3ZEP3FLd165n7ymHSlpbcuCeQuKy9B3ejiU_Lg7tzhOU_FsN2FLnoEUBM0TgdTsyKifQiLVntIWSCJyvP9jPCACRFXHxcmxIr3p6QAKMq6dj4O2msUF5IaGZmhfjyZK3";
    var i = 10;
    var message = new gcm.Message({
      notification: {
        title: "Extend Alert",
        icon: "ic_launcher",
        // badge:"100",
        click_action: "Extend",
        body: "Extend Alert",
      },
      data: {
        data1: "200190-23939+1+1",
        data2: "11:00 to 12:00",
        data3: "AN2328301-AN13421-Anna Nagar",
        data4: "TN21TR323+4-Wheeler",
      },
    });
    var registrationTokens = [];
    registrationTokens.push($token);
    var sender = new gcm.Sender(
      "AAAA8gvfPJg:APA91bH1eI3I9OOPxZBAr92rCcK1N0TCq4NCCZNWsdui_gUUT7I5s9nm92T2BC6EguhIMJyOywGSZDMok8Hrt8IePJS-QtR25SSwsP8Rg3XuGH1dZvPkey-bfGc_2b82MvBqblVw1eKR"
    );
    sender.send(
      message,
      { registrationTokens: registrationTokens },
      function (err, response) {
        if (err) {
          return 0;
        } else {
          return 1;
        }
      }
    );
  },

  sendCustExtendTimeFCM: function (
    title,
    body,
    bookingid,
    slotnumber,
    vehicletype,
    token,
    start_time,
    end_time,
    lotnumber,
    area,
    vehicle_number,
    duration,
    amount
  ) {
    //var $token = 'ft7xHroC15I:APA91bF7ZjENiujLHSKwLYDju-FpXFuzRUVyEF3E6NsuAsmTIKbP4DWky2ecuKwv4Iah6SuH1yeJVjl0Q4-jWI_hqDPkvIWWeY3bJLjsqRdrHSqVbRss81DjixYcQc8B2BdYuoqnHty1'

    var message = new gcm.Message({
      notification: {
        title: title,
        icon: "ic_launcher",
        click_action: "Extend",
        body: body,
      },
      data: {
        data1: bookingid + "+" + amount + "+" + duration,
        data2: start_time + "to" + end_time,
        data3: lotnumber + "-" + slotnumber + "-" + area,
        data4: vehicle_number + "+" + vehicletype,
      },
    });
    // data1:"20190219-617374+5+1 Hours",
    //         data2:"19-02-2019 10:30:00to18-02-2019 17:40:33",
    //         data3:"ANTES0005-AN01003-Gadaka/Shembire",
    //         data4:"TN21TR323+2-Wheeler"
    var registrationTokens = [];
    registrationTokens.push(token);
    var sender = new gcm.Sender(
      "AAAA8gvfPJg:APA91bH1eI3I9OOPxZBAr92rCcK1N0TCq4NCCZNWsdui_gUUT7I5s9nm92T2BC6EguhIMJyOywGSZDMok8Hrt8IePJS-QtR25SSwsP8Rg3XuGH1dZvPkey-bfGc_2b82MvBqblVw1eKR"
    );
    sender.send(
      message,
      { registrationTokens: registrationTokens },
      function (err, response) {
        if (err) {
          return 0;
        } else {
          return 1;
        }
      }
    );
  },
  sendCustPreFCM: function (
    title,
    body,
    bookingid,
    slotnumber,
    vehicletype,
    token,
    start_time,
    end_time,
    lotnumber,
    area,
    vehicle_number,
    duration,
    amount
  ) {
    //var token = 'ft7xHroC15I:APA91bF7ZjENiujLHSKwLYDju-FpXFuzRUVyEF3E6NsuAsmTIKbP4DWky2ecuKwv4Iah6SuH1yeJVjl0Q4-jWI_hqDPkvIWWeY3bJLjsqRdrHSqVbRss81DjixYcQc8B2BdYuoqnHty1'

    var message = new gcm.Message({
      notification: {
        title: title,
        icon: "ic_launcher",
        click_action: "BookingConfirmation",
        body: body,
      },
      data: {
        data1: bookingid + "+" + amount + "+" + duration,
        data2: start_time + "to" + end_time,
        data3: lotnumber + "-" + slotnumber + "-" + area,
        data4: vehicle_number + "+" + vehicletype,
      },
    });
    var registrationTokens = [];
    registrationTokens.push(token);
    var sender = new gcm.Sender(
      "AAAA8gvfPJg:APA91bH1eI3I9OOPxZBAr92rCcK1N0TCq4NCCZNWsdui_gUUT7I5s9nm92T2BC6EguhIMJyOywGSZDMok8Hrt8IePJS-QtR25SSwsP8Rg3XuGH1dZvPkey-bfGc_2b82MvBqblVw1eKR"
    );
    sender.send(
      message,
      { registrationTokens: registrationTokens },
      function (err, response) {
        if (err) {
          return 0;
        } else {
          return 1;
        }
      }
    );
  },
  sendCuststartUpFCM: function (
    title,
    body,
    bookingid,
    token,
    start_time,
    end_time,
    server_time,
    duration,
    latitude,
    longitude
  ) {
    //var token = 'euItimoA5RI:APA91bEgUdfV66PJUA1Coy0oZQhA0v5VVOjIENZZmL-vIUPD984DQMZHljSPyx_e2KMtWED7h4EFmdeSZI06p32M_AaRXK2TzSG48scxIHyp4IrnjRYTtxuP9HDCTIHWFt_Bjh8gs4Sh'

    var message = new gcm.Message({
      notification: {
        title: title,
        icon: "ic_launcher",
        click_action: "Navigation",
        body: body,
      },
      data: {
        data1: latitude + "-" + longitude,
        data2: duration,
        data3: start_time + "to" + end_time,
        data4: bookingid,
      },
    });
    var registrationTokens = [];
    registrationTokens.push(token);
    var sender = new gcm.Sender(
      "AAAA8gvfPJg:APA91bH1eI3I9OOPxZBAr92rCcK1N0TCq4NCCZNWsdui_gUUT7I5s9nm92T2BC6EguhIMJyOywGSZDMok8Hrt8IePJS-QtR25SSwsP8Rg3XuGH1dZvPkey-bfGc_2b82MvBqblVw1eKR"
    );
    sender.send(
      message,
      { registrationTokens: registrationTokens },
      function (err, response) {
        if (err) {
          return 0;
        } else {
          return 1;
        }
      }
    );
  },
  sendCustWarningFCM: function (title, body, token) {
    //var token = 'euItimoA5RI:APA91bEgUdfV66PJUA1Coy0oZQhA0v5VVOjIENZZmL-vIUPD984DQMZHljSPyx_e2KMtWED7h4EFmdeSZI06p32M_AaRXK2TzSG48scxIHyp4IrnjRYTtxuP9HDCTIHWFt_Bjh8gs4Sh'

    var message = new gcm.Message({
      notification: {
        title: title,
        icon: "ic_launcher",
        click_action: "CustomerAlert",
        body: body,
      },
    });
    var registrationTokens = [];
    registrationTokens.push(token);
    var sender = new gcm.Sender(
      "AAAA8gvfPJg:APA91bH1eI3I9OOPxZBAr92rCcK1N0TCq4NCCZNWsdui_gUUT7I5s9nm92T2BC6EguhIMJyOywGSZDMok8Hrt8IePJS-QtR25SSwsP8Rg3XuGH1dZvPkey-bfGc_2b82MvBqblVw1eKR"
    );
    sender.send(
      message,
      { registrationTokens: registrationTokens },
      function (err, response) {
        if (err) {
          return 0;
        } else {
          return 1;
        }
      }
    );
  },
  sendCustBlockChangeFCM: function ($token, $title, $body) {
    //var $token = 'f7ORjUzimSg:APA91bH3hTTLzKHqgAPmKivOvmgHO3mZ0VY81luggQZsxg2NuaqZ2dCUUwN2OdNqrNATrTsQX28wqZ2JX3TA9UgvD8t4gm1hIbaQr6wCdDAclXckQ5tQD_n3zs_1evo7KEwFdIEdT2JW'

    var message = new gcm.Message({
      notification: {
        title: $title,
        icon: "ic_launcher",
        click_action: "Block",
        body: $body,
      },
      data: {
        msg: "Customer",
      },
    });
    var registrationTokens = [];
    registrationTokens.push($token);
    var sender = new gcm.Sender(
      "AAAA8gvfPJg:APA91bH1eI3I9OOPxZBAr92rCcK1N0TCq4NCCZNWsdui_gUUT7I5s9nm92T2BC6EguhIMJyOywGSZDMok8Hrt8IePJS-QtR25SSwsP8Rg3XuGH1dZvPkey-bfGc_2b82MvBqblVw1eKR"
    );
    sender.send(
      message,
      { registrationTokens: registrationTokens },
      function (err, response) {
        if (err) {
          return 0;
        } else {
          return 1;
        }
      }
    );
  },
  sendCustVehicleArrivedFCM: function ($token, $title, $body) {
    //var $token = 'f7ORjUzimSg:APA91bH3hTTLzKHqgAPmKivOvmgHO3mZ0VY81luggQZsxg2NuaqZ2dCUUwN2OdNqrNATrTsQX28wqZ2JX3TA9UgvD8t4gm1hIbaQr6wCdDAclXckQ5tQD_n3zs_1evo7KEwFdIEdT2JW'

    var message = new gcm.Message({
      notification: {
        title: $title,
        icon: "ic_launcher",
        click_action: "Booking",
        body: $body,
      },
      data: {
        msg: "Customer",
      },
    });
    var registrationTokens = [];
    registrationTokens.push($token);
    var sender = new gcm.Sender(
      "AAAA8gvfPJg:APA91bH1eI3I9OOPxZBAr92rCcK1N0TCq4NCCZNWsdui_gUUT7I5s9nm92T2BC6EguhIMJyOywGSZDMok8Hrt8IePJS-QtR25SSwsP8Rg3XuGH1dZvPkey-bfGc_2b82MvBqblVw1eKR"
    );
    sender.send(
      message,
      { registrationTokens: registrationTokens },
      function (err, response) {
        if (err) {
          return 0;
        } else {
          return 1;
        }
      }
    );
  },
  sendAttenFCM: function ($token, $title, $body, $bookingid) {
    var message = new gcm.Message({
      notification: {
        title: $title,
        icon: "ic_launcher",
        click_action: "DetailsActivity",
        body: $body,
      },
      data: {
        invoice: $bookingid,
        vehicle_number: "0",
        slotnumber: "0",
        datatitle: $title,
        databody: $body,
        mActiivty: "noti",
      },
    });
    var registrationTokens = [];
    registrationTokens.push($token);
    var sender = new gcm.Sender(
      "AAAAqri4PBQ:APA91bGv76uZ0h0HvxhbONIC3OhRuVefRSjZ0OL6pjhUun-mgWbJfUYYP2SxL6UX5GMxeLop27rb3oUg_2e5VEqocqHWVoJVNKBR0igz30YsF1G5Tso8xIxHYk-yO0NyHYHWOBYFJpJS"
    );
    sender.send(
      message,
      { registrationTokens: registrationTokens },
      function (err, response) {
        if (err) {
          return 0;
        } else {
          return 1;
        }
      }
    );
  },
  //sendAttenVideoFCM(token,title,body,'0',platenum,slotnumber,lotname)
  sendAttenVideoFCM: function (
    token,
    title,
    body,
    invoice,
    vehiclenum,
    slotnum,
    lotname
  ) {
    var message = new gcm.Message({
      notification: {
        title: title,
        icon: "ic_launcher",
        click_action: "DetailsActivity",
        body: body,
      },
      data: {
        invoice: invoice,
        vehicle_number: title,
        lotname: body,
        slotnumber: slotnum,
        mActiivty: "noti",
      },
    });
    var registrationTokens = [];
    registrationTokens.push(token);
    var sender = new gcm.Sender(
      "AAAAqri4PBQ:APA91bGv76uZ0h0HvxhbONIC3OhRuVefRSjZ0OL6pjhUun-mgWbJfUYYP2SxL6UX5GMxeLop27rb3oUg_2e5VEqocqHWVoJVNKBR0igz30YsF1G5Tso8xIxHYk-yO0NyHYHWOBYFJpJS"
    );
    sender.send(
      message,
      { registrationTokens: registrationTokens },
      function (err, response) {
        if (err) {
          return 0;
        } else {
          return 1;
        }
      }
    );
  },
  TestsendAttenVideoFCM: function (
    token,
    title,
    body,
    invoice,
    vehiclenum,
    slotnum
  ) {
    var message = new gcm.Message({
      notification: {
        title: title,
        icon: "ic_launcher",
        click_action: "DetailsActivity",
        body: body,
      },
      data: {
        invoice: invoice,
        vehicle_number: vehiclenum,
        slotnumber: slotnum,
      },
    });
    var registrationTokens = [];
    registrationTokens.push(token);
    var sender = new gcm.Sender(
      "AAAAqri4PBQ:APA91bGv76uZ0h0HvxhbONIC3OhRuVefRSjZ0OL6pjhUun-mgWbJfUYYP2SxL6UX5GMxeLop27rb3oUg_2e5VEqocqHWVoJVNKBR0igz30YsF1G5Tso8xIxHYk-yO0NyHYHWOBYFJpJS"
    );
    sender.send(
      message,
      { registrationTokens: registrationTokens },
      function (err, response) {
        if (err) {
          return 0;
        } else {
          return 1;
        }
      }
    );
  },
  sendSMSWithTime: function ($name, $mail) {
    var _time = moment().format("DD-MM-YYYY HH:mm:ss");
    var htmpage =
      '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html;charset=utf-8"/><meta name="viewport" content="width=device-width"/><title>GCC Smart Parking System</title></head><body style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;color:#2a2a2a;font-family:Arial, sans-serif;font-size:18px;line-height:18px;margin:0 auto;padding:0;width:100% !important"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;background-color: #eae9ea;"><tr><td valign="top" align="center" style="border-collapse: collapse"><table width="600" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse; margin: 0px 30px 10px 30px"><tr><td align="left" style="border-collapse: collapse; width: 600px"><table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-collapse: collapse; margin-top: 10px;"><tr><td align="left" style="border-collapse: collapse"><table width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse"><tr style="margin: 0; padding: 0"><td align="center" style="border-collapse: collapse; border-spacing: 0; padding: 20px"><p style="font-size: 18px; line-height: 26px; margin: 0; padding: 0"><a target="_blank" href="http://www.gccsmartparking.com/" style="color: #1B8EBA; text-decoration: none"><img style="width: 80px;" src="http://103.120.178.246/~parking/public_html/assets/images/logo/logo.png" alt=""></a></p></td></tr></table></td></tr></table><table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-collapse: collapse; margin-top: 10px"><tr><td align="left" style="border-collapse: collapse"><table width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse"><tr style="margin: 0; padding: 0"><td align="center" style="border-collapse: collapse; border-spacing: 0; padding: 20px 50px 10px"><table cellspacing="0" cellpadding="0" style="min-width:100%;margin:0 auto;width:100%;border:0"><tr><td style="background-color:#f6f6f7;padding:30px 20px 10px"><p style="color:#465059;font-size:24px;font-weight:bold;text-align:center;margin:0">GCC Smart Parking System</p></td></tr><tr><td style="background-color:#f6f6f7;padding:0 20px 20px"><p style="font-size:14px;color:#A1A2A5;text-align:center;margin:0">Security Alert</p></td></tr><tr><td style="background-color:#fff;padding:20px"><p style="font-size:14px;color:#555;line-height: 22px;margin:0; text-align: center;">Hi, you have accessed your GCC Smart Parking account on</p><p style="font-size:14px;color:#555;line-height: 22px;margin:0; text-align: center;"><strong>' +
      _time +
      '</strong></p></td></tr><tr><td style="background-color:#fff;padding:20px"><p style="font-size:14px;color:#555;line-height: 22px;margin:0; text-align: center;">* If you have not accessed, please change your password immediately.</p></td></tr><tr><td style="background-color:#fff;padding:0 20px 30px;-webkit-border-radius:0 0 8px 8px;-moz-border-radius:0 0 8px 8px;border-radius:0 0 8px 8px"></td></tr></table></td></tr></table></td></tr><table style="background-color: #ffffff; border-collapse: collapse; margin-top: 10px" cellspacing="0" cellpadding="0" border="0" width="100%"><tbody><tr><td style="border-collapse: collapse" align="left"><table style="border-collapse: collapse" cellspacing="0" cellpadding="0" border="0" width="100%"><tbody><tr><td style="border-collapse: collapse; font-size: 16px; line-height: 26px; padding: 20px 40px" align="center"><div><div>Questions? Feedback?</div><div>Visit our <a style="color: #eb1478; font-weight: bold; text-decoration: none" href="#">Help Center</a> or contact our <a style="color: #eb1478; font-weight: bold; text-decoration: none" href="#">Customer Happiness</a> team.</div><div style="font-size: 12px; margin-top: 10px">Sincerely,</div><div style="font-size: 15px; font-weight: bold">The GCC Smart Parking System</div><div style="font-size: 12px; font-weight: bold">support@gccsmartparkingsystem.com</div></div></td></tr></tbody></table></td></tr></tbody></table><table style="border-collapse: collapse" cellspacing="0" cellpadding="0" border="0" width="100%"><tbody><tr><td style="border-collapse: collapse; padding: 20px;" align="center"><p style="color: #000001; font-family: Arial, sans-serif; font-size: 13px; line-height: 18px; margin: 0; padding: 0"><a href="http://www.datasense.in/" target="_blank" style="color: #2a2a2a; text-decoration: none">Powered by DataSense Technologies</a></p></td></tr></tbody></table></table></td></tr></table></body></html>';
    sendmail(
      {
        from: "GCC Smart Parking<no-reply@gccsmartparking.com>",
        to: $mail,
        subject: "New Login to GCC Smart Parking System",
        html: htmpage,
      },
      function (err, reply) {
        return 1;
      }
    );
  },
  sendCustCloseBookFCM: function (title, body, token) {
    var message = new gcm.Message({
      notification: {
        title: title,
        icon: "ic_launcher",
        click_action: "History",
        body: body,
      },
    });
    var registrationTokens = [];
    registrationTokens.push(token);
    var sender = new gcm.Sender(
      "AAAA8gvfPJg:APA91bH1eI3I9OOPxZBAr92rCcK1N0TCq4NCCZNWsdui_gUUT7I5s9nm92T2BC6EguhIMJyOywGSZDMok8Hrt8IePJS-QtR25SSwsP8Rg3XuGH1dZvPkey-bfGc_2b82MvBqblVw1eKR"
    );
    sender.send(
      message,
      { registrationTokens: registrationTokens },
      function (err, response) {
        if (err) {
          return 0;
        } else {
          return 1;
        }
      }
    );
  },
  sendCustChangeBookFCM: function (title, body, token) {
    var message = new gcm.Message({
      notification: {
        title: title,
        icon: "ic_launcher",
        click_action: "History",
        body: body,
      },
    });
    var registrationTokens = [];
    registrationTokens.push(token);
    var sender = new gcm.Sender(
      "AAAA8gvfPJg:APA91bH1eI3I9OOPxZBAr92rCcK1N0TCq4NCCZNWsdui_gUUT7I5s9nm92T2BC6EguhIMJyOywGSZDMok8Hrt8IePJS-QtR25SSwsP8Rg3XuGH1dZvPkey-bfGc_2b82MvBqblVw1eKR"
    );
    sender.send(
      message,
      { registrationTokens: registrationTokens },
      function (err, response) {
        if (err) {
          return 0;
        } else {
          return 1;
        }
      }
    );
  },
  sendEMAILWithOtp: function (mail, token) {
    var _time = moment().format("DD-MM-YYYY HH:mm:ss");
    var htmpage =
      '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html;charset=utf-8"/><meta name="viewport" content="width=device-width"/><title>GCC Smart Parking System</title></head><body style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;color:#2a2a2a;font-family:Arial, sans-serif;font-size:18px;line-height:18px;margin:0 auto;padding:0;width:100% !important"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;background-color: #eae9ea;"><tr><td valign="top" align="center" style="border-collapse: collapse"><table width="600" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse; margin: 0px 30px 10px 30px"><tr><td align="left" style="border-collapse: collapse; width: 600px"><table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-collapse: collapse; margin-top: 10px;"><tr><td align="left" style="border-collapse: collapse"><table width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse"><tr style="margin: 0; padding: 0"><td align="center" style="border-collapse: collapse; border-spacing: 0; padding: 20px"><p style="font-size: 18px; line-height: 26px; margin: 0; padding: 0"><a target="_blank" href="http://www.gccsmartparking.com/" style="color: #1B8EBA; text-decoration: none"><img style="width: 80px;" src="http://103.120.178.246/~parking/public_html/assets/images/logo/logo.png" alt=""></a></p></td></tr></table></td></tr></table><table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-collapse: collapse; margin-top: 10px"><tr><td align="left" style="border-collapse: collapse"><table width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse"><tr style="margin: 0; padding: 0"><td align="center" style="border-collapse: collapse; border-spacing: 0; padding: 20px 50px 10px"><table cellspacing="0" cellpadding="0" style="min-width:100%;margin:0 auto;width:100%;border:0"><tr><td style="background-color:#f6f6f7;padding:30px 20px 10px"><p style="color:#465059;font-size:24px;font-weight:bold;text-align:center;margin:0">GCC Smart Parking System</p></td></tr><tr><td style="background-color:#f6f6f7;padding:0 20px 20px"><p style="font-size:14px;color:#A1A2A5;text-align:center;margin:0">Security Alert</p></td></tr><tr><td style="background-color:#fff;padding:20px"><p style="font-size:14px;color:#555;line-height: 22px;margin:0; text-align: center;">Your one-time password (OTP) is </p><p style="font-size:14px;color:#555;line-height: 22px;margin:0; text-align: center;"><strong>' +
      token +
      '</strong></p></td></tr><tr><td style="background-color:#fff;padding:20px"><p style="font-size:14px;color:#555;line-height: 22px;margin:0; text-align: center;">* If you have not accessed, please change your password immediately.</p></td></tr><tr><td style="background-color:#fff;padding:0 20px 30px;-webkit-border-radius:0 0 8px 8px;-moz-border-radius:0 0 8px 8px;border-radius:0 0 8px 8px"></td></tr></table></td></tr></table></td></tr><table style="background-color: #ffffff; border-collapse: collapse; margin-top: 10px" cellspacing="0" cellpadding="0" border="0" width="100%"><tbody><tr><td style="border-collapse: collapse" align="left"><table style="border-collapse: collapse" cellspacing="0" cellpadding="0" border="0" width="100%"><tbody><tr><td style="border-collapse: collapse; font-size: 16px; line-height: 26px; padding: 20px 40px" align="center"><div><div>Questions? Feedback?</div><div>Visit our <a style="color: #eb1478; font-weight: bold; text-decoration: none" href="#">Help Center</a> or contact our <a style="color: #eb1478; font-weight: bold; text-decoration: none" href="#">Customer Happiness</a> team.</div><div style="font-size: 12px; margin-top: 10px">Sincerely,</div><div style="font-size: 15px; font-weight: bold">The GCC Smart Parking System</div><div style="font-size: 12px; font-weight: bold">support@gccsmartparkingsystem.com</div></div></td></tr></tbody></table></td></tr></tbody></table><table style="border-collapse: collapse" cellspacing="0" cellpadding="0" border="0" width="100%"><tbody><tr><td style="border-collapse: collapse; padding: 20px;" align="center"><p style="color: #000001; font-family: Arial, sans-serif; font-size: 13px; line-height: 18px; margin: 0; padding: 0"><a href="http://www.datasense.in/" target="_blank" style="color: #2a2a2a; text-decoration: none">Powered by DataSense Technologies</a></p></td></tr></tbody></table></table></td></tr></table></body></html>';
    sendmail(
      {
        from: "GCC Smart Parking<no-reply@gccsmartparking.com>",
        to: mail,
        subject: "OTP to access GCC Smart Parking account",
        html: htmpage,
      },
      function (err, reply) {
        return 1;
      }
    );
  },
};
