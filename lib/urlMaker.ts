export default function urlMaker() {
    if (process.env.NODE_ENV === "production") return "ADD SERVER URL HERE"
    return "http://localhost:3000/"
}