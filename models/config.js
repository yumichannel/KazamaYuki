module.exports = {
    token: process.env.token,
    prefix: ";",
    ownerid: process.env.owner,
    ytapikey: process.env.ytapikey,
    test:"test?",
    cmdType:[
        'general',
        'image',
        'bot',
        'game',
        'admin',
        'creator'
    ],
    language:[
        "en",
        "vi"
    ],
    translate:{
        admin_warn:{
            en: "Warning! This command requires ADMINISTRATOR permission",
            vi: "@user nii, anh không phải quản lý-san nên em không làm đâu"
        },
        owner_warn:{
            en: "Warning! This command requires CREATOR permission",
            vi: "Em chỉ làm điều đó với Yui-nii thôi (> w <\")"
        },
        prefix_warn:{
            en: "Server prefix changed to `@prefix`",
            vi: "Quản lý-san đã thay đổi tiền tố câu lệnh thành `@prefix`"
        },
        language_warn:{
            en: [
                "Language set to English complete!",
                "Your language is not available"
            ],
            vi: [
                "Quản lý-san, Tiếng việt đã được thiết lập thành công!",
                "Quản lý-san, em không biết ngôn ngữ đó đâu >_<"
            ]
        },
        cooldown_warn:{
            en:"You are too fast, please wait!",
            vi:"Xin hãy nhẹ nhàng với em, nii-chan ;w;"
        },
        greeting_warn:{
            del_success:{
                en:"",
                vi:""
            },
            delall_success:{
                en:"",
                vi:""
            },
            del_fail:{
                en:"",
                vi:""
            },
            del_cancel:{
                en:"",
                vi:""
            },
            confirm:{
                en:"",
                vi:""
            }
        }
    }
};
