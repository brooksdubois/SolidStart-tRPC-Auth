import FancyButton from "~/components/FancyButton";
import {createSignal, For, onCleanup, onMount} from "solid-js";
import {getClient, logError, unsubscribeAll} from "~/util/rxUtils";
import Todo from "~/components/Todo";
import { Todo as TodoSchema } from "~/db/todo/schema"
import TextInput from "~/components/TextInput";

const client = getClient()

export default function Index() {
    const [todoList, setTodoList] = createSignal<[TodoSchema] | null>(null);
    const [newTodoText, setNewTodoText] = createSignal("");
    const [isSubmitting, setIsSubmitting] = createSignal(false);

    const createTodo = async () => {
        if (!newTodoText().trim()) return;
        if (isSubmitting()) return;
        setIsSubmitting(true);
        try {
            await client!.createTodo.mutate({ data: newTodoText() });
            setNewTodoText("");
        } catch (err) {
            logError(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    onMount(() => {
        const valueSub = client!.onTodoListChange.subscribe(undefined, {
            onData: setTodoList,
            onError: logError,
        });

        onCleanup(unsubscribeAll(valueSub!.unsubscribe));
    });

    return (
        <>
            <For each={todoList()}>
                {(todo) => (
                    <div class='mb-1 mt-1'>
                        <Todo id={todo.id} data={todo.data} isEnabled={todo.isEnabled}/>
                    </div>
                )}
            </For>
            <div class="flex items-center gap-2 mb-4 w-full max-w-[400px] mx-auto">
                <TextInput
                    placeholder="Enter todo..."
                    value={newTodoText()}
                    onInput={(e) => setNewTodoText(e.currentTarget.value)}
                    onKeyDown={async (e) => {
                        if (e.key === "Enter") await createTodo();
                    }}
                    disabled={isSubmitting()}
                />
                <FancyButton
                    onClick={createTodo}
                    disabled={isSubmitting()}
                >
                    Create
                </FancyButton>
            </div>
        </>
    );
}
