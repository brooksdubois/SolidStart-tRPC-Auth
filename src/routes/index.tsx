import Button from "~/components/button";
import {createSignal, For, onCleanup, onMount} from "solid-js";
import {getClient, logError, unsubscribeAll} from "~/util/rxUtils";
import Todo from "~/components/Todo";
import { Todo as TodoSchema } from "~/db/todo/schema"

const client = getClient()


const createTodo = () => client.createTodo.mutate({ data: "hello Brooks" }).catch(logError);

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
            <div>
                <For each={todoList()}>
                    {(todo) => (
                        <div class='mb-2'>
                            <Todo id={todo.id} data={todo.data} isEnabled={todo.isEnabled}/>
                        </div>
                    )}
                </For>
                <Button onClick={createTodo}>Create Todo</Button>
            </div>
        </main>
    );
}
