import FancyButton from "~/components/FancyButton";
import {createSignal, For, onCleanup, onMount} from "solid-js";
import {getClient, logError, unsubscribeAll} from "~/util/rxUtils";
import Todo from "~/components/Todo";
import { Todo as TodoSchema } from "~/db/todo/schema"
import TextInput from "~/components/TextInput";

const client = getClient()

const [newTodoText, setNewTodoText] = createSignal("");

const createTodo = () =>
    client.createTodo
        .mutate({data: newTodoText()})
        .then(() => setNewTodoText(""))
        .catch(logError);

export default function Home() {
    const [todoList, setTodoList] = createSignal<[TodoSchema] | null>(null);

    onMount(() => {
        const valueSub = client.onTodoListChange.subscribe(undefined, {
            onData: setTodoList,
            onError: logError,
        });

        onCleanup(unsubscribeAll(valueSub.unsubscribe, valueSub.unsubscribe));
    });

    return (
        <main>
            <For each={todoList()}>
                {(todo) => (
                    <div class='mb-2'>
                        <Todo id={todo.id} data={todo.data} isEnabled={todo.isEnabled}/>
                    </div>
                )}
            </For>
            <div class="flex items-center gap-2 mb-4 w-full max-w-[400px] mx-auto">
                <TextInput
                    value={newTodoText()}
                    onInput={(e) => setNewTodoText(e.currentTarget.value)}
                />
                <FancyButton onClick={createTodo}>Create</FancyButton>
            </div>
        </main>
    );
}
