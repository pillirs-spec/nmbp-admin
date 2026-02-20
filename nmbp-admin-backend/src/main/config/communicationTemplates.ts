export const SMS = {
    ADMIN_USER_CREATION: {
        body: `Dear <name>, Your login has been created successfully and the password is <password>. To login, click <url> - ORRIZONTE TECHNOLOGIES`,
        template_id: "1207171682233422309"
    },
    ADMIN_RESET_PASSWORD: {
        body: `Dear <name>, Your password has been reset successfully. Kindly login with password: <password>. - ORRIZONTE TECHNOLOGIES`,
        template_id: "1207171682234517804"
    },
    USER_LOGIN_WITH_OTP: {
        body: `<otp> is the OTP for <module>. This is valid for <time>. Do not share this OTP with anyone. - ORRIZONTE TECHNOLOGIES`,
        template_id: "1207171664715742137"
    },
    ADMIN_SEVA_BOOKING: {
        body: `Dear <name>,Thank you for booking <sevaName> at Sri Maha Prathiyangari Devi Temple. Date: <bookingDate> Booking ID: <bookingId>`,
        template_id: "705325"
    },
    ADMIN_PROMOTIONAL_INFO: {
        body: `Dear <name>, <Description>. click <url> - Shri Maha Pratyangari Devi Management`,
        template_id: "703523"
    }
}


export const WHATSAPP = {
    ADMIN_USER_CREATION: {
        template_id: "261829"
    },
    ADMIN_RESET_PASSWORD: {
        template_id: "261831"
    },
    USER_LOGIN_WITH_OTP: {
        template_id: "261807"
    },
    ADMIN_SEVA_BOOKING: {
        template_id: "754159"
    },
    ADMIN_PROMOTIONAL_INFO:{
        template_id: "769301"
    }

}