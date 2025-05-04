import {createSignal} from "solid-js";

interface TodoProps {
  id: string;
  data: string;
  isEnabled: boolean;
}

export default function Todo(props: TodoProps) {
    const [checked, setChecked] = createSignal(props.isEnabled); // Local state for checkbox

    const todoDelete = () => {
        console.log("TODO Delete called", props.id)
    }
    return (
      <div class={'flex flex-row justify-center gap-4'}>
          <pre>{props.data}</pre>
          <input
              type="checkbox"
              checked={checked()}
              onChange={() => {
                  console.log("TODO IS CHANGED", props.id)
              }}
          />
          <button
              class={
                  'rounded border-2 border-black bg-red-300 px-4 transition-all hover:bg-red-400 active:bg-red-400 disabled:cursor-not-allowed disabled:bg-red-400'
              }
              onClick={todoDelete}>
              X
          </button>
      </div>
  );
}
