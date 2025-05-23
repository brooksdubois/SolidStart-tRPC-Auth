import { createSignal } from "solid-js";
import { fromFetch } from "rxjs/fetch";
import { switchMap, catchError } from "rxjs/operators";
import { of } from "rxjs";
import "../../app.css";
import TextInput from "~/components/TextInput";
import FancyButton from "~/components/FancyButton";

const baseUrl = "http://localhost:3000/api/users"

export default function Users() {
    const [username, setUsername] = createSignal("");
    const [password, setPassword] = createSignal("");
    const [message, setMessage] = createSignal("");

    const authAction = (endpoint: string)=> ()  => {
        fromFetch(`${baseUrl}/${endpoint}`, {
            method: "POST", credentials: "include",//Sends & receives cookies
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username(), password: password() }),
        }).pipe(
            switchMap((res) => res.text()),
            catchError((err) => of(`Error: ${err.message}`))
        ).subscribe(setMessage);
    };

    const action = (endpoint: string)=> ()  => {
        fromFetch(`${baseUrl}/${endpoint}`, {
            method: "POST", credentials: "include",
        }).pipe(
            switchMap((res) => res.text()),//convert response to text
            catchError((err) => of(`Error: ${err.message}`))
        ).subscribe(setMessage);
    };

    return <div class="text-center">
        <h2>Auth Demo (RxJS)</h2>
        <TextInput
            placeholder="Username"
            onInput={(e) => setUsername(e.currentTarget.value)}
        />
        <TextInput
            type="password"
            placeholder="Password"
            onInput={(e) => setPassword(e.currentTarget.value)}
        />

        <FancyButton onClick={authAction("signup")}>Sign Up</FancyButton>
        <FancyButton onClick={authAction("login")}>Log In</FancyButton>
        <FancyButton onClick={authAction("profile")}>Check Me</FancyButton>
        <FancyButton onClick={action("logout")}>Logout</FancyButton>

        <p class="mt-5 ml-20 text-xs text-left">
            <b>Response:</b> {message()}
        </p>
    </div>;
}
