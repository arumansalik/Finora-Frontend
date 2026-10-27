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
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const requestUrl = error.config?.url ?? "";

        // Don't redirect for invalid login or registration attempts.
        const isAuthRequest =
            requestUrl.includes("/auth/login") ||
            requestUrl.includes("/auth/register");

        if (status === 401 && !isAuthRequest) {
            localStorage.removeItem("finora_token");
            localStorage.removeItem("finora_user");

            if (window.location.pathname !== "/login") {
                window.location.replace("/login");
            }
        }

        return Promise.reject(error);
    }
);



export default api