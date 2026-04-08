const User = {

    table: false,

    tableRole: false,

    init: () => {
        let modalEdit = $("#editUserModal")
        let modalAdd = $("#addUserModal")

        modalEdit.on("hidden.bs.modal", () => {
            modalEdit.find("form").trigger("reset")
        })
        modalAdd.on("hidden.bs.modal", () => {
            modalAdd.find("form").trigger("reset")
        })
    },

    loadTable: () => {
        User.table = Common.global_datatable({
            selector: "table_user",
            url: "api/home/user/table",
            columns: [
                { data: "id", className: "text-center" },
                { data: "name" },
                { data: "status" },
                { data: "role" },
                { data: "username" },
                { data: "action" }
            ],
            order: [0, "desc"]
        })
    },

    loadTableRole: () => {
        User.tableRole = Common.global_datatable({
            selector: "table_role",
            url: "api/home/user/table-role",
            columns: [
                { data: "id" },
                { data: "name" },
                { data: "action" }
            ],
            order: [0, "desc"]
        })
    },

    edit: (token) => {
        let modal = $("#editUserModal")
        let title = "Edit Pengguna"

        Common.ajaxReq(baseUrl(`api/home/user/by/token/${token}`), "GET", {
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
            modal.find("#edit_user #token").val(data.token)
            modal.find("#edit_user #role").val(data.role.id)
            modal.find("#edit_user #status").val(data.status)
            modal.find("#edit_user #name").val(data.name)
            modal.find("#edit_user #username").val(data.username)
        })
    },

    store: () => {
        let form = $("#add_user")
        let btn = form.find("#btn_submit")
        let title = "Tambah Pengguna"
        let modal = $("#addUserModal")

        let dataPayload = [
            {value: form.find("#role").val(), message: "Role can't empty"},
            {value: form.find("#status").val(), message: "Status can't empty"},
            {value: form.find("#name").val(), message: "Nama can't empty"},
            {value: form.find("#username").val(), message: "Username can't empty"},
            {value: form.find("#password").val(), message: "Password can't empty"},
        ]

        const payloadChecker = Common.payloadChecker(dataPayload)

        if(!payloadChecker.status) {
            Common.alert("error", title, payloadChecker.message, {
                confirmButtonText: "Close",
                confirmButtonColor: "var(--bs-danger)"
            })
            return
        }

        Common.ajaxReq(baseUrl("api/home/user/store"), "POST", {
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
                    modal.modal("hide")
                    User.table.ajax.reload(null, false)
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
        let form = $("#edit_user")
        let btn = form.find("#btn_submit")
        let title = "Update Pengguna"
        let modal = $("#editUserModal")

        let dataPayload = [
            {value: form.find("#token").val(), message: "Token can't empty"},
            {value: form.find("#role").val(), message: "Role can't empty"},
            {value: form.find("#status").val(), message: "Status can't empty"},
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

        Common.ajaxReq(baseUrl(`api/home/user/update/${form.find("#token").val()}`), "PUT", {
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
                    modal.modal("hide")
                    User.table.ajax.reload(null, false)
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

    delete: (token) => {
        let title = "Hapus Pengguna"

        Common.alert("question", title, "Are you sure ? want to delete this user ?", {
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            confirmButtonColor: "var(--bs-danger)",
            cancelButtonColor: "var(--bs-secondary)"
        }).then(result => {
            if(result.isConfirmed) {
                Common.ajaxReq(baseUrl(`api/home/user/delete/${token}`), "DELETE", {
                    dataType: "JSON"
                }).then(res => {
                    Common.alert(res.status ? "success" : "error", title, res.message, {
                        confirmButtonText: res.status ? "Ok" : "Close",
                        confirmButtonColor: res.status ? "var(--bs-success)" : "var(--bs-danger)"
                    }).then(result => {
                        if(result.isConfirmed && res.status) {
                            User.table.ajax.reload(null, false)
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
    User.loadTable()
    // User.loadTableRole()
    User.init()
})
