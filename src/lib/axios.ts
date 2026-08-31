import axios from "axios"


const api = axios.create({

    baseURL:
        "http://localhost:8080/api",

    headers: {
        "Content-Type": "application/json",
    },

})


// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem(
                "finora_token"
            )


        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`
        }


        return config
    },

    (error) => {

        return Promise.reject(error)
    }
)


// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(

    (response) => {

        return response
    },

    (error) => {

        const status =
            error.response?.status


        // =================================================
        // UNAUTHORIZED
        // =================================================

        if (status === 401) {

            localStorage.removeItem(
                "finora_token"
            )

            localStorage.removeItem(
                "finora_user"
            )


            if (
                !window.location.pathname.includes(
                    "/login"
                )
            ) {

                window.location.href =
                    "/login"
            }
        }


        // =================================================
        // FORBIDDEN
        // =================================================

        if (status === 403) {

            console.error(
                "403 Forbidden:",
                error.config?.url
            )

            console.error(
                "JWT exists:",
                Boolean(
                    localStorage.getItem(
                        "finora_token"
                    )
                )
            )
        }


        return Promise.reject(error)
    }
)


export default api