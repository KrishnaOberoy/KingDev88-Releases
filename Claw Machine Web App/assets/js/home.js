const Home = {

    init: () => {
        Home.counter()
    },

    counter: () => {
        // User
        Common.ajaxReq(baseUrl("api/home/user/counter"), "GET", {
            dataType: "JSON"
        }).then(res => {
            if(!res.status) {
                $("#user-total").html("Error")
                return
            }

            $("#user-total").html(res.result.total)
        }).catch(err => {
            $("#user-total").html("Error")
        })

        // Reward
        Common.ajaxReq(baseUrl("api/home/reward/counter"), "GET", {
            dataType: "JSON"
        }).then(res => {
            if(!res.status) {
                $("#reward-total").html("Error")
                return
            }

            $("#reward-total").html(res.result.total)
        }).catch(err => {
            $("#reward-total").html("Error")
        })
    }

}

Home.init()
