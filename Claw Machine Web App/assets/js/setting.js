const Setting = {

    updateSite: () => {
        let form = $("#form_site")
        let title = "Aplikasi"
        let btn = form.find("#btn_site_submit")

        let dataPayload = [
            {value: form.find("#name").val(), message: "Nama Aplikasi can't empty"},
        ]

        const payloadChecker = Common.payloadChecker(dataPayload)

        if(!payloadChecker.status) {
            Common.alert("error", title, payloadChecker.message, {
                confirmButtonText: "Close",
                confirmButtonColor: "var(--bs-danger)"
            })
            return
        }

        Common.ajaxReq(baseUrl("api/home/setting/site-update"), "POST", {
            data: new FormData(form[0]),
            contentType: false,
            processData: false
        }, () => {
            btn.prop("disabled", true).html("loading...")
        }).then(res => {
            Common.alert(res.status ? "success" : "error", title, res.message, {
                confirmButtonText: res.status ? "Ok" : "Close",
                confirmButtonColor: res.status ? "var(--bs-success)" : "var(--bs-danger)"
            }).then(result => {
                if(result.isConfirmed && res.status) {
                    location.reload()
                }
            })
        }).catch(err => {
            Common.alert("error", title, err.responseText, {
                confirmButtonText: "Close",
                confirmButtonColor: "var(--bs-danger)"
            })
        }).finally(() => {
            btn.prop("disabled", false).html("Simpan")
        })
    },

    deleteSite: (name) => {
        let title = "Delete Image"

        Common.alert("question", title, "Are you sure ? want to delete this image ?", {
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            confirmButtonColor: "var(--bs-danger)",
            cancelButtonColor: "var(--bs-secondary)"
        }).then(result => {
            if(result.isConfirmed) {
                Common.ajaxReq(baseUrl(`api/home/setting/site-delete/${name}`), "DELETE", {
                    dataType: "JSON"
                }).then(res => {
                    Common.alert(res.status ? "success" : "error", title, res.message, {
                        confirmButtonText: res.status ? "Ok" : "Close",
                        confirmButtonColor: res.status ? "var(--bs-success)" : "var(--bs-danger)"
                    }).then(result => {
                        if(result.isConfirmed && res.status) {
                            location.reload()
                        }
                    })
                })
            }
        }).catch(err => {
            Common.alert("error", title, err.responseText, {
                confirmButtonText: "Close",
                confirmButtonColor: "var(--bs-danger)"
            })
        })
    },

    updateAccount: () => {
        let form = $("#form_account")
        let btn = form.find("#btn_account_submit")
        let title = "Akun"

        let dataPayload = [
            {value: form.find("#name").val(), message: "Nama can't empty"},
            {value: form.find("#username").val(), message: "Username can't empty"}
        ]

        const payloadChecker = Common.payloadChecker(dataPayload)

        if(!payloadChecker.status) {
            Common.alert("error", title, payloadChecker.message, {
                confirmButtonText: "Close",
                confirmButtonColor: "var(--bs-danger)"
            })
            return
        }

        Common.ajaxReq(baseUrl(`api/home/setting/account-update`), "PUT", {
            data: form.serialize(),
            dataType: "JSON"
        }, () => {
            btn.prop("disabled", true).html("loading...")
        }).then(res => {
            Common.alert(res.status ? "success" : "error", title, res.message, {
                confirmButtonText: res.status ? "Ok" : "Close",
                confirmButtonColor: res.status ? "var(--bs-success)" : "var(--bs-danger)"
            }).then(result => {
                if(result.isConfirmed && res.status) {
                    location.reload()
                }
            })
        }).catch(err => {
            Common.alert("error", title, err.responseText, {
                confirmButtonText: "Close",
                confirmButtonColor: "var(--bs-danger)"
            })
        }).finally(() => {
            btn.prop("disabled", false).html("Save")
        })
    },

    updateGame: () => {
        let form = $("#form_game")
        let btn = form.find("#btn_game_submit")
        let title = "Game"

        let dataPayload = [
            {value: form.find("#reward_message_success").val(), message: "Custom Pesan Menang can't empty"},
            {value: form.find("#reward_message_failed").val(), message: "Custom Pesan Zonk can't empty"},
            {value: form.find("#reward_redirect").val(), message: "Link Redirect Ketika Menang can't empty"}
        ]

        const payloadChecker = Common.payloadChecker(dataPayload)

        if(!payloadChecker.status) {
            Common.alert("error", title, payloadChecker.message, {
                confirmButtonText: "Close",
                confirmButtonColor: "var(--bs-danger)"
            })
            return
        }

        Common.ajaxReq(baseUrl(`api/home/game/update-custom`), "PUT", {
            data: form.serialize(),
            dataType: "JSON"
        }, () => {
            btn.prop("disabled", true).html("loading...")
        }).then(res => {
            Common.alert(res.status ? "success" : "error", title, res.message, {
                confirmButtonText: res.status ? "Ok" : "Close",
                confirmButtonColor: res.status ? "var(--bs-success)" : "var(--bs-danger)"
            }).then(result => {
                if(result.isConfirmed && res.status) {
                    location.reload()
                }
            })
        }).catch(err => {
            Common.alert("error", title, err.responseText, {
                confirmButtonText: "Close",
                confirmButtonColor: "var(--bs-danger)"
            })
        }).finally(() => {
            btn.prop("disabled", false).html("Simpan")
        })
    }

}
