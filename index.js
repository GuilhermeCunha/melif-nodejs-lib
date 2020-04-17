'use strict';
var axios = require('axios');

var Melif = function (config) {
    var config = config;
    var Api = axios.create({
        baseURL: config.api_root_url,
    });

    // ---------- START OF AUTHORIZATION AREA ----------
    this.getAuthUrl = function (redirect_uri) {
        var query = {
            response_type: 'code',
            client_id: config.client_id,
            redirect_uri: redirect_uri
        };
        return config.auth_url + this.convertObjectToQueryString(query);
    }

    this.authorize = async function (code, redirect_uri) {
        var data = await axios.post(config.oauth_url, {
            grant_type: 'authorization_code',
            client_id: config.client_id,
            client_secret: config.client_secret,
            code: code,
            redirect_uri: redirect_uri
        }).then((result) => {
            return result.data;
        }).catch((err) => {
            console.log(err);
            return null;
        });
        if (data) {
            return {
                refresh_token: data.refresh_token,
                access_token: data.access_token,
                expires_in: data.expires_in,
                user_id: data.user_id,
                scope: data.scope,
                token_type: data.token_type
            }
        }
        return null;
    };

    this.refreshToken = async function (refresh_token) {
        var query = this.convertObjectToQueryString({
            grant_type: 'refresh_token',
            client_id: config.client_id,
            client_secret: config.client_secret,
            refresh_token: refresh_token
        });

        var data = await axios.post(`${config.oauth_ur}${query}`, {})
            .then((result) => {
                return result.data;
            }).catch((err) => {
                console.log(err);
                return null;
            });
        return data;
    }
    // ---------- END OF AUTHORIZATION AREA ----------

    // ---------- START OF USER AREA ----------
    this.getUserById = async function (user_id, access_token) {
        var data = await Api.get(`/users/${user_id}`, {
            params: {
                access_token: access_token
            }
        }).then((result) => {
            return result.data;
        }).catch((err) => {
            console.log(err);
            return null;
        });

        return data;
    }
    this.getUserByNickname = async function (nickname) {
        var data = await Api.get('/sites/MLB/search', {
            params: {
                nickname: nickname
            }
        }).then((result) => {
            return result.data;
        }).catch((err) => {
            console.log(err);
            return null;
        });

        return data;
    }

    this.getUserReputationById = async function (user_id) {
        var data = await Api.get(`/users/${user_id}`, {
        }).then((result) => {
            return result.data;
        }).catch((err) => {
            console.log(err);
            return null;
        });

        return data;
    }

    // ---------- END OF USER AREA ----------


    // ---------- START OF ITEMS AREA ----------
    this.createItem = async function (item, access_token) {
        //  TODO Verify if this call is Ok (parsing query and body) 
        var query = this.convertObjectToQueryString({
            access_token: access_token
        });
        var data = await Api.post(`/items${query}`, item)
            .then((result) => {
                return result.data;
                // TODO Implement the description
            }).catch((err) => {
                //return err;
                console.log(err.response.data);

                return null;
            });

        return data;
    }
    this.getItemIdsByUserId = async function (user_id, access_token, status, limit = 20, offset = 0) {
        // TODO Continue development
        var data = await Api.get(`/users/${user_id}/items/search`, {
            params: {
                status: status,
                limit: limit,
                offset: offset,
                access_token: access_token
            }
        }).then((result) => {
            return result.data;
        }).catch((err) => {
            console.log(err);
            return null;
        });
        return data;
    }
    this.getItemsByIds = async function (array_of_item_ids, access_token) {
        var ids = array_of_item_ids.join(",");
        var data = await Api.get('/items', {
            params: {
                ids: ids,
                access_token: access_token
            }
        })
            .then((result) => {
                return result.data;
            }).catch((err) => {
                console.log(err);
                return null;
            });

        return data;
    }
    this.getItemById = async function (item_id, access_token = null) {
        var data = await Api.get('/items', {
            params: {
                id: item_id,
                access_token: access_token
            }
        })
            .then((result) => {
                return result.data;
            }).catch((err) => {
                console.log(err);
                return null;
            });

        return data;
    }
    this.getDescriptionById = async function (item_id) {
        var data = await Api.get(`/items/${item_id}/description`, {})
            .then((result) => {
                return result.data;
            }).catch((err) => {
                console.log(err);
                return null;
            });

        return data;
    }
    this.setDescriptionById = async function (item_id, access_token, description) {
        var query = this.convertObjectToQueryString({
            access_token: access_token
        });
        var data = await Api.put(`/items/${item_id}/description${query}`, {
            plain_text: description
        })
            .then((result) => {
                return result.data;
            }).catch((err) => {
                console.log(err);
                return null;
            });

        return data;
    }
    this.setItemStatusById = async function (item_id, access_token, status) {
        //  TODO Verify if this call is Ok (parsing query and body)
        var query = this.convertObjectToQueryString({
            access_token: access_token
        });
        var data = await Api.put(`/items/${item_id}${query}`, {
            status: status
        })
            .then((result) => {
                return result.data;
            }).catch((err) => {
                console.log(err);
                return null;
            });

        return data;
    }
    // ---------- END OF ITEMS AREA ----------

    // ---------- START OF ORDERS AREA ----------
    this.getOrderByResource = async function (resource, access_token) {
        var data = await Api.get(resource, {
            params: {
                access_token: access_token
            }
        })
            .then((result) => {
                return result.data;
            }).catch((err) => {
                console.log(err);
                return null;
            });

        return data;
    }
    this.setOrderAsDeliveredById = async function (order_id, access_token) {
        //  TODO Verify if this call is Ok (parsing query and body)
        var query = this.convertObjectToQueryString({
            access_token: access_token
        });
        var data = await Api.post(`/orders/${order_id}/feedback${query}`, {
            fulfilled: true,
            rating: "positive"
        })
            .then((result) => {
                return result.data;
            }).catch((err) => {
                console.log(err);
                return null;
            });

        return data;
    }
    // ---------- END OF ORDERS AREA ----------

    // ---------- START OF QUESTIONS AREA ----------
    this.getQuestionByResource = async function (resource, access_token) {
        var data = await Api.get(resource, {
            params: {
                access_token: access_token
            }
        })
            .then((result) => {
                return result.data;
            }).catch((err) => {
                console.log(err);
                return null;
            });

        return data;
    }

    this.answerQuestionById = async function (question_id, access_token, answer) {
        //  TODO Verify if this call is Ok (parsing query and body)
        var query = this.convertObjectToQueryString({
            access_token: access_token
        });
        var data = await Api.post(`/answers${query}`, {
            question_id: question_id,
            text: answer
        })
            .then((result) => {
                return result.data;
            }).catch((err) => {
                console.log(err);
                return null;
            });

        return data;
    }
    // ---------- END OF QUESTIONS AREA ----------

    // ---------- START OF MESSAGES AREA ----------

    this.getMessagesByOrderAndSellerId = async function (order_id, access_token, seller_id) {
        var data = await Api.get(`/messages/packs/${order_id}/sellers/${seller_id}`, {
            params: {
                access_token: access_token
            }
        })
            .then((result) => {
                return result.data;
            }).catch((err) => {
                console.log(err);
                return null;
            });

        return data;
    }

    this.sendMessageByOrder = async function (order, access_token, message) {
        var query = this.convertObjectToQueryString({
            access_token: access_token
        });
        var data = await Api.post(`/messages/packs/${order.id}/sellers/${order.seller.id}${query}`, {
            from: {
                user_id: order.seller.id,
                email: order.seller.email
            },
            to: {
                user_id: order.buyer.id
            },
            text: message
        })
            .then((result) => {
                return result.data;
            }).catch((err) => {
                console.log(err);
                return null;
            });

        return data;
    }
    // ---------- END OF MESSAGES AREA ----------

    /**
     *
     * @param {object} obj this object convert in query string, example: {a: 1, b: "hello"} ?a=1&b=hello
     * @returns {string}
     */
    this.convertObjectToQueryString = function (obj) {
        // Clone the object obj and loose the reference
        obj = Object.create(obj);
        var result = '?';
        for (var i in obj) {
            result += i + "=";
            if (obj[i] != undefined) {
                if (Array.isArray(obj[i])) {
                    result += obj[i].join() + "&";
                } else {
                    result += obj[i] + "&";
                }
            }
        }
        if (result[result.length - 1] == '&') {
            result = result.substr(0, result.length - 1);
        }
        if (result == '?')
            result = '';
        return result;
    }

}
module.exports = Melif;
