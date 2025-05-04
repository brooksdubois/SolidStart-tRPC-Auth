export default function Button(props: any) {
    const disabled = () =>
        typeof props.disabled === "function" ? props.disabled() : props.disabled;

    const className = () =>
        disabled()
            ? "relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium rounded-lg bg-gradient-to-br from-green-400 to-blue-600 cursor-not-allowed"
            : "relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800";

    const spanClass = () =>
        disabled()
            ? "relative px-5 py-2.5 bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 rounded-md"
            : "relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent";

    return (
        <button
            disabled={disabled()}
            onClick={props.onClick}
            class={`${className()} ${props.class || ""}`}
        >
            <span class={spanClass()}>{props.children}</span>
        </button>
    );
}