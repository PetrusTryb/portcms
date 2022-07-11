export default function Cookies(){
    let wasClosed = localStorage.getItem("cookiesConsent") === "true";
    let closeCookies = () => {
        localStorage.setItem("cookiesConsent", "true");
        document.location.reload()
    }
    if (!wasClosed)
    return (
        <div className="fixed bottom-4 right-1 lg:right-4 p-4 bg-white border-t-4 shadow-lg">
            <h2 className="text-lg lg:text-xl mb-4 block font-bold leading-tight text-gray-600">Cookie Policy</h2>
            <div className="lg:flex lg:space-x-5">
                <p className="mb-5 font-medium text-gray-600">
                    PortCMS uses cookies, local storage and session storage to store your preferences and to improve your experience.
                </p>
                <button onClick={closeCookies}
                    className="w-full lg:w-48 px-3 py-1 bg-gray-300 hover:bg-gray-200 hover:underline rounded text-gray-700 mr-2 mb-5 uppercase tracking-widest text-xs font-bold">
                    I agree
                </button>
            </div>
        </div>
    )
    else
        return <div></div>;
}