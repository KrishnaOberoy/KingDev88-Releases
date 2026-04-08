const Common = {

    ajaxReq: function(url, method, options = {}, beforeSend = () => {}) {
        if (typeof options !== "object") {
            throw new Error('options parameter must be an object.')
        }

        if (typeof beforeSend !== 'function') {
            throw new Error('beforeSend parameter must be a function.')
        }

        return new Promise((resolve, reject) => {
            $.ajaxSetup(options)

            $.ajax({
                url: url,
                method: method,
                beforeSend: beforeSend,
                success: function(res) {
                    resolve(res)
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    reject({
                        status: jqXHR.status,
                        statusText: textStatus,
                        responseText: jqXHR.responseText,
                        error: errorThrown
                    })
                }
            })
        })
    },

    showHide: (parent = false, toggle, password) => {
        console.log(parent)
        if(parent) {
            const toggleId = $(parent).find("#shToggle")
            const passwordEl = $(parent).find("input[name=password]")

            $(toggleId).find("i").toggleClass("ri-eye-line ri-eye-off-line")

            $(passwordEl).attr("type", $(passwordEl).attr("type") === "text" ? "password" : "text")
        } else {
            const toggleId = $(toggle)
            const passwordEl = $(password)

            toggleId.find("i").toggleClass("ri-eye-line ri-eye-off-line")
            passwordEl.attr("type", $(passwordEl).attr("type") === "text" ? "password" : "text")
        }
    },

    alert: (type = false, title = false, message = null, options = {}) => {
        const defaultConfig = {
            icon: type,
            title: title,
            html: message,
            ...options
        }

        return Swal.fire(defaultConfig)
    },

    payloadChecker: function(data) {
        let status = true
        let message = ""

        $.each(data.reverse(), (k, v) => {
            if (v.value === "" || v.value === null) {
                status = false
                message = v.message
            }
        })

        return {
            status: status,
            message: message,
            data: data
        }
    },

    nl2br: function(str) {
        return str.replace(/\n/g, "<br>")
    },

    urlencode: (str) => {
        return encodeURIComponent(str)
            .replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*/g, '%2A')
            .replace(/%20/g, '+')
    },

    urldecode: (str) => {
        return decodeURIComponent(str.replace(/\+/g, ' '))
    },

    global_datatable: (opt) => {
        let datatable = $("#"+ opt.selector).DataTable({
            paging: true,
            language: {
                lengthMenu: "Tampilkan&emsp;_MENU_&emsp;Baris",
                search: "Cari :&emsp;",
                emptyTable: "<span class='text-danger'>Tidak Ada Data<span>",
                info: "Menampilkan _START_ - _END_ dari total data <b>_MAX_</b>",
                infoEmpty: "",
                infoFiltered: " ",
                zeroRecords: "<span class='text-danger'>Hasil tidak ditemukan<span>",
                paginate: {
                    first: "Awal",
                    last: "Akhir",
                    next: "Selanjutnya",
                    previous: "Sebelumnya"
                }
            },
            processing: true,
            serverSide: true,
            ajax: {
                url: baseUrl(opt.url),
                type: "POST",
                dataType: "JSON"
            },
            columns: opt.columns,
            order: (typeof opt.order !== "undefined" ? opt.order : false),
        });

        return datatable;
    },

    general_datatable: (opt) => {
        let datatable = $("#"+ opt.selector).DataTable({
            paging: true,
            language: {
                lengthMenu: "Tampilkan&emsp;_MENU_&emsp;Baris",
                search: "Cari :&emsp;",
                emptyTable: "<span class='text-danger'>Tidak Ada Data<span>",
                info: "Menampilkan _START_ - _END_ dari total data <b>_MAX_</b>",
                infoEmpty: "",
                infoFiltered: " ",
                zeroRecords: "<span class='text-danger'>Hasil tidak ditemukan<span>",
                paginate: {
                    first: "Awal",
                    last: "Akhir",
                    next: "Selanjutnya",
                    previous: "Sebelumnya"
                }
            }
        });

        return datatable;
    },

    sidenav: () => {
        $(window).on("load", () => {
            if($(this).width() > 720) {
                $("#sidenav").removeClass("hide").addClass("show");
            } else {
                $("#sidenav").removeClass("show").addClass("hide");
            }
        }).resize(() => {
            if($(this).width() > 720) {
                $("#sidenav").removeClass("hide").addClass("show");
            } else {
                $("#sidenav").removeClass("show").addClass("hide");
            }
        });
    },

    sidenavToggle: () => {
        $("#sidenav").toggleClass("show hide");
    }

}

Common.sidenav();
