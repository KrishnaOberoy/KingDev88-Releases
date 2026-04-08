const Main = {

    checkVoucher: () => {
        let code = Cookies.get("voucher_code")
        if(typeof code !== "undefined") {
            Common.ajaxReq(baseUrl(`check/${code}`), "GET", {
                dataType: "JSON"
            }, () => {
                $("body").prepend(`<div id="preload" class="d-flex align-items-center justify-content-center text-dark">Loading...</div>`)
            }).then(res => {
                remaning_left = res.remaining_tokens
                if(res.status) {
                    $("#ungame").remove();
                    $("#tokenPlay").html(`${res.remaining_tokens} Token`)
                    return
                }

                Common.alert("error", "Redeem", res.message, {
                    confirmButtonText: "Tutup",
                    confirmButtonColor: "var(--bs-danger)",
                    allowOutsideClick: false,
                    allowEscapeKey: false
                })

                Cookies.remove("voucher_code")
            }).catch(err => {
                Cookies.remove("voucher_code");
            }).finally(() => {
                $("#preload").remove();
            })
        }
    },

    redeemVoucher: () => {
        let btn = $("#btn_redeem")
        let title = "Redeem Voucher"
        let tokenPlay = $('#tokenPlay')
        let code = $("#voucher_code").val()
        let dataPayload = [
            {value: code, message: "Kode Voucher tidak boleh kosong"}
        ]

        const payloadChecker = Common.payloadChecker(dataPayload)

        if(!payloadChecker.status) {
            Common.alert("error", title, payloadChecker.message, {
                confirmButtonText: "Close",
                confirmButtonColor: "var(--bs-danger)",
                allowOutsideClick: false,
                allowEscapeKey: false
            })
            return
        }

        Common.ajaxReq(baseUrl("redeem"), "POST", {
            data: JSON.stringify({ code: code }),
            contentType: "application/json",
            dataType: "JSON"
        }, () => {
            btn.prop("disabled", true).html("loading...")
        }).then(res => {
            if(res.status) {
                Cookies.set("voucher_code", code, { expires: 7 })
                Common.alert("success", title, res.message, {
                    confirmButtonText: "Ok",
                    confirmButtonColor: "var(--bs-success)",
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).then(result => {
                    if(result.isConfirmed) {
                        $("#ungame").remove()
                        tokenPlay.html(`${res.remaining_tokens} Token`)
                        remaning_left = res.remaining_tokens
                    }
                })
            } else {
                 Common.alert("error", title, res.message, {
                    confirmButtonText: "Close",
                    confirmButtonColor: "var(--bs-danger)"
                })
            }
        }).catch(err => {
            Common.alert("error", title, "Voucher tidak valid", {
                confirmButtonText: "Close",
                confirmButtonColor: "var(--bs-danger)"
            })
        }).finally(() => {
            btn.prop("disabled", false).html("Mulai")
        })
    }

}

$(window).on("load", () => {
    Main.checkVoucher()
    $("form").trigger("reset")
})
