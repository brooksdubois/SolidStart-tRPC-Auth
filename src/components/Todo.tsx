import {createSignal} from "solid-js";
import {getClient, logError} from "~/util/rxUtils";

interface TodoProps {
  id: string;
  data: string;
  isEnabled: boolean;
}

const client = getClient()

export default function Todo(props: TodoProps) {
    const [checked, setChecked] = createSignal(props.isEnabled); // Local state for checkbox

    const updateTodoCheckbox = (e: Event) => {
        const isChecked = (e.currentTarget as HTMLInputElement).checked;
        setChecked(isChecked); // optimistic update
        client.updateTodoChecked
            .mutate({ id: props.id, isEnabled: isChecked })
            .catch((err) => {
                logError(err);
                setChecked(!isChecked); // rollback if failed
            });
    };

    const todoDelete = () => {
        client.deleteTodo.mutate({ id: props.id }).catch(logError)
    }

    return (
      <div class={'flex flex-row justify-center gap-4'}>
          <pre>{props.data}</pre>
          <input
              type="checkbox"
              checked={checked()}
              onChange={updateTodoCheckbox}
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
