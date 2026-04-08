const Reward = {

    table: false,

    init: () => {
        let modalEdit = $("#editRewardModal")
        let modalAdd = $("#addRewardModal")

        modalEdit.on("hidden.bs.modal", () => {
            modalEdit.find("form").trigger("reset")
        })
        modalAdd.on("hidden.bs.modal", () => {
            modalAdd.find("form").trigger("reset")
        })
    },

    loadTable: () => {
        Reward.table = Common.global_datatable({
            selector: "table_reward",
            url: "api/home/reward/table",
            columns: [
                { data: "id", className: "text-center" },
                { data: "name" },
                { data: "type" },
                { data: "percentage" },
                { data: "action" }
            ],
            order: [0, "desc"]
        })
    },

    edit: (id) => {
        let modal = $("#editRewardModal")
        let title = "Edit Hadiah"

        Common.ajaxReq(baseUrl(`api/home/reward/by/id/${id}`), "GET", {
            dataType: "JSON"
        }).then(res => {
            if(!res.status) {
                Common.alert("error", title, res.message, {
                    confirmButtonText: "Close",
                    confirmButtonColor: "var(--bs-danger)"
                })
                return
            }

            let data = res.result

            modal.modal("show")
            modal.find("#edit_reward #id").val(data.id)
            modal.find("#edit_reward #name").val(data.name)
            modal.find("#edit_reward #reward_type").val(data.reward_type)
            modal.find("#edit_reward #percentage").val(data.percentage)
            modal.find("#edit_reward #main_reward").val(data.main_reward)
            console.log(data.percentage)
            if(!data.image) {
                $("#imageNull").show();
                $("#imageNotNull").hide();
            } else {
                $("#imageNotNull").show();
                $("#imageNull").hide();

                $("#imageNotNull").html(`
                <span class="d-block mb-2">Gambar</span>
                <div class="d-flex align-items-center">
                    <img src="${baseUrl(data.image)}" class="me-3" style="height: 100px">
                    <button class="btn btn-danger" type="button" onclick="Reward.deleteImage('image', ${data.id})">Delete</button>
                </div>`);
            }
        })
    },

    store: () => {
        let form = $("#add_reward")
        let btn = form.find("#btn_submit")
        let title = "Tambah Hadiah"
        let modal = $("#addRewardModal")

        let dataPayload = [
            {value: form.find("#name").val(), message: "Hadiah can't empty"},
            {value: form.find("#percentage").val(), message: "Persentase Kemenangan can't empty"}
        ]

        const payloadChecker = Common.payloadChecker(dataPayload)

        if(!payloadChecker.status) {
            Common.alert("error", title, payloadChecker.message, {
                confirmButtonText: "Close",
                confirmButtonColor: "var(--bs-danger)"
            })
            return
        }

        Common.ajaxReq(baseUrl("api/home/reward/store"), "POST", {
            data: new FormData(form[0]),
            processData: false,
            contentType: false,
        }, () => {
            btn.prop("disabled", true).html("loading...")
        }).then(res => {
            Common.alert(res.status ? "success" : "error", title, res.message, {
                confirmButtonText: res.status ? "Ok" : "Close",
                confirmButtonColor: res.status ? "var(--bs-success)" : "var(--bs-danger)"
            }).then(result => {
                if(result.isConfirmed && res.status) {
                    // modal.modal("hide")
                    // Reward.table.ajax.reload(null, false)
                    location.reload()
                }
            })
        }).catch(err => {
            Common.alert("error", title, err.responseText, {
                confirmButtonText: "Close",
                confirmButtonColor: "var(--bs-danger)"
            })
        }).finally(() => {
            btn.prop("disabled", false).html("Tambah")
        })
    },

    update: () => {
        let form = $("#edit_reward")
        let btn = form.find("#btn_submit")
        let title = "Update Hadiah"
        let modal = $("#editRewardModal")

        let dataPayload = [
            {value: form.find("#id").val(), message: "ID can't empty"},
            {value: form.find("#name").val(), message: "Nama can't empty"},
            {value: form.find("#percentage").val(), message: "Persentase Kemenangan can't empty"}
        ]

        const payloadChecker = Common.payloadChecker(dataPayload)

        if(!payloadChecker.status) {
            Common.alert("error", title, payloadChecker.message, {
                confirmButtonText: "Close",
                confirmButtonColor: "var(--bs-danger)"
            })
            return
        }

        Common.ajaxReq(baseUrl(`api/home/reward/update/${form.find("#id").val()}`), "POST", {
            data: new FormData(form[0]),
            processData: false,
            contentType: false,
        }, () => {
            btn.prop("disabled", true).html("loading...")
        }).then(res => {
            Common.alert(res.status ? "success" : "error", title, res.message, {
                confirmButtonText: res.status ? "Ok" : "Close",
                confirmButtonColor: res.status ? "var(--bs-success)" : "var(--bs-danger)"
            }).then(result => {
                if(result.isConfirmed && res.status) {
                    // modal.modal("hide")
                    // Reward.table.ajax.reload(null, false)
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

    delete: (id) => {
        let title = "Hapus Hadiah"

        Common.alert("question", title, "Are you sure ? want to delete this reward ?", {
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            confirmButtonColor: "var(--bs-danger)",
            cancelButtonColor: "var(--bs-secondary)"
        }).then(result => {
            if(result.isConfirmed) {
                Common.ajaxReq(baseUrl(`api/home/reward/delete/${id}`), "DELETE", {
                    dataType: "JSON"
                }).then(res => {
                    Common.alert(res.status ? "success" : "error", title, res.message, {
                        confirmButtonText: res.status ? "Ok" : "Close",
                        confirmButtonColor: res.status ? "var(--bs-success)" : "var(--bs-danger)"
                    }).then(result => {
                        if(result.isConfirmed && res.status) {
                            Reward.table.ajax.reload(null, false)
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

    deleteImage: (name, id) => {
        let title = "Delete Image"

        Common.alert("question", title, "Are you sure ? want to delete this image ?", {
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            confirmButtonColor: "var(--bs-danger)",
            cancelButtonColor: "var(--bs-secondary)"
        }).then(result => {
            if(result.isConfirmed) {
                Common.ajaxReq(baseUrl(`api/home/reward/delete-image/${name}/${id}`), "DELETE", {
                    dataType: "JSON"
                }).then(res => {
                    $("#editRewardModal").modal("hide");
                    Common.alert(res.status ? "success" : "error", title, res.message, {
                        confirmButtonText: res.status ? "Ok" : "Close",
                        confirmButtonColor: res.status ? "var(--bs-success)" : "var(--bs-danger)"
                    }).then(result => {
                        if(result.isConfirmed && res.status) {
                            Reward.edit(id)
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

$(document).ready(() => {
    Reward.loadTable()
    Reward.init()
})
