const Game = {

    update: () => {
        let form = $("#form_layouts")
        let title = "Upload File"
        let btn = form.find("#btn_submit")

        Common.ajaxReq(baseUrl("api/home/game/update"), "POST", {
            data: new FormData(form[0]),
            contentType: false,
            processData: false,
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

    delete: (name) => {
        let title = "Delete Image"

        Common.alert("question", title, "Are you sure ? want to delete this image ?", {
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            confirmButtonColor: "var(--bs-danger)",
            cancelButtonColor: "var(--bs-secondary)"
        }).then(result => {
            if(result.isConfirmed) {
                Common.ajaxReq(baseUrl(`api/home/game/delete/${name}`), "DELETE", {
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
    }

}
