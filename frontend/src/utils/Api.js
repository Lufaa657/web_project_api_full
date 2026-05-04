import { getToken } from "./token";

class Api {
  constructor(options) {

    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  _checkResponse(res) {
    return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: {
        authorization: `Bearer ${getToken()}`,
      },
    }).then(this._checkResponse);
  }

  addNewCard(data) {
    return fetch(`${this._baseUrl}/cards/`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(this._checkResponse);
  }


  editLikeStatus(isLiked, id) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: !isLiked ? "PUT" : "DELETE",
      headers: {
        authorization: `Bearer ${getToken()}`,
      },
    }).then(this._checkResponse);
  }


  deleteCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    }).then(this._checkResponse);
  }


  updateUserAvatar(user) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }).then(this._checkResponse);
  }


  updateUserInfo(userInfo) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: {
        Accept: "aplication/json",
        "Content-Type": "application/json",
        authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(userInfo),
    }).then(this._checkResponse);
  }
}

export const api = new Api({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
});