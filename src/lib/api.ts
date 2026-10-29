import wretch from "wretch";

const api = wretch("/api").accept("application/json");

export const WretchError = wretch.WretchError;

export default api;
