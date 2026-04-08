const Voucher = {

    table: false,

    unchecked: () => {
        if($("#checkedActionAll").prop("checked")) {
            $(".checked-action").prop("checked", true)
            $(".selected-button").show()
        } else {
            $(".checked-action").prop("checked", false)
            $(".selected-button").hide()
        }
        $("#checkedActionAll").prop("checked", false)
    },

    init: () => {
        let modalEdit = $("#editVoucherModal")
        let modalAdd = $("#addVoucherModal")
        let modalAddBulk = $("#addBulkVoucherModal")

        modalEdit.on("hidden.bs.modal", () => {
            modalEdit.find("form").trigger("reset")
            modalEdit.find("#rewardField").show()
        })
        modalAdd.on("hidden.bs.modal", () => {
            modalAdd.find("form").trigger("reset")
            modalAdd.find("#rewardField").show()
        })
        modalAddBulk.on("hidden.bs.modal", () => {
            modalAddBulk.find("form").trigger("reset")
            modalAddBulk.find("#rewardField").show()
        })
    },

    rewardType: (val, el) => {
        const el2 = $(`#${el} #rewardField`)

        if(val === "percentage") {
            el2.hide()
            $(`#${el} #rewards`).val('')
        } else {
            el2.show()
        }
    },

    counter: () => {
        Common.ajaxReq(baseUrl("api/home/voucher/counter"), "GET", {
            dataType: "JSON"
        }, () => {
            $(".counter-amount").html("loading...")
        }).then(res => {
            if(!res.status) {
                $(".counter-amount").html("Error")
                return;
            }

            console.log(res.result)

            $("#voucher-total").html(res.result.total)
            $("#voucher-unused").html(res.result.unused)
            $("#voucher-used").html(res.result.used)
            $("#voucher-claimed").html(res.result.claimed)
        }).catch(err => {
            $(".counter-amount").html("Error")
        })
    },

    loadTable: () => {
        Voucher.table = Common.global_datatable({
            selector: "table_voucher",
            url: "api/home/voucher/table",
            columns: [
                { data: "checked", className: "text-center" },
                { data: "id", className: "text-center" },
                { data: "reward" },
                { data: "name" },
                { data: "code" },
                { data: "token" },
                { data: "usage" },
                { data: "type" },
                { data: "expired" },
                { data: "action" }
            ],
            order: [1, "desc"]
        })
    },

    edit: (id) => {
        let modal = $("#editVoucherModal")
        let title = "Edit Voucher"

        Common.ajaxReq(baseUrl(`api/home/voucher/by/id/${id}`), "GET", {
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
            modal.find("#edit_voucher #id").val(data.id)
            if(data.type !== "reward") {
                modal.find("#edit_voucher #rewardField").hide();
            }
            if(data.rewards) {
                modal.find("#edit_voucher #rewardField").show();
                modal.find("#edit_voucher #rewards").val(data.rewards.id)
            }
            modal.find("#edit_voucher #type").val(data.type)
            modal.find("#edit_voucher #name").val(data.name)
            modal.find("#edit_voucher #usage").val(data.usage)
            modal.find("#edit_voucher #usage_token").val(data.condition.split(",").length > 1 ? "1" : "0")
            modal.find("#edit_voucher #code").val(data.code)
            modal.find("#edit_voucher #expired").val(data.expired_at)
        })
    },

    claim: (id) => {
        let title = "Claim Voucher"

        Common.ajaxReq(baseUrl(`api/home/voucher/claim/${id}`), "POST", {
            dataType: "JSON"
        }).then(res => {
            if(!res.status) {
                Common.alert("error", title, res.message, {
                    confirmButtonText: "Close",
                    confirmButtonColor: "var(--bs-danger)"
                })
                return
            }
            Voucher.table.ajax.reload(null, false)
            Voucher.counter()
        });
    },

    store: () => {
        let form = $("#add_voucher")
        let btn = form.find("#btn_submit")
        let title = "Tambah Voucher"
        let modal = $("#addVoucherModal")

        // let dataPayload = [
        //     // {value: form.find("#reward").val(), message: "Hadiah can't empty"},
        //     // {value: form.find("#name").val(), message: "Nama Voucher can't empty"},
        //     // {value: form.find("#code").val(), message: "Kode Voucher can't empty"}
        // ]

        // const payloadChecker = Common.payloadChecker(dataPayload)

        // if(!payloadChecker.status) {
        //     Common.alert("error", title, payloadChecker.message, {
        //         confirmButtonText: "Close",
        //         confirmButtonColor: "var(--bs-danger)"
        //     })
        //     return
        // }

        Common.ajaxReq(baseUrl("api/home/voucher/store"), "POST", {
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
                    Voucher.table.ajax.reload(null, false)
                    Voucher.counter()
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

    storeBulk: () => {
        let form = $("#add_bulk_voucher")
        let btn = form.find("#btn_submit")
        let title = "Tambah Voucher (Bulk)"
        let modal = $("#addBulkVoucherModal")

        // let dataPayload = [
        //     // {value: form.find("#reward").val(), message: "Hadiah can't empty"},
        //     // {value: form.find("#name").val(), message: "Nama Voucher can't empty"},
        //     // {value: form.find("#code").val(), message: "Kode Voucher can't empty"}
        // ]

        // const payloadChecker = Common.payloadChecker(dataPayload)

        // if(!payloadChecker.status) {
        //     Common.alert("error", title, payloadChecker.message, {
        //         confirmButtonText: "Close",
        //         confirmButtonColor: "var(--bs-danger)"
        //     })
        //     return
        // }

        Common.ajaxReq(baseUrl("api/home/voucher/store-bulk"), "POST", {
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
                    Voucher.table.ajax.reload(null, false)
                    Voucher.counter()
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
        let form = $("#edit_voucher")
        let btn = form.find("#btn_submit")
        let title = "Update Voucher"
        let modal = $("#editVoucherModal")

        let dataPayload = [
            {value: form.find("#id").val(), message: "ID can't empty"},
            // {value: form.find("#reward").val(), message: "Hadiah can't empty"},
            // {value: form.find("#name").val(), message: "Nama Voucher can't empty"},
            // {value: form.find("#code").val(), message: "Kode Voucher can't empty"},
            {value: form.find("#usage").val(), message: "Penggunaan can't empty"}
        ]

        const payloadChecker = Common.payloadChecker(dataPayload)

        if(!payloadChecker.status) {
            Common.alert("error", title, payloadChecker.message, {
                confirmButtonText: "Close",
                confirmButtonColor: "var(--bs-danger)"
            })
            return
        }

        Common.ajaxReq(baseUrl(`api/home/voucher/update/${form.find("#id").val()}`), "PUT", {
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
                    Voucher.table.ajax.reload(null, false)
                    Voucher.counter()
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
        let title = "Hapus Voucher"

        Common.alert("question", title, "Are you sure ? want to delete this voucher ?", {
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            confirmButtonColor: "var(--bs-danger)",
            cancelButtonColor: "var(--bs-secondary)"
        }).then(result => {
            if(result.isConfirmed) {
                Common.ajaxReq(baseUrl(`api/home/voucher/delete/${id}`), "DELETE", {
                    dataType: "JSON"
                }).then(res => {
                    Common.alert(res.status ? "success" : "error", title, res.message, {
                        confirmButtonText: res.status ? "Ok" : "Close",
                        confirmButtonColor: res.status ? "var(--bs-success)" : "var(--bs-danger)"
                    }).then(result => {
                        if(result.isConfirmed && res.status) {
                            Voucher.table.ajax.reload(null, false)
                            Voucher.counter()
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

    resetAll: () => {
        let title = "Reset Semua Voucher"

        Common.alert("question", title, "Are you sure ? want to reset all vouchers ?", {
            showCancelButton: true,
            confirmButtonText: "Reset",
            cancelButtonText: "Cancel",
            confirmButtonColor: "var(--bs-warning)",
            cancelButtonColor: "var(--bs-secondary)"
        }).then(result => {
            if(result.isConfirmed) {
                Common.ajaxReq(baseUrl(`api/home/voucher/reset`), "POST", {
                    dataType: "JSON"
                }).then(res => {
                    Common.alert(res.status ? "success" : "error", title, res.message, {
                        confirmButtonText: res.status ? "Ok" : "Close",
                        confirmButtonColor: res.status ? "var(--bs-success)" : "var(--bs-danger)"
                    }).then(result => {
                        if(result.isConfirmed && res.status) {
                            Voucher.table.ajax.reload(null, false)
                            Voucher.counter()
                            Voucher.unchecked()
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

    deleteAll: () => {
        let title = "Hapus Semua Voucher"

        Common.alert("question", title, "Are you sure ? want to delete all vouchers ?", {
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            confirmButtonColor: "var(--bs-danger)",
            cancelButtonColor: "var(--bs-secondary)"
        }).then(result => {
            if(result.isConfirmed) {
                Common.ajaxReq(baseUrl(`api/home/voucher/delete-all`), "POST", {
                    dataType: "JSON"
                }).then(res => {
                    Common.alert(res.status ? "success" : "error", title, res.message, {
                        confirmButtonText: res.status ? "Ok" : "Close",
                        confirmButtonColor: res.status ? "var(--bs-success)" : "var(--bs-danger)"
                    }).then(result => {
                        if(result.isConfirmed && res.status) {
                            Voucher.table.ajax.reload(null, false)
                            Voucher.counter()
                            Voucher.unchecked()
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

    resetSelected: () => {
        let title = "Reset Voucher Dipilih"

        Common.alert("question", title, "Are you sure ? want to reset selected vouchers ?", {
            showCancelButton: true,
            confirmButtonText: "Reset",
            cancelButtonText: "Cancel",
            confirmButtonColor: "var(--bs-warning)",
            cancelButtonColor: "var(--bs-secondary)"
        }).then(result => {
            if(result.isConfirmed) {
                Common.ajaxReq(baseUrl(`api/home/voucher/reset-selected`), "POST", {
                    data: {
                        checkedAction: $(".checked-action:checked").map(function() {
                            return $(this).val();
                        }).get()
                    },
                    dataType: "JSON"
                }).then(res => {
                    Common.alert(res.status ? "success" : "error", title, res.message, {
                        confirmButtonText: res.status ? "Ok" : "Close",
                        confirmButtonColor: res.status ? "var(--bs-success)" : "var(--bs-danger)"
                    }).then(result => {
                        if(result.isConfirmed && res.status) {
                            Voucher.table.ajax.reload(null, false)
                            Voucher.counter()
                            Voucher.unchecked()
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

    deleteSelected: () => {
        let title = "Hapus Voucher Dipilih"

        Common.alert("question", title, "Are you sure ? want to delete selected vouchers ?", {
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            confirmButtonColor: "var(--bs-danger)",
            cancelButtonColor: "var(--bs-secondary)"
        }).then(result => {
            if(result.isConfirmed) {
                Common.ajaxReq(baseUrl(`api/home/voucher/delete-selected`), "POST", {
                    data: {
                        checkedAction: $(".checked-action:checked").map(function() {
                            return $(this).val();
                        }).get()
                    },
                    dataType: "JSON"
                }).then(res => {
                    Common.alert(res.status ? "success" : "error", title, res.message, {
                        confirmButtonText: res.status ? "Ok" : "Close",
                        confirmButtonColor: res.status ? "var(--bs-success)" : "var(--bs-danger)"
                    }).then(result => {
                        if(result.isConfirmed && res.status) {
                            Voucher.table.ajax.reload(null, false)
                            Voucher.counter()
                            Voucher.unchecked()
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
    Voucher.loadTable()
    Voucher.init()
    Voucher.counter()
})
