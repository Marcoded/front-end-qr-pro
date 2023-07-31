export default function urlMaker() {
    if (process.env.NODE_ENV === "production") return "https://back-end-qr-code.fly.dev/"
    return "http://localhost:3000/"
}