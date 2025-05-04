import type { JSX } from "solid-js";

type TextInputProps = {
    value: string;
    onInput: JSX.EventHandlerUnion<HTMLInputElement, InputEvent>;
};

const TextInput = (props: TextInputProps) => (
    <input
        type="text"
        class="max-w-[200px] flex-grow shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
        value={props.value}
        onInput={props.onInput}
        placeholder="Enter todo..."
    />
);

export default TextInput;
